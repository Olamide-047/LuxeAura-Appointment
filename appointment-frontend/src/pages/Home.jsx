import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Clock, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-brandDark text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Image & Dual Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.jpg"
            alt="Luxury Salon Spa Background"
            className="w-full h-full object-cover opacity-60 filter brightness-90 contrast-105 scale-100"
          />
          {/* Radial center glow to pop hero text, linear bottom fade to blend with next section */}
          <div className="absolute inset-0 bg-radial from-brandDark/40 via-brandDark/75 to-brandDark" />
          <div className="absolute inset-0 bg-gradient-to-t from-brandDark via-transparent to-brandDark/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brandDark/80 border border-brandPink/60 text-brandPink text-sm mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4" /> Premium Beauty & Wellness Experience
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-md">
            Elegance Reserved <br />
            <span className="bg-gradient-to-r from-brandGold via-amber-200 to-brandPink bg-clip-text text-transparent inline-block">
              Just For You.
            </span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed drop-shadow">
            Experience world-class salon styling, spa therapy, and personal care. Book your seamless slot online in seconds.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/book"
              className="bg-gradient-to-r from-brandGold to-amber-500 text-brandDark font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-brandGold/40 transition transform hover:-translate-y-1"
            >
              Book Appointment Now
            </Link>
            <Link
              to="/services"
              className="border border-brandPink/80 bg-brandDark/50 backdrop-blur-sm text-brandPink hover:bg-brandPink/20 font-semibold px-8 py-4 rounded-xl transition"
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Star, title: "VIP Treatments", desc: "Top-tier professionals ensuring pure satisfaction." },
          { icon: Clock, title: "Zero Wait Time", desc: "Real-time slot locking prevents queuing." },
          { icon: Shield, title: "Guaranteed Booking", desc: "Instant automated confirmation for your time." }
        ].map((feat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className="p-8 rounded-2xl bg-white/5 border border-brandGold/20 hover:border-brandPink transition backdrop-blur-sm"
          >
            <feat.icon className="w-10 h-10 text-brandGold mb-4" />
            <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
            <p className="text-gray-400">{feat.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}