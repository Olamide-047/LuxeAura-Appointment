import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  {
    id: 1,
    title: "Royal Haircut & Styling",
    price: 85,
    time: "60 mins",
    image: "/haircut.jpg",
    desc: "Precision hair trimming, scalp massage, hot towel treatment, and luxury product styling."
  },
  {
    id: 2,
    title: "Gold Radiance Facial Therapy",
    price: 120,
    time: "75 mins",
    image: "/facialtherapy.jpg",
    desc: "Deep skin exfoliation, 24K gold serum mask, and lymphatic facial massage."
  },
  {
    id: 3,
    title: "Aromatherapy Full Body Massage",
    price: 150,
    time: "90 mins",
    image: "/aromatherapy.jpg",
    desc: "Stress-relieving muscle deep tissue therapy using organic essential oils."
  },
  {
    id: 4,
    title: "Couture Balayage & Blowout",
    price: 210,
    time: "120 mins",
    image: "/balayage.jpg",
    desc: "Custom hand-painted highlighting, gloss toning treatment, and a signature glam blowout."
  },
  {
    id: 5,
    title: "Gentleman's Beard & Scalp Treatment",
    price: 70,
    time: "45 mins",
    image: "/beardscalp.jpg",
    desc: "Traditional razor line-up, steam beard oil conditioning, and rejuvenating scalp therapy."
  },
  {
    id: 6,
    title: "Luxury Gel Pedicure & Manicure",
    price: 110,
    time: "80 mins",
    image: "/pedicure.jpg",
    desc: "Exfoliating botanical scrub, nail shaping, cuticle care, and long-lasting premium gel polish."
  }
];

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-brandDark text-white py-16 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-brandGold mb-4">Our Signature Services</h2>
        <p className="text-center text-gray-400 max-w-xl mx-auto mb-12">
          Select from our handpicked luxury treatments designed to revive your mind and body.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((srv, idx) => (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white/5 border border-brandGold/30 rounded-2xl overflow-hidden hover:border-brandPink transition group flex flex-col justify-between"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-brandPink text-white text-xs font-bold px-3 py-1 rounded-full">
                    ${srv.price}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">{srv.title}</h3>
                  <p className="text-xs text-brandGold font-semibold mb-3">Duration: {srv.time}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{srv.desc}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => navigate('/book', { state: { selectedService: srv.title, price: srv.price } })}
                  className="w-full bg-linear-to-r from-brandGold to-amber-400 text-brandDark font-bold py-3 rounded-xl hover:bg-brandGoldHover transition"
                >
                  Book This Service
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}