# LuxeAura | Luxury Salon & Spa Booking Platform

LuxeAura is a full-stack, luxury-themed appointment reservation web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Designed with a dark obsidian, gold, and pink aesthetic, it provides users with a seamless, real-time booking experience and gives administrators full visibility over schedule management and revenue metrics.

---

## ✨ Features

- **Luxury UI/UX:** Styled using custom theme variables in Tailwind CSS v4, dynamic gradients, and fluid Framer Motion animations.
- **Service Exploration:** Browse premium salon and spa offerings complete with durations, pricing, and visual cards.
- **Real-Time Slot Lock & Conflict Prevention:** Powered by a MongoDB compound index on `{ date, timeSlot }` to strictly prevent double-booking.
- **Admin Management Dashboard:** Real-time metrics displaying total revenue, active bookings, status management, and slot cancellation capabilities.
- **Responsive Navigation:** Seamless user flow powered by React Router DOM and Lucide React icons.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Environment Management:** dotenv / dotenvx

---

## 📁 Project Architecture

```text
Appointment/
├── appointment-backend/
│   ├── models/
│   │   └── Appointment.js         # Mongoose schema with unique date/time index
│   ├── routes/
│   │   └── appointmentRoutes.js   # API endpoints for CRUD booking operations
│   ├── .env                       # Backend environment variables
│   ├── package.json
│   └── server.js                  # Express application entry point
│
└── appointment-frontend/
    ├── public/                    # Static image assets (hero, service thumbnails)
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx         # Sticky navigation header
    │   ├── pages/
    │   │   ├── Home.jsx           # Hero page with luxury call-to-actions
    │   │   ├── ServicesPage.jsx   # Interactive service cards
    │   │   ├── BookingPage.jsx    # Appointment form & slot picker
    │   │   └── AdminDashboard.jsx # Admin analytics & reservation table
    │   ├── App.jsx                # Route definitions
    │   └── index.css              # Tailwind CSS directives & @theme definitions
    ├── package.json
    └── vite.config.js
