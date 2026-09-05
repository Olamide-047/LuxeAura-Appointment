const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

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

// 2. POST create a new booking with validation
router.post('/book', async (req, res) => {
  const { userName, userEmail, userPhone, serviceName, price, date, timeSlot, notes } = req.body;

  if (!userName || !userEmail || !serviceName || !date || !timeSlot) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    // Conflict Check
    const existingSlot = await Appointment.findOne({ date, timeSlot, status: { $ne: 'Cancelled' } });
    if (existingSlot) {
      return res.status(400).json({ message: 'This slot is already booked! Pick another time.' });
    }

    const appointment = new Appointment({
      userName, userEmail, userPhone, serviceName, price, date, timeSlot, notes
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

// 3. GET all appointments (for Admin Panel)
router.get('/all', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. PATCH update booking status (Admin Action)
router.patch('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. GET Analytics Summary (Total Revenue, Count, Active)
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