import  { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, BookOpen, CheckCircle, RefreshCw } from 'lucide-react';

const API_BASE = "http://localhost:5000/api/appointments";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0, totalRevenue: 0 });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsRes = await axios.get(`${API_BASE}/stats`);
      setStats(statsRes.data);

      const allRes = await axios.get(`${API_BASE}/all`);
      setAppointments(allRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/status/${id}`, { status: newStatus });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-brandDark text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-brandGold">Admin Management Dashboard</h1>
          <button onClick={loadData} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 p-2 px-4 rounded-xl text-xs font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white/5 border border-brandGold/30 rounded-2xl flex items-center gap-4">
            <DollarSign className="w-10 h-10 text-brandGold" />
            <div>
              <p className="text-gray-400 text-xs font-semibold">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
            </div>
          </div>
          <div className="p-6 bg-white/5 border border-brandPink/30 rounded-2xl flex items-center gap-4">
            <BookOpen className="w-10 h-10 text-brandPink" />
            <div>
              <p className="text-gray-400 text-xs font-semibold">Total Bookings</p>
              <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
            </div>
          </div>
          <div className="p-6 bg-white/5 border border-green-500/30 rounded-2xl flex items-center gap-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs font-semibold">Active Bookings</p>
              <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/5 border border-brandGold/20 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/60 border-b border-gray-800 text-brandGold text-xs uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {appointments.map((item) => (
                <tr key={item._id} className="hover:bg-white/5">
                  <td className="p-4">
                    <p className="font-bold text-white">{item.userName}</p>
                    <p className="text-xs text-gray-400">{item.userEmail}</p>
                  </td>
                  <td className="p-4 font-semibold text-brandGold">{item.serviceName} (${item.price})</td>
                  <td className="p-4 text-gray-300">{item.date} at {item.timeSlot}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.status === 'Confirmed' ? (
                      <button
                        onClick={() => updateStatus(item._id, 'Cancelled')}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded-lg text-xs"
                      >
                        Cancel Slot
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(item._id, 'Confirmed')}
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1 rounded-lg text-xs"
                      >
                        Restore Slot
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}