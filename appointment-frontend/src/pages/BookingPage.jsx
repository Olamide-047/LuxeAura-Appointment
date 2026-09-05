import  { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

const SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];
const API_BASE = "http://localhost:5000/api/appointments";

export default function BookingPage() {
  const location = useLocation();
  const preSelected = location.state || {};

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    serviceName: preSelected.selectedService || 'Royal Haircut & Styling',
    price: preSelected.price || 85,
    notes: ''
  });

  const [statusModal, setStatusModal] = useState({ open: false, isSuccess: false, message: '' });

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert('Please pick a time slot!');

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
    <div className="bg-brandDark text-white py-12 px-6 min-h-screen flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-brandGold/40 p-8 rounded-3xl max-w-2xl w-full shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-extrabold text-brandGold text-center mb-2">Reserve Your Experience</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Select your preferences below to secure your time slot.</p>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1"><User className="w-4 h-4"/> Full Name</label>
              <input
                type="text" required className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={formData.userName} onChange={e => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1"><Mail className="w-4 h-4"/> Email Address</label>
              <input
                type="email" required className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={formData.userEmail} onChange={e => setFormData({ ...formData, userEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1"><Phone className="w-4 h-4"/> Phone Number</label>
              <input
                type="tel" required className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={formData.userPhone} onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-brandGold mb-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> Target Date</label>
              <input
                type="date" required className="w-full bg-black/60 border border-gray-700 rounded-xl p-3 text-white focus:border-brandPink outline-none"
                value={date} onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-brandGold mb-2 flex items-center gap-1"><Clock className="w-4 h-4"/> Choose Available Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {SLOTS.map(s => {
                const isTaken = bookedSlots.includes(s);
                const isSelected = selectedSlot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isTaken}
                    onClick={() => setSelectedSlot(s)}
                    className={`p-3 rounded-xl text-xs font-bold transition border ${
                      isTaken
                        ? 'bg-red-900/20 border-red-500/30 text-red-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-brandPink text-white border-brandPink shadow-lg shadow-brandPink/40'
                        : 'bg-black/40 border-gray-700 hover:border-brandGold text-gray-200'
                    }`}
                  >
                    {s} {isTaken ? '(Booked)' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-brandGold via-amber-400 to-brandPink text-brandDark font-extrabold py-4 rounded-xl shadow-lg hover:brightness-110 transition"
          >
            Confirm Reservation
          </button>
        </form>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {statusModal.open && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                className="bg-brandGold text-brandDark font-bold px-6 py-2.5 rounded-xl hover:bg-brandGoldHover transition"
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