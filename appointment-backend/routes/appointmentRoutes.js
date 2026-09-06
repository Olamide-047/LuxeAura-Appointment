const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Helper to convert "02:30 PM" format into minutes past midnight for backend time validation
const parseSlotToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// 1. GET booked time slots for a given date
router.get('/booked-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });
    const appointments = await Appointment.find({ date, status: { $ne: 'Cancelled' } });
    const slots = appointments.map(a => a.timeSlot);
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST create a new booking
router.post('/book', async (req, res) => {
  const { userName, userEmail, userPhone, serviceName, price, date, timeSlot, notes } = req.body;

  if (!userName || !userEmail || !serviceName || !price || !date || !timeSlot) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    // Prevent booking past dates/times on the server level
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({ message: 'Cannot book an appointment for a past date.' });
    }

    if (date === todayStr) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = parseSlotToMinutes(timeSlot);

      if (slotMinutes <= currentMinutes) {
        return res.status(400).json({ message: 'This time slot has already passed for today.' });
      }
    }

    // Check if slot is already active/taken
    const existingSlot = await Appointment.findOne({ date, timeSlot, status: { $ne: 'Cancelled' } });
    if (existingSlot) {
      return res.status(400).json({ message: 'This slot is already booked! Pick another time.' });
    }

    const appointment = new Appointment({
      userName,
      userEmail,
      userPhone,
      serviceName,
      price: Number(price),
      date,
      timeSlot,
      notes
    });

    await appointment.save();
    res.status(201).json({ message: 'Booking successful!', appointment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Double-booking error: Slot taken.' });
    }
    res.status(500).json({ message: err.message });
  }
});

// 3. GET all appointments
router.get('/all', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. PATCH update booking status
router.patch('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. DELETE an appointment by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. GET Analytics Summary
router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await Appointment.countDocuments();
    const activeBookings = await Appointment.countDocuments({ status: 'Confirmed' });
    const revenueData = await Appointment.aggregate([
      { $match: { status: 'Confirmed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({ totalBookings, activeBookings, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;