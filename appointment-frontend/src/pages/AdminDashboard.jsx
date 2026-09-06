import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { DollarSign, BookOpen, CheckCircle, RefreshCw, Trash2, Loader2 } from 'lucide-react';

const API_BASE = "http://localhost:5000/api/appointments";
const BACKGROUND_IMAGE_PATH = "/adminbg.jpg";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, totalRevenue: 0 });
  const [appointments, setAppointments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const statsRes = await axios.get(`${API_BASE}/stats`);
      setStats(statsRes.data);

      const allRes = await axios.get(`${API_BASE}/all`);
      setAppointments(allRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/status/${id}`, { status: newStatus });
      loadData();
    } catch (err) {
      console.error("Status update failed:", err);
      alert(err.response?.data?.message || "Failed to update appointment status.");
    }
  };

  // Handler for permanent removal with optimistic state update
  const deleteAppointment = async (id) => {
    if (!id) {
      alert("Error: Appointment ID is missing.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to permanently delete this booking?");
    if (!confirmDelete) return;

    setDeletingId(id);

    // Snapshot current appointments for rollback if network fails
    const previousAppointments = [...appointments];

    // Optimistically update UI immediately
    setAppointments((prev) => prev.filter((item) => item._id !== id));

    try {
      await axios.delete(`${API_BASE}/${id}`);
      
      // Refresh analytics after successful delete
      const statsRes = await axios.get(`${API_BASE}/stats`);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Delete request failed:", err);

      // Revert state change on failure
      setAppointments(previousAppointments);

      const errorMessage = err.response?.data?.message || err.message || "Failed to delete booking.";
      alert(`Deletion Failed: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div 
      className="relative min-h-screen p-8 bg-cover bg-center bg-no-repeat bg-fixed text-white"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE_PATH}')` }}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-brandGold">Admin Management Dashboard</h1>
          <button 
            onClick={loadData} 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 p-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors backdrop-blur-md"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-black/50 backdrop-blur-md border border-brandGold/30 rounded-2xl flex items-center gap-4 shadow-xl">
            <DollarSign className="w-10 h-10 text-brandGold" />
            <div>
              <p className="text-gray-400 text-xs font-semibold">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
            </div>
          </div>
          <div className="p-6 bg-black/50 backdrop-blur-md border border-brandPink/30 rounded-2xl flex items-center gap-4 shadow-xl">
            <BookOpen className="w-10 h-10 text-brandPink" />
            <div>
              <p className="text-gray-400 text-xs font-semibold">Total Bookings</p>
              <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
            </div>
          </div>
          <div className="p-6 bg-black/50 backdrop-blur-md border border-green-500/30 rounded-2xl flex items-center gap-4 shadow-xl">
            <CheckCircle className="w-10 h-10 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs font-semibold">Active Bookings</p>
              <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-black/50 backdrop-blur-md border border-brandGold/20 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/80 border-b border-gray-800 text-brandGold text-xs uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white">{item.userName}</p>
                      <p className="text-xs text-gray-400">{item.userEmail}</p>
                    </td>
                    <td className="p-4 font-semibold text-brandGold">
                      {item.serviceName} (${item.price})
                    </td>
                    <td className="p-4 text-gray-300">
                      {item.date} at {item.timeSlot}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Confirmed' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {item.status === 'Confirmed' ? (
                          <button
                            onClick={() => updateStatus(item._id, 'Cancelled')}
                            className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 px-3 py-1 rounded-lg text-xs cursor-pointer transition-colors"
                          >
                            Cancel Slot
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(item._id, 'Confirmed')}
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1 rounded-lg text-xs cursor-pointer transition-colors"
                          >
                            Restore Slot
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteAppointment(item._id)}
                          disabled={deletingId === item._id}
                          title="Permanently Delete"
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/40 p-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === item._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}