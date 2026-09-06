import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];
const API_BASE = "http://localhost:5000/api/appointments";
const BACKGROUND_IMAGE_PATH = "/bookbg.jpg";

const SERVICES = [
  { id: 1, title: "Royal Haircut & Styling", price: 85 },
  { id: 2, title: "Gold Radiance Facial Therapy", price: 120 },
  { id: 3, title: "Aromatherapy Full Body Massage", price: 150 },
  { id: 4, title: "Couture Balayage & Blowout", price: 210 },
  { id: 5, title: "Gentleman's Beard & Scalp Treatment", price: 70 },
  { id: 6, title: "Luxury Gel Pedicure & Manicure", price: 110 }
];

// Helper to get today's date string formatted as YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

export default function BookingPage() {
  const location = useLocation();
  const preSelected = location.state || {};

  const initialService = SERVICES.find(s => s.title === preSelected.selectedService) || SERVICES[0];

  const [date, setDate] = useState(getTodayString());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    serviceName: initialService.title,
    price: initialService.price,
    notes: ''
  });

  const [statusModal, setStatusModal] = useState({ open: false, isSuccess: false, message: '' });

  // --------------------------------------------------------------------------
  // Time Validation Helpers
  // --------------------------------------------------------------------------
  
  // Converts standard "02:30 PM" format into minutes past midnight for clean integer comparison
  const parseSlotToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  // Determines if a specific slot has already passed for today
  const isSlotPast = useCallback((timeSlot) => {
    const todayStr = getTodayString();
    
    // Only apply time checks if the chosen date is today
    if (date === todayStr) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = parseSlotToMinutes(timeSlot);

      return slotMinutes <= currentMinutes;
    }

    return false;
  }, [date]);

  // --------------------------------------------------------------------------
  // Dynamic Handlers & API Effects
  // --------------------------------------------------------------------------

  const handleServiceChange = (e) => {
    const selectedTitle = e.target.value;
    const matchedService = SERVICES.find(s => s.title === selectedTitle);
    
    if (matchedService) {
      setFormData(prev => ({
        ...prev,
        serviceName: matchedService.title,
        price: matchedService.price
      }));
    }
  };

  const fetchSlots = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/booked-slots?date=${date}`);
      setBookedSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Deselect time slot if changing dates makes the selected slot invalid (booked or past)
  useEffect(() => {
    if (selectedSlot && (bookedSlots.includes(selectedSlot) || isSlotPast(selectedSlot))) {
      setSelectedSlot('');
    }
  }, [date, bookedSlots, selectedSlot, isSlotPast]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert('Please pick an available time slot!');

    try {
      const payload = { ...formData, date, timeSlot: selectedSlot };
      const res = await axios.post(`${API_BASE}/book`, payload);
      setStatusModal({ open: true, isSuccess: true, message: res.data.message });
      fetchSlots();
      setSelectedSlot('');
    } catch (err) {
      setStatusModal({
        open: true,
        isSuccess: false,
        message: err.response?.data?.message || 'Error executing booking'
      });
    }
  };

  return (
    <div 
      className="relative min-h-screen py-12 px-6 flex justify-center items-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE_PATH}')` }}
    >
      <div className="absolute inset-0 bg-black/75" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-black/60 border border-brandGold/40 p-8 rounded-3xl max-w-2xl w-full shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-extrabold text-brandGold text-center mb-2">Reserve Your Experience</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Select your preferences below to secure your time slot.</p>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Service Dropdown & Price Display */}
          <div>
            <label className="text-xs font-semibold text-brandGold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Select Service
              </span>
              <span className="text-brandPink font-bold text-sm">${formData.price}</span>
            </label>
            <select
              value={formData.serviceName}
              onChange={handleServiceChange}
              className="w-full bg-black/80 border border-brandGold/50 rounded-xl p-3 text-white focus:border-brandPink outline-none cursor-pointer"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.title} className="bg-brandDark text-white">
                  {s.title} — ${s.price}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1">
                <User className="w-4 h-4"/> Full Name
              </label>
              <input
                type="text" 
                required 
                className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={formData.userName} 
                onChange={e => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4"/> Email Address
              </label>
              <input
                type="email" 
                required 
                className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={formData.userEmail} 
                onChange={e => setFormData({ ...formData, userEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4"/> Phone Number
              </label>
              <input
                type="tel" 
                required 
                className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={formData.userPhone} 
                onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4"/> Target Date
              </label>
              <input
                type="date" 
                required 
                min={getTodayString()} // Restricts user from choosing past calendar dates
                className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={date} 
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-brandGold mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4"/> Choose Available Time Slot
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SLOTS.map(s => {
                const isTaken = bookedSlots.includes(s);
                const hasPassed = isSlotPast(s);
                const isDisabled = isTaken || hasPassed;
                const isSelected = selectedSlot === s;

                // Render contextual text inside the button
                let statusLabel = '';
                if (isTaken) statusLabel = ' (Booked)';
                else if (hasPassed) statusLabel = ' (Passed)';

                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedSlot(s)}
                    className={`p-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      isDisabled
                        ? 'bg-red-900/10 border-red-500/20 text-red-400/50 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-brandPink text-white border-brandPink shadow-lg shadow-brandPink/40'
                        : 'bg-black/60 border-gray-700 hover:border-brandGold text-gray-200'
                    }`}
                  >
                    {s}{statusLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-brandGold via-amber-400 to-brandPink text-brandDark font-extrabold py-4 rounded-xl shadow-lg hover:brightness-110 transition cursor-pointer"
          >
            Confirm Reservation (${formData.price})
          </button>
        </form>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {statusModal.open && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-brandDark border border-brandGold/40 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl"
            >
              {statusModal.isSuccess ? (
                <CheckCircle2 className="w-16 h-16 text-brandPink mx-auto mb-4" />
              ) : (
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h3 className="text-2xl font-bold text-white mb-2">
                {statusModal.isSuccess ? 'Reservation Secured!' : 'Conflict Error'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">{statusModal.message}</p>
              <button
                onClick={() => setStatusModal({ ...statusModal, open: false })}
                className="bg-brandGold text-brandDark font-bold px-6 py-2.5 rounded-xl hover:bg-brandGoldHover transition cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}