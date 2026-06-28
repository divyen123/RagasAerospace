import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./App.css";
import kishorePhoto from "./assets/kishore-karthik-r.png";
import varshaPhoto from "./assets/kp-varsha.png";
import archanaPhoto from "./assets/archana-s.png";
import sujithaPhoto from "./assets/sujitha-m.png";

// ---------- API ----------
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const api = axios.create({ baseURL: API, withCredentials: true });
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1PpKsM8bbSJ84KVyza8RIE0w8mU-7Ix3ZWraABTZeQWI/edit?sharingaction=ownershiptransfer&ts=69e48952";
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("rg_token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

const fmtErr = (d) => {
  if (!d) return "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return d?.msg || JSON.stringify(d);
};

// ---------- Asset URLs ----------
const ASSETS = {
  logo: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/u050m94l_logo.jpeg",
  bg:   "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/wcplbgaq_bg%202.jpeg",
  tri:  "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/4ltxlgep_WhatsApp%20Image%202026-05-29%20at%2011.11.57%20PM.jpeg",
  quad: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/jpq3s3ao_WhatsApp%20Image%202026-05-29.jpeg",
  hexa: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/o6wothx5_WhatsApp%20Image%202026-05-29%20.jpeg",
  octa: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/cyabvnuw_WhatsApp%20Image%20.jpeg",
  vtol: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/a0sxvbgo_WhatsApp%20.jpeg",
  founder: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/z5fujzg7_Let%20me%20.jpeg",
  cofounder: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/o9qbfst7_cofoun.jpeg",
  kishore: kishorePhoto,
  varsha: varshaPhoto,
  archana: archanaPhoto,
  sujitha: sujithaPhoto,
  fpv: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/81pursfl_WhatsApp%20Image%202026-06-06%20at%207.29.38%20PM.jpeg",
  ach3: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/xqzumtvz_ac%201.jpeg",
  ach4: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/14xmwp6a_ac2.jpeg",
  ach5: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/o6eloplc_ac3.jpeg",
  ach6: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/7oja2i64_WhatsApp%20Image%202026-06-06%20at%2011.31.01%20PM.jpeg",
  ach7: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/fn4m9py6_WhatsApp%20Image%202026-06-06%20at%2011.32.32%20PM.jpeg",
  ach9: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/hpz638q4_WhatsApp%20Image%202026-06-06%20at%2011.36.08%20PM.jpeg",
  ach10: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/2k4tcjv1_WhatsApp%20Image%202026-06-06%20at%2011.38.27%20PM.jpeg",
  ach11: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/dwccso93_WhatsApp%20Image%202026-06-06%20at%2011.39.54%20PM.jpeg",
  ach12: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/1zgcr5tj_WhatsApp%20Image%202026-06-06%20at%2011.41.40%20PM.jpeg",
  ach13: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/ortfwhf8_WhatsApp%20Image%202026-06-06%20at%2011.46.20%20PM.jpeg",
  ach1: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/w3dqeuo6_WhatsApp%20Image%202026-06-06%20at%2011.21.22%20PM.jpeg",
  ach2: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/tvtb9kui_WhatsApp%20Image%202026-06-06%20at%2011.50.41%20PM.jpeg",
  ach8: "https://customer-assets.emergentagent.com/job_ragas-team-site/artifacts/9tkstenb_WhatsApp%20Image%202026-06-06%20at%2011.33.52%20PM.jpeg",
};

// ---------- Achievements ----------
const ACHIEVEMENTS = [
  {
    id: 1, title: "Award-Winning Aerospace Innovation",
    location: "Chennai Institute of Technology (CIT), Chennai", year: "2026",
    img: ASSETS.ach1,
    body: "RT-10, developed by Ragas Aerospace, earned 3rd Place in a competitive project presentation at Chennai Institute of Technology (CIT). Designed with a focus on aerospace engineering principles, scalability, and operational feasibility, RT-10 represents our vision of advancing the future of autonomous aviation systems.",
  },
  {
    id: 2, title: "Representing Ragas Aerospace at AI for Startup India",
    location: "Chennai", year: "2026",
    img: ASSETS.ach2,
    body: "Ragas Aerospace was selected to attend AI for Startup India 2026 in Chennai, joining a community of entrepreneurs, innovators, and technology leaders exploring the future of artificial intelligence. The event offered insights into AI adoption, startup scalability, product innovation, and emerging technology ecosystems, further strengthening our vision of building intelligent aerospace solutions with real-world impact.",
  },
  {
    id: 3, title: "SARAM Innovation Showcase",
    location: "Easwari Engineering College, Chennai", year: "2026",
    img: ASSETS.ach3,
    body: "At SARAM 2026, Ragas Aerospace presented its next-generation drone system, demonstrating capabilities in autonomous aviation and mission-oriented design. The project attracted significant interest from academic leadership and industry visitors, reinforcing the potential of our technology and our vision to develop scalable aerospace solutions for real-world applications.",
  },
  {
    id: 4, title: "NIDAR National Innovation Challenge Recognition",
    location: "National Innovation Challenge (NIDAR)", year: "2026",
    img: ASSETS.ach4,
    body: "Ragas Aerospace successfully completed the NIDAR (National Innovation Challenge for Drone Application & Research), a national program dedicated to developing deployment-ready drone solutions. The project was recognised for its technical excellence, practical implementation, and real-world impact, earning an Innovation Voucher worth ₹50,000. This achievement supports the continued development, prototyping and validation of scalable drone technologies for mission-critical applications.",
  },
  {
    id: 5, title: "E-Summit IIT Bombay – Founder Engagement",
    location: "IIT Bombay, Mumbai", year: "2026",
    img: ASSETS.ach5,
    body: "Ragas Aerospace participated in E-Summit IIT Bombay, one of India's premier entrepreneurship platforms, engaging with founders, investors, industry leaders and innovation experts. The event provided valuable insights into startup growth, capital efficiency, deep-tech innovation, and long-term value creation. Through interactions with leading entrepreneurs and business leaders, the experience strengthened our strategic vision for building scalable, impact-driven aerospace and autonomous technology solutions.",
  },
  {
    id: 6, title: "1st Place – KRATOS'25 National Project Expo",
    location: "Easwari Engineering College, Chennai", year: "2025",
    img: ASSETS.ach6,
    body: "Ragas Aerospace secured 1st Place at KRATOS'25, a National Level Project Expo organised by the Department of Computer Science & Engineering, Easwari Engineering College. The award-winning project, Stingray X, is an AI-powered rescue drone designed to detect survivors in disaster-affected areas and deliver emergency supplies with speed and precision. Recognised for its innovative application of artificial intelligence, autonomous systems and humanitarian impact, the project demonstrates our commitment to developing technology-driven solutions for real-world challenges.",
  },
  {
    id: 7, title: "2nd Place – Asthivaara Kenshin Project Expo",
    location: "Easwari Engineering College, Chennai", year: "2025",
    img: ASSETS.ach7,
    body: "Ragas Aerospace secured 2nd Place in the Project Expo (Senior Category) at Asthivaara Kenshin 2025, a prestigious technical symposium organised by the Department of Civil Engineering, Easwari Engineering College. The project was recognised for its innovative approach, technical excellence and practical application, reflecting our commitment to engineering-driven problem-solving and continuous innovation.",
  },
  {
    id: 8, title: "3rd Place – FLIGHT'25 Drone Competition",
    location: "MIT, Anna University, Chennai", year: "2025",
    img: ASSETS.ach8,
    body: "Ragas Aerospace secured 3rd Place in the Drone Competition at FLIGHT'25, a premier technical symposium organised by the Association of Aeronautical Engineers, Department of Aerospace Engineering, Madras Institute of Technology (MIT), Anna University. The achievement reflects our expertise in drone design, aerospace innovation and practical engineering, while showcasing our ability to compete successfully among talented teams from leading institutions.",
  },
  {
    id: 9, title: "Machine Learning Workshop",
    location: "IIT Madras Research Park, Chennai", year: "2025",
    img: ASSETS.ach9,
    body: "Participated in an intensive Machine Learning workshop conducted by industry experts at IIT Madras Research Park. The program covered core concepts including supervised and unsupervised learning, regression analysis, neural networks, and practical implementation using Python libraries such as Pandas, NumPy and Matplotlib. This experience strengthened our capabilities in artificial intelligence and data-driven technology development.",
  },
  {
    id: 10, title: "Drone Technology Workshop",
    location: "Velammal Bodhi Campus, Kanchipuram", year: "2025",
    img: ASSETS.ach10,
    body: "As part of our commitment to advancing aerospace awareness and technical education, Ragas Aerospace conducted a specialised Drone Technology Workshop at Velammal Bodhi Campus, Kanchipuram. The session covered drone engineering fundamentals, operational applications, and emerging trends in autonomous aviation, providing students with hands-on insights into the future of aerial technology.",
  },
  {
    id: 11, title: "Exploring India's Gateway to Space",
    location: "Satish Dhawan Space Centre (SDSC SHAR), Sriharikota", year: "2025",
    img: ASSETS.ach11,
    body: "As part of our continuous pursuit of aerospace excellence, we visited the Satish Dhawan Space Centre (SDSC SHAR), Sriharikota. The exposure to launch facilities, mission operations, and India's space exploration ecosystem provided valuable insights into the precision, engineering discipline and innovation required for large-scale aerospace missions. The experience continues to inspire our vision of developing next-generation aviation and autonomous systems.",
  },
  {
    id: 12, title: "Genesis – 20-Hour Innovation Hackathon",
    location: "Easwari Engineering College, Chennai", year: "2026",
    img: ASSETS.ach12,
    body: "Ragas Aerospace participated in Genesis 2026, a 20-hour intensive hackathon hosted by Easwari Engineering College. The event challenged participants to rapidly transform ideas into functional solutions under strict time constraints, emphasising problem-solving, teamwork, adaptability, and execution. The experience reinforced key principles of innovation and product development, highlighting the importance of rapid iteration and effective decision-making in high-pressure environments.",
  },
  {
    id: 13, title: "Disaster Response Innovation Showcase",
    location: "SRM University, Chennai", year: "2026",
    img: ASSETS.ach13,
    body: "Ragas Aerospace participated in Project Expo 2026 at SRM University, presenting an advanced All-Terrain Disaster Management Drone developed for emergency response applications. The project highlighted our ongoing efforts in autonomous systems, aerospace engineering and mission-focused drone technologies aimed at solving real-world challenges through practical innovation.",
  },
];

// ---------- Products ----------
const PRODUCTS = [
  {
    id: "tri",
    num: "01 — UAV",
    name: "Tri-Copter",
    short: "Lightweight three-rotor platform optimized for research and rapid mission operations.",
    img: ASSETS.tri,
    long: "A Tricopter is a unique unmanned aerial vehicle (UAV) that utilizes three rotors arranged in a triangular configuration. Unlike conventional quadcopters, tricopters use a specialized servo mechanism to control yaw movement, enabling highly responsive and agile flight characteristics. Their lightweight structure and efficient power consumption make them an excellent choice for research, development, and experimental aerial applications. At Ragas Aerospace, tricopter platforms are explored for applications that require flexibility, rapid deployment, and efficient aerial operations.",
    features: ["Three-rotor configuration", "Lightweight and efficient design", "Enhanced maneuverability", "Cost-effective development platform"],
    applications: ["Research & Development", "Educational Projects", "Aerial Photography", "Experimental UAV Testing"],
  },
  {
    id: "quad",
    num: "02 — UAV",
    name: "Quadcopter",
    short: "The world's most widely adopted drone platform — stable, scalable, mission-versatile.",
    img: ASSETS.quad,
    long: "A Quadcopter is the most widely adopted drone platform in the world, featuring four rotors that provide exceptional flight stability and control. Its simple yet highly effective design allows for smooth operation, precise maneuvering, and reliable autonomous flight capabilities. Quadcopters are versatile and can be equipped with cameras, sensors, and communication systems to perform a wide range of missions. At Ragas Aerospace, quadcopters are utilized for applications requiring dependable performance, operational flexibility, and advanced aerial data collection.",
    features: ["Four-rotor architecture", "Stable and reliable flight", "Easy maintenance and scalability", "Supports autonomous operations"],
    applications: ["Surveillance & Monitoring", "Mapping & Surveying", "Infrastructure Inspection", "Aerial Photography & Videography"],
  },
  {
    id: "hexa",
    num: "03 — UAV",
    name: "Hexacopter",
    short: "Six-rotor platform with high payload capacity and motor-failure redundancy.",
    img: ASSETS.hexa,
    long: "A Hexacopter is a multi-rotor drone equipped with six propellers, offering greater stability, lifting capability, and operational safety compared to smaller UAV platforms. The additional motors provide increased thrust, allowing the drone to carry heavier payloads such as advanced cameras, LiDAR systems, and specialized sensors. Even in the event of a motor failure, the aircraft can often maintain controlled flight, enhancing mission safety. Ragas Aerospace leverages hexacopter technology for advanced aerial missions where performance and reliability are essential.",
    features: ["Six-motor configuration", "Higher payload capacity", "Improved flight stability", "Enhanced operational safety"],
    applications: ["Industrial Inspections", "Precision Agriculture", "Surveying & Mapping", "Professional Cinematography"],
  },
  {
    id: "octa",
    num: "04 — UAV",
    name: "Octocopter",
    short: "Heavy-lift platform with eight rotors, system redundancy and superior thrust.",
    img: ASSETS.octa,
    long: "An Octocopter is a high-performance UAV featuring eight rotors designed for heavy-lift and mission-critical operations. With superior thrust generation and exceptional stability, octocopters can carry sophisticated payloads, including advanced imaging systems, communication equipment, and specialized sensors. The eight-motor architecture provides significant redundancy, ensuring safer operations even under challenging conditions. At Ragas Aerospace, octocopters represent a powerful aerial platform for complex missions requiring maximum performance and operational confidence.",
    features: ["Eight-rotor architecture", "Heavy payload capability", "Exceptional flight stability", "High system redundancy"],
    applications: ["Defense & Security Operations", "Heavy-Lift Missions", "LiDAR Surveys", "Industrial Monitoring"],
  },
  {
    id: "vtol",
    num: "05 — VTOL",
    name: "VTOL UAV",
    short: "Hybrid VTOL combining multirotor flexibility with fixed-wing endurance.",
    img: ASSETS.vtol,
    long: "Vertical Take-Off and Landing (VTOL) drones combine the advantages of multirotor aircraft and fixed-wing systems into a single platform. These advanced UAVs can take off and land vertically without requiring a runway while also transitioning into efficient forward flight for extended-range missions. VTOL technology enables operators to cover large geographic areas while maintaining the flexibility of vertical deployment. Ragas Aerospace develops VTOL solutions for applications demanding range, efficiency, and operational versatility.",
    features: ["Vertical take-off and landing", "Long-range capabilities", "Fixed-wing flight efficiency", "Runway-independent operation"],
    applications: ["Search & Rescue", "Large-Area Surveillance", "Environmental Monitoring", "Long-Range Mapping"],
  },
  {
    id: "fpv",
    num: "06 — FPV",
    name: "FPV Drone",
    short: "First-person view system for racing, cinematography and tactical recon.",
    img: ASSETS.fpv,
    long: "FPV (First-Person View) drones are designed to provide pilots with a real-time aerial perspective through onboard cameras and low-latency video transmission systems. This immersive flying experience enables precise navigation, high-speed maneuvering, and enhanced situational awareness. FPV drones have gained popularity in racing, cinematography, and tactical operations due to their agility and responsiveness. At Ragas Aerospace, FPV platforms are utilized for applications requiring speed, precision, and real-time aerial intelligence.",
    features: ["Real-time video transmission", "High-speed maneuverability", "Immersive pilot experience", "Precision control systems"],
    applications: ["Drone Racing", "Cinematography", "Tactical Reconnaissance", "Search & Rescue Support", "Infrastructure Inspection"],
  },
];

// ---------- Auth Context ----------
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    api.get("/auth/me").then(({ data }) => setUser(data)).catch(() => setUser(null));
  }, []);
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.headers["x-auth-token"]; if (token) localStorage.setItem("rg_token", token);
    setUser(res.data); return res.data;
  };
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const token = res.headers["x-auth-token"]; if (token) localStorage.setItem("rg_token", token);
    setUser(res.data); return res.data;
  };
  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("rg_token");
    setUser(null);
  };
  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>;
}

// ---------- Royal Purple Drone (SVG, for hero/cursor) ----------
const DroneSVG = ({ className = "" }) => (
  <svg className={className} width="260" height="160" viewBox="0 0 260 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dgrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3a1f6e" />
        <stop offset="100%" stopColor="#1a0f30" />
      </linearGradient>
      <radialGradient id="rotorPurple" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#9b6df0" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#7b3fe4" stopOpacity="0" />
      </radialGradient>
      <filter id="dglow">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g filter="url(#dglow)">
      <line x1="60" y1="80" x2="200" y2="80" stroke="#7b3fe4" strokeWidth="2.4" />
      <line x1="130" y1="40" x2="130" y2="120" stroke="#7b3fe4" strokeOpacity="0.55" strokeWidth="1.2" />
      <rect x="105" y="60" width="50" height="40" rx="8" fill="url(#dgrad)" stroke="#9b6df0" strokeOpacity="0.85" />
      <circle cx="130" cy="80" r="6" fill="#9b6df0" />
      <circle cx="60" cy="80" r="26" fill="url(#rotorPurple)" />
      <circle cx="200" cy="80" r="26" fill="url(#rotorPurple)" />
      <g className="rotor" style={{ transformOrigin: "60px 80px" }}>
        <line x1="32" y1="80" x2="88" y2="80" stroke="#cdb6ff" strokeOpacity="0.55" strokeWidth="1.2" />
        <line x1="60" y1="52" x2="60" y2="108" stroke="#cdb6ff" strokeOpacity="0.25" strokeWidth="1" />
      </g>
      <g className="rotor" style={{ transformOrigin: "200px 80px" }}>
        <line x1="172" y1="80" x2="228" y2="80" stroke="#cdb6ff" strokeOpacity="0.55" strokeWidth="1.2" />
        <line x1="200" y1="52" x2="200" y2="108" stroke="#cdb6ff" strokeOpacity="0.25" strokeWidth="1" />
      </g>
      <circle cx="60" cy="80" r="6" fill="#1a0f30" stroke="#9b6df0" />
      <circle cx="200" cy="80" r="6" fill="#1a0f30" stroke="#9b6df0" />
      <circle cx="60" cy="80" r="2.5" fill="#9b6df0" />
      <circle cx="200" cy="80" r="2.5" fill="#9b6df0" />
    </g>
  </svg>
);

const HeroDroneScene = () => (
  <div className="hero-drone-scene" aria-hidden>
    <div className="hero-drone-vapor hero-drone-vapor-a" />
    <div className="hero-drone-vapor hero-drone-vapor-b" />
    <motion.div
      className="hero-drone-flight"
      initial={{ x: "18vw", y: 12, scale: 0.86, rotateZ: -4, opacity: 0 }}
      animate={{
        x: ["18vw", "3vw", "-8vw", "4vw", "18vw"],
        y: [12, -28, 8, -16, 12],
        scale: [0.86, 1.04, 0.94, 1.08, 0.86],
        rotateZ: [-4, 3, -2, 4, -4],
        opacity: [0, 0.98, 0.86, 0.95, 0],
      }}
      transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
    >
      <motion.div
        className="hero-drone-3d"
        animate={{ rotateY: [-10, 12, -6, 10, -10], rotateX: [8, -5, 7, -4, 8] }}
        transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
      >
        <span className="hero-drone-shadow" />
        <span className="hero-drone-axis hero-drone-axis-x" />
        <span className="hero-drone-axis hero-drone-axis-y" />
        {["front-left", "front-right", "back-left", "back-right"].map((pos) => (
          <span className={`hero-drone-rotor hero-drone-rotor-${pos}`} key={pos}>
            <span className="hero-drone-rotor-disk" />
            <span className="hero-drone-motor" />
          </span>
        ))}
        <span className="hero-drone-body">
          <span className="hero-drone-canopy" />
          <span className="hero-drone-lens" />
          <span className="hero-drone-light hero-drone-light-left" />
          <span className="hero-drone-light hero-drone-light-right" />
        </span>
        <span className="hero-drone-tail" />
      </motion.div>
    </motion.div>
    <motion.div
      className="hero-drone-hud"
      animate={{ opacity: [0.28, 0.72, 0.38], scale: [0.96, 1.04, 0.98] }}
      transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity }}
    >
      <span />
      <span />
      <span />
    </motion.div>
  </div>
);

const EntryReveal = () => (
  <div className="entry-reveal" aria-hidden>
    <div className="entry-grid" />
    <div className="entry-scan" />
    <div className="entry-logo-stage">
      <Logo size={118} />
      <span className="entry-logo-glitch entry-logo-glitch-a">RAGAS AEROSPACE</span>
      <span className="entry-logo-glitch entry-logo-glitch-b">RAGAS AEROSPACE</span>
      <div className="entry-status">AUTONOMOUS SYSTEMS ONLINE</div>
    </div>
  </div>
);

const MissionDroneAnimation = () => (
  <div className="mission-drone-stage" aria-hidden>
    <div className="mission-grid-layer" />
    <div className="mission-cine-vignette" />
    <div className="mission-cine-noise" />
    <div className="mission-light-flare" />
    <div className="mission-radar-sweep" />
    <div className="mission-scanline mission-scanline-one" />
    <div className="mission-scanline mission-scanline-two" />
    <div className="mission-particles">
      {Array.from({ length: 18 }).map((_, i) => <span key={i} />)}
    </div>
    <div className="mission-corner mission-corner-tl" />
    <div className="mission-corner mission-corner-tr" />
    <div className="mission-corner mission-corner-bl" />
    <div className="mission-corner mission-corner-br" />
    <div className="mission-reticle">
      <span className="mission-reticle-ring" />
      <span className="mission-reticle-ring mission-reticle-ring-inner" />
    </div>
    <div className="mission-cinematic-camera">
      <svg className="mission-drone-svg" viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="missionBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(109,214,255,0)" />
            <stop offset="42%" stopColor="rgba(56,163,255,0.34)" />
            <stop offset="100%" stopColor="rgba(31,111,255,0.05)" />
          </linearGradient>
          <linearGradient id="missionBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef8ff" />
            <stop offset="38%" stopColor="#6dd6ff" />
            <stop offset="72%" stopColor="#153a63" />
            <stop offset="100%" stopColor="#020710" />
          </linearGradient>
          <radialGradient id="missionRotorBlur" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(141,232,255,0.42)" />
            <stop offset="48%" stopColor="rgba(56,163,255,0.12)" />
            <stop offset="100%" stopColor="rgba(56,163,255,0)" />
          </radialGradient>
          <filter id="missionGlow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="mission-beam" filter="url(#missionGlow)">
          <polygon points="260,175 390,330 130,330" fill="url(#missionBeam)" />
          <line x1="260" y1="175" x2="130" y2="330" />
          <line x1="260" y1="175" x2="390" y2="330" />
          <line x1="260" y1="175" x2="260" y2="330" />
        </g>
        <g className="mission-cine-drone" filter="url(#missionGlow)">
          <path className="mission-arm mission-arm-front" d="M162 145 L224 174 L296 174 L358 145" />
          <path className="mission-arm mission-arm-back" d="M176 202 L230 177 L290 177 L344 202" />
          <path className="mission-spine" d="M260 124 L260 218" />
          <path className="mission-shell" d="M218 156 C223 132 242 122 260 122 C278 122 297 132 302 156 L294 190 C287 204 234 204 226 190 Z" />
          <path className="mission-canopy" d="M239 145 C246 135 274 135 281 145 L276 160 C268 166 252 166 244 160 Z" />
          <path className="mission-camera-gimbal" d="M244 190 C250 208 270 208 276 190" />
          <circle className="mission-camera-lens" cx="260" cy="194" r="9" />
          <circle className="mission-status-dot mission-status-dot-left" cx="235" cy="176" r="3" />
          <circle className="mission-status-dot mission-status-dot-right" cx="285" cy="176" r="3" />
          {[
            [150, 139, "front-left"],
            [370, 139, "front-right"],
            [170, 206, "back-left"],
            [350, 206, "back-right"],
          ].map(([cx, cy, name]) => (
            <g className={`mission-cine-rotor mission-cine-rotor-${name}`} key={name} style={{ transformOrigin: `${cx}px ${cy}px` }}>
              <ellipse className="mission-rotor-wash" cx={cx} cy={cy} rx="54" ry="18" />
              <ellipse className="mission-rotor-ring" cx={cx} cy={cy} rx="41" ry="13" />
              <g className="mission-rotor-blades" style={{ transformOrigin: `${cx}px ${cy}px` }}>
                <path d={`M${cx - 48} ${cy} C${cx - 24} ${cy - 6} ${cx + 24} ${cy - 6} ${cx + 48} ${cy}`} />
                <path d={`M${cx} ${cy - 16} C${cx + 7} ${cy - 7} ${cx + 7} ${cy + 7} ${cx} ${cy + 16}`} />
              </g>
              <circle className="mission-motor" cx={cx} cy={cy} r="9" />
            </g>
          ))}
        </g>
        <g className="mission-data-pulse">
          <circle cx="260" cy="330" r="5" />
          <circle cx="260" cy="330" r="20" />
          <circle cx="260" cy="330" r="42" />
        </g>
      </svg>
    </div>
    <div className="mission-target mission-target-a" />
    <div className="mission-target mission-target-b" />
    <div className="mission-hud mission-hud-top">AI NAV LOCK</div>
    <div className="mission-hud mission-hud-bottom">TERRAIN SCAN ACTIVE</div>
    <div className="mission-hud mission-hud-side">SIGNAL 98%</div>
  </div>
);

// ---------- Social icons (inline SVG) ----------
const SOCIALS = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/ragas_aerospace?igsh=ZWZna2FhYWc1c3Y=",
    path: "M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm11 1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/ragas-aerospace/?viewAsMember=true",
    path: "M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.119 1 2.5 1s2.48 1.119 2.48 2.5zM.22 8h4.56v14H.22V8zm7.6 0h4.37v1.93h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.3c0-1.5-.03-3.43-2.09-3.43-2.09 0-2.41 1.63-2.41 3.32V22H7.82V8z" },
  { id: "twitter", label: "X / Twitter", url: "https://x.com/RagasAerospace",
    path: "M18.244 2H21.5l-7.5 8.57L22.5 22h-6.84l-5.36-7-6.13 7H.92l8.02-9.16L.5 2h7l4.85 6.43L18.244 2zm-1.2 18h1.9L7.04 4H5.04l12.004 16z" },
  { id: "email", label: "Email Support", url: "mailto:ragasaerospace@gmail.com",
    path: "M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.3l10 6.2 10-6.2V6H2zm0 2.7V18h20V8.7l-10 6.2L2 8.7z" },
];

const TEAM_MEMBERS = [
  {
    testId: "founder-card",
    photo: ASSETS.founder,
    alt: "Founder",
    role: "Founder & CEO",
    name: "Raghav S",
    bio: "Aerospace engineer and defence technologist building autonomous systems that protect lives. Leads platform engineering and product strategy.",
    email: "raghavsaravanan22@gmail.com",
    emailTestId: "founder-email",
    phone: "+91 98847 39061",
    phoneHref: "+919884739061",
    phoneTestId: "founder-phone",
  },
  {
    testId: "sujitha-card",
    photo: ASSETS.sujitha,
    alt: "Sujitha M",
    role: "Co-Founder",
    name: "Sujitha M",
    bio: "Supports strategic planning, business growth, partnerships, and the successful execution of the company's mission and objectives.",
    email: "sujithamoni15@gmail.com",
    emailTestId: "sujitha-email",
    phone: "+91 95140 52550",
    phoneHref: "+919514052550",
    phoneTestId: "sujitha-phone",
  },
  {
    testId: "varsha-card",
    photo: ASSETS.varsha,
    alt: "K P Varsha",
    role: "Secretary",
    name: "K P Varsha",
    bio: "Maintains company records, manages communications, schedules meetings, and assists with organizational coordination.",
    email: "Varshaa.k.pavithran@gmail.com",
    emailTestId: "varsha-email",
    phone: "+91 86106 46791",
    phoneHref: "+918610646791",
    phoneTestId: "varsha-phone",
  },
  {
    testId: "kishore-card",
    photo: ASSETS.kishore,
    alt: "Kishore Karthik R",
    role: "CAO",
    name: "Kishore Karthik R",
    bio: "Coordinates administrative functions, documentation, compliance, and internal operations across the organization.",
    email: "kishorekarthik432@gmail.com",
    emailTestId: "kishore-email",
    phone: "+91 91106 28437",
    phoneHref: "+919110628437",
    phoneTestId: "kishore-phone",
  },
  {
    testId: "archana-card",
    photo: ASSETS.archana,
    alt: "Archana S",
    role: "CIO",
    name: "Archana S",
    bio: "Leads digital systems, data management, and technology infrastructure supporting drone development and company operations.",
    email: "archana061106@gmail.com",
    emailTestId: "archana-email",
    phone: "+91 80720 87765",
    phoneHref: "+918072087765",
    phoneTestId: "archana-phone",
  },
];

const Logo = ({ size = 56, withText = true }) => (
  <span className="logo-wrap" data-testid="logo-wrap">
    <span
      className="logo-mark"
      style={{ width: size, height: size }}
      aria-hidden
    />
    {withText && <span className="logo-text">RAGAS <em>AEROSPACE</em></span>}
  </span>
);

const Socials = () => (
  <div className="socials" data-testid="socials">
    {SOCIALS.map((s) => {
      const isMail = s.url.startsWith("mailto:");
      return (
        <a
          key={s.id}
          href={s.url}
          {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className="social-icon"
          aria-label={s.label}
          title={s.label}
          data-testid={`social-${s.id}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
        </a>
      );
    })}
  </div>
);

const ContactIcon = ({ type }) => (
  <svg className="founder-contact-icon" viewBox="0 0 24 24" aria-hidden>
    {type === "phone" ? (
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1 .3 2 .5 3.1.5.7 0 1.3.6 1.3 1.3v3.5c0 .7-.6 1.3-1.3 1.3C10.2 21.5 2.5 13.8 2.5 4.3 2.5 3.6 3.1 3 3.8 3h3.5c.7 0 1.3.6 1.3 1.3 0 1.1.2 2.1.5 3.1.1.4 0 .8-.3 1.2l-2.2 2.2z" />
    ) : (
      <path d="M3.5 5h17c.8 0 1.5.7 1.5 1.5v11c0 .8-.7 1.5-1.5 1.5h-17c-.8 0-1.5-.7-1.5-1.5v-11C2 5.7 2.7 5 3.5 5zm.8 2 7.7 5 7.7-5H4.3zm15.7 9.8V8.9l-8 5.2-8-5.2v7.9h16z" />
    )}
  </svg>
);

const TeamCard = ({ member, index }) => (
  <div className="founder-card" data-testid={member.testId} style={{ "--member-index": index }}>
    <span className="founder-card-cue" aria-hidden>↗</span>
    <div className="founder-avatar">
      <img src={member.photo} alt={member.alt} loading="lazy" />
    </div>
    <div className="founder-info">
      <div className="founder-role">{member.role}</div>
      <div className="founder-name">{member.name}</div>
      <p className="founder-bio">{member.bio}</p>
      <div className="founder-links">
        <a href={`mailto:${member.email}`} data-testid={member.emailTestId}>
          <ContactIcon type="mail" />
          <span>{member.email}</span>
        </a>
        <a href={`tel:${member.phoneHref}`} data-testid={member.phoneTestId}>
          <ContactIcon type="phone" />
          <span>{member.phone}</span>
        </a>
      </div>
    </div>
  </div>
);

// ---------- Nav ----------
const NAV_ITEMS = [
  { id: "products", label: "Products", testId: "nav-products" },
  { id: "technology", label: "Technology", testId: "nav-tech" },
  { id: "company", label: "Company", testId: "nav-company" },
  { id: "careers", label: "Careers", testId: "nav-careers" },
  { id: "support", label: "Support", testId: "nav-support" },
];

function Nav({ onOpenAuth }) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const normalizeSection = (id) => (id === "mission" ? "company" : id);
    const observedIds = ["products", "mission", "technology", "company", "careers", "support"];
    const sections = observedIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const syncHash = () => {
      const id = window.location.hash.replace("#", "");
      if (observedIds.includes(id)) setActiveSection(normalizeSection(id));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveSection(normalizeSection(visible.target.id));
        }
      },
      { rootMargin: "-30% 0px -58% 0px", threshold: [0.08, 0.22, 0.45] }
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("hashchange", syncHash);
    syncHash();
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  return (
    <nav className="nav" data-testid="main-nav">
      <a href="#top" className="nav-logo" data-testid="nav-logo">
        <Logo size={56} />
      </a>

      <button 
        className="mobile-menu-toggle" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
        <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
      </button>

      <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeSection === item.id ? "active" : ""}
            onClick={() => {
              setActiveSection(item.id);
              setMobileMenuOpen(false);
            }}
            data-testid={item.testId}
          >
            {item.label}
          </a>
        ))}
        {user ? (
          <div className="nav-user">
            <span data-testid="nav-user-name">{user.name?.split(" ")[0]}</span>
            <button 
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }} 
              data-testid="logout-btn"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button 
            className="nav-cta" 
            onClick={() => {
              onOpenAuth();
              setMobileMenuOpen(false);
            }} 
            data-testid="signin-cta"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

// ---------- Auth Modal ----------
function AuthModal({ open, onClose, defaultMode = "login" }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) { setErr(""); setMode(defaultMode); } }, [open, defaultMode]);
  if (!open) return null;
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      if (mode === "login") await login(email.trim(), password);
      else await register(name.trim(), email.trim(), password);
      onClose();
    } catch (e) {
      setErr(fmtErr(e?.response?.data?.detail) || e.message);
    } finally { setBusy(false); }
  };
  return (
    <div className="roles-overlay" data-testid="auth-modal" onClick={(e) => e.target.classList.contains("roles-overlay") && onClose()}>
      <div className="auth-modal">
        <button className="modal-close" onClick={onClose} data-testid="auth-close">✕</button>
        <div className="section-label">— {mode === "login" ? "Welcome Back" : "Join Ragas"}</div>
        <h2 className="auth-title">{mode === "login" ? "Sign In" : "Create Account"}</h2>
        <p className="auth-sub">{mode === "login" ? "Sign in to apply for open roles." : "Create your account to apply for open roles."}</p>
        <form onSubmit={submit}>
          {mode === "register" && (
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required data-testid="auth-name" placeholder="Your full name" />
            </div>
          )}
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="auth-email" placeholder="you@example.com" />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} data-testid="auth-password" placeholder="At least 6 characters" />
          </div>
          {err && <div className="form-error" data-testid="auth-error">{err}</div>}
          <button type="submit" className="submit-btn" disabled={busy} data-testid="auth-submit">
            {busy ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>
        <div className="auth-toggle">
          {mode === "login" ? "New here?" : "Already have an account?"}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} data-testid="auth-toggle">
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Product detail modal ----------
function ProductModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="roles-overlay" data-testid="product-modal" onClick={(e) => e.target.classList.contains("roles-overlay") && onClose()}>
      <div className="product-modal">
        <button className="modal-close" onClick={onClose} data-testid="product-close">✕</button>
        <div className="product-modal-img">
          {product.img ? (
            <img src={product.img} alt={product.name} data-testid={`pm-img-${product.id}`} />
          ) : (
            <div style={{ color: "var(--dim)", padding: 40, textAlign: "center" }}>
              <DroneSVG />
              <div style={{ marginTop: 12, fontSize: 13, letterSpacing: "0.2em" }}>IMAGE COMING SOON</div>
            </div>
          )}
        </div>
        <div className="product-modal-body">
          <div className="section-label">{product.num}</div>
          <h2>{product.name}</h2>
          <p>{product.long}</p>
          <div className="pm-section-label">Key Features</div>
          <ul className="pm-list">{product.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <div className="pm-section-label">Applications</div>
          <ul className="pm-list">{product.applications.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function AchievementModal({ achievement, onClose }) {
  if (!achievement) return null;
  return (
    <div className="roles-overlay" data-testid="achievement-modal" onClick={(e) => e.target.classList.contains("roles-overlay") && onClose()}>
      <div className="product-modal">
        <button className="modal-close" onClick={onClose} data-testid="achievement-close">✕</button>
        <div className="product-modal-img">
          {achievement.img ? (
            <img src={achievement.img} alt={achievement.title} data-testid={`am-img-${achievement.id}`} />
          ) : (
            <div style={{ color: "var(--dim)", padding: 40, textAlign: "center" }}>
              <DroneSVG />
              <div style={{ marginTop: 12, fontSize: 13, letterSpacing: "0.2em" }}>PHOTO COMING SOON</div>
            </div>
          )}
        </div>
        <div className="product-modal-body">
          <div className="section-label">{achievement.location} • {achievement.year}</div>
          <h2>{achievement.title}</h2>
          <p style={{ marginTop: 16, lineHeight: 1.7, fontSize: 14, color: "var(--text)" }}>{achievement.body}</p>
        </div>
      </div>
    </div>
  );
}

// ---------- Application Form ----------
const SKILL_OPTIONS = ["CAD / 3D Modeling", "Python / ML", "Embedded C/C++", "Drone Piloting", "Circuit Design", "Computer Vision", "Flight Control", "Data Analysis"];

function ApplicationForm({ role, onBack, onDone }) {
  const [data, setData] = useState({ first_name: "", last_name: "", email: "", phone: "", college: "", year: "", area: role.title, skills: [], notes: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const upd = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const toggleSkill = (s) => setData((d) => ({ ...d, skills: d.skills.includes(s) ? d.skills.filter((x) => x !== s) : [...d.skills, s] }));
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      await api.post("/applications", { role: role.type, role_title: role.title, data });
      onDone();
    } catch (e) { setErr(fmtErr(e?.response?.data?.detail) || e.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="form-panel" data-testid="application-form">
      <div className="form-header">
        <button className="form-back-btn" onClick={onBack} data-testid="form-back">← Back</button>
        <div className="form-role-name">Apply — {role.title}</div>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field"><label>First Name</label><input required value={data.first_name} onChange={(e) => upd("first_name", e.target.value)} data-testid="form-firstname" /></div>
          <div className="field"><label>Last Name</label><input required value={data.last_name} onChange={(e) => upd("last_name", e.target.value)} data-testid="form-lastname" /></div>
        </div>
        <div className="form-grid full" style={{ marginTop: 14 }}>
          <div className="field"><label>Email</label><input required type="email" value={data.email} onChange={(e) => upd("email", e.target.value)} data-testid="form-email" /></div>
        </div>
        <div className="form-grid" style={{ marginTop: 14 }}>
          <div className="field"><label>Phone</label><input value={data.phone} onChange={(e) => upd("phone", e.target.value)} data-testid="form-phone" placeholder="+91 9XXXXXXXXX" /></div>
          <div className="field"><label>College / Institution</label><input value={data.college} onChange={(e) => upd("college", e.target.value)} data-testid="form-college" /></div>
        </div>
        <div className="form-grid" style={{ marginTop: 14 }}>
          <div className="field"><label>Year of Study</label>
            <select value={data.year} onChange={(e) => upd("year", e.target.value)} data-testid="form-year">
              <option value="">Select year</option>
              <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Postgraduate</option>
            </select>
          </div>
          <div className="field"><label>Area of Interest</label><input value={data.area} onChange={(e) => upd("area", e.target.value)} data-testid="form-area" /></div>
        </div>
        <div className="field" style={{ marginTop: 16 }}>
          <label>Skills & Interests</label>
          <div className="skills-grid">
            {SKILL_OPTIONS.map((s) => (
              <label key={s} className="skill-check"><input type="checkbox" checked={data.skills.includes(s)} onChange={() => toggleSkill(s)} /><span>{s}</span></label>
            ))}
          </div>
        </div>
        <div className="field" style={{ marginTop: 14 }}>
          <label>Anything else?</label>
          <textarea rows={3} value={data.notes} onChange={(e) => upd("notes", e.target.value)} data-testid="form-notes" placeholder="Optional — links, portfolio, motivation" />
        </div>
        {err && <div className="form-error" data-testid="form-error">{err}</div>}
        <button type="submit" className="submit-btn" disabled={busy} data-testid="form-submit">
          {busy ? "Submitting…" : "Submit Application →"}
        </button>
      </form>
    </div>
  );
}

// ---------- Roles Modal ----------
const ROLES = [
  { id: 1, type: "internship", title: "Drone Engineer", dept: "Engineering — Hardware", tags: ["UAV Design", "CAD", "Embedded"] },
  { id: 2, type: "internship", title: "AI / ML Research", dept: "Engineering — Software", tags: ["Python", "TensorFlow", "Computer Vision"] },
  { id: 3, type: "internship", title: "UI / UX Designer", dept: "Design — Product", tags: ["Figma", "Prototyping", "User Research"] },
  { id: 4, type: "ra", title: "Research Associate", dept: "R&D — Autonomous Systems", tags: ["Research", "Analysis", "Documentation"] },
  { id: 5, type: "workshop", title: "Drone Building Workshop", dept: "Training — Hands-On Program", tags: ["Beginner", "Assembly", "Flight Training"] },
];

function RolesModal({ open, onClose, onOpenAuth }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  useEffect(() => { if (open) setFilter("all"); }, [open]);
  if (!open) return null;
  const filtered = ROLES.filter((r) => filter === "all" || r.type === filter);
  const apply = () => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="roles-overlay" data-testid="roles-modal" onClick={(e) => e.target.classList.contains("roles-overlay") && onClose()}>
      <div className="roles-modal">
        <button className="modal-close" onClick={onClose} data-testid="roles-close">✕</button>
        <div>
          <div className="section-label">— Join The Team</div>
          <h2 className="section-title" style={{ fontSize: 56, margin: 0 }}>Open Roles</h2>
          <div className="filter-tabs">
            {[["all", "All Roles"], ["internship", "Internship / Core team"], ["workshop", "Workshop"], ["ra", "Research Associate"]].map(([id, label]) => (
              <button key={id} className={`filter-btn ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)} data-testid={`filter-${id}`}>{label}</button>
            ))}
          </div>
          <div className="roles-grid">
            {filtered.map((r) => (
              <div key={r.id} className="role-card" data-testid={`role-card-${r.id}`}>
                <span className={`role-badge ${r.type}`}>{r.type === "ra" ? "Research Associate" : r.type[0].toUpperCase() + r.type.slice(1)}</span>
                <div className="role-title">{r.title}</div>
                <div className="role-dept">{r.dept}</div>
                <div className="role-tags">{r.tags.map((t) => <span key={t} className="role-tag">{t}</span>)}</div>
                <button className="role-apply-btn" onClick={() => apply(r)} data-testid={`apply-${r.id}`}>
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Reveal hook ----------
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => e.isIntersecting && e.target.classList.add("in"));
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ---------- Achievements section (3-col grid, hover reveals description) ----------
function Achievements({ onOpen }) {
  return (
    <section className="section" id="achievements" data-testid="achievements-section">
      <div className="scanner-overlay">
        <div className="scanner-grid" />
        <div className="scanner-laser" />
        <div className="scanner-radar left" />
        <div className="scanner-corner tl" />
        <div className="scanner-corner tr" />
        <div className="scanner-corner bl" />
        <div className="scanner-corner br" />
        <div className="scanner-hud-left">SYS_ACTIVE // SCAN_ACH</div>
        <div className="scanner-hud-right">MILESTONE_C2</div>
      </div>
      <div className="section-header reveal">
        <div>
          <div className="section-label">Recognition · Milestones</div>
          <h2 className="section-title">Our<br />Achievements</h2>
        </div>
        <p style={{ color: "var(--dim)", maxWidth: 320, fontSize: 13 }}>
          Click any milestone to read the full story.
        </p>
      </div>

      <div className="ach-cards reveal" data-testid="ach-cards">
        {ACHIEVEMENTS.map((a, i) => (
          <article 
            key={a.id} 
            className="ach-card" 
            data-testid={`ach-card-${a.id}`} 
            tabIndex={0}
            onClick={() => onOpen(a)}
            role="button"
          >
            <div className="ach-card-body">
              <div className="ach-num">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="ach-card-title">{a.title}</h3>
              <div className="ach-sub">
                <span>{a.location}</span>
                <span className="ach-dot">•</span>
                <span className="ach-year">{a.year}</span>
              </div>
              <div className="ach-hint">Click for details →</div>
            </div>
            <div className="ach-desc" aria-hidden>
              <div className="ach-desc-photo">
                {a.img ? (
                  <img src={a.img} alt={a.title} loading="lazy" />
                ) : (
                  <div className="ach-preview-empty">
                    <DroneSVG />
                    <div>Photo coming soon</div>
                  </div>
                )}
              </div>
              <div className="ach-desc-text">
                <div className="ach-desc-label">— {a.title}</div>
                <p>{a.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- Main Page ----------
function HomePage({ openAuth, setOpenAuth, openRoles, setOpenRoles, activeProduct, setActiveProduct }) {
  useReveal();
  const [activeAchievement, setActiveAchievement] = useState(null);

  useEffect(() => {
    // Lock scroll during intro animation to prevent scrolling away from top
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const timer = setTimeout(() => {
      // Re-enable scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // Scroll to the top of the page
      window.scrollTo(0, 0);
    }, 4200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div id="top">
      <EntryReveal />
      <Nav onOpenAuth={() => setOpenAuth(true)} />

      {/* HERO */}
      <section className="hero" data-testid="hero-section">
        <video
          className="hero-video-bg"
          src="/drone-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-video-overlay" />
        <div className="hero-grid" />
        <div className="hero-scanner" />
        <div className="hero-content">
          <div className="hero-label">Autonomous Drone Systems</div>
          <h1 className="hero-title" data-testid="hero-title">
            Precision<br /><em>in Every</em><br />Flight
          </h1>
          <p className="hero-sub">
            Autonomous drone systems driven by advanced AI and real-time decision-making.
            Built to protect, built to prevail.
          </p>
          <div className="hero-actions">
            <a href="#products" className="btn-primary" data-testid="hero-view-products">View Products</a>
            <button className="btn-ghost" onClick={() => setOpenRoles(true)} data-testid="hero-open-roles">Open Roles →</button>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker"><div className="ticker-track">
        {Array.from({ length: 2 }).map((_, i) => (
          <React.Fragment key={i}>
            <span className="ticker-item">Autonomous Systems</span>
            <span className="ticker-item">AI-Driven Defense</span>
            <span className="ticker-item">Tri-Copter UAV</span>
            <span className="ticker-item">Quadcopter</span>
            <span className="ticker-item">Hexacopter</span>
            <span className="ticker-item">Octocopter</span>
            <span className="ticker-item">VTOL UAV</span>
            <span className="ticker-item">FPV Drone</span>
          </React.Fragment>
        ))}
      </div></div>

      {/* STATS */}
      <div className="stats reveal">
        <div className="stat-item"><div className="stat-num">3<sup>+</sup></div><div className="stat-label">Countries Delivered</div></div>
        <div className="stat-item"><div className="stat-num">55<sup>+</sup></div><div className="stat-label">Engineers & Operators</div></div>
        <div className="stat-item"><div className="stat-num">14<sup>+</sup></div><div className="stat-label">Autonomous Drone Fleet</div></div>
      </div>

      {/* ACHIEVEMENTS */}
      <Achievements onOpen={setActiveAchievement} />

      {/* PRODUCTS */}
      <section className="section" id="products">
        <div className="scanner-overlay">
          <div className="scanner-grid" />
          <div className="scanner-laser" />
          <div className="scanner-radar right" />
          <div className="scanner-corner tl" />
          <div className="scanner-corner tr" />
          <div className="scanner-corner bl" />
          <div className="scanner-corner br" />
          <div className="scanner-hud-left">SYS_ACTIVE // SCAN_PROD</div>
          <div className="scanner-hud-right">SYSTEMS_C2</div>
        </div>
        <div className="section-header reveal">
          <div>
            <div className="section-label">Platform</div>
            <h2 className="section-title">Integrated<br />Systems</h2>
          </div>
          <p style={{ color: "var(--dim)", maxWidth: 320, fontSize: 13 }}>Click any platform to view full specifications, key features and applications.</p>
        </div>
        <div className="product-grid reveal">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="product-card thumb-card"
              data-testid={`product-${p.id}`}
              onClick={() => setActiveProduct(p)}
              role="button" tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveProduct(p)}
            >
              <div className="thumb">
                {p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : <DroneSVG />}
              </div>
              <div className="thumb-body">
                <div className="product-num">{p.num}</div>
                <div className="product-name">{p.name}</div>
                <p className="product-desc">{p.short}</p>
                <div style={{ marginTop: 14, color: "var(--accent)", fontFamily: "Barlow Condensed", fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                  View Details →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <div className="mission reveal" id="mission">
        <video
          className="mission-video-bg"
          src="/mission-drone.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="mission-video-overlay" />

        <div className="mission-content">
          <div className="section-label">Our Mission</div>
          <h2 className="mission-title">Building the Future of Drones</h2>
          <p className="mission-body">At Ragas Aerospace, we are committed to developing cutting-edge unmanned aerial systems that enhance defense capabilities and support our nation's security objectives.</p>
          <div className="pillars">
            <div className="pillar"><div className="pillar-num">01</div><div><h4>Autonomous Systems</h4><p>Removing the human from harm's way with AI-first design philosophy.</p></div></div>
            <div className="pillar"><div className="pillar-num">02</div><div><h4>Software-Defined</h4><p>With AI integration, we tie every sensor, weapon, and operator into one coherent picture.</p></div></div>
            <div className="pillar"><div className="pillar-num">03</div><div><h4>Speed of Relevance</h4><p>Building and fielding systems fast enough to stay ahead of adversaries.</p></div></div>
          </div>
        </div>
      </div>

      {/* TECHNOLOGY */}
      <section className="section" id="technology">
        <div className="scanner-overlay">
          <div className="scanner-grid" />
          <div className="scanner-laser" />
          <div className="scanner-radar left" />
          <div className="scanner-corner tl" />
          <div className="scanner-corner tr" />
          <div className="scanner-corner bl" />
          <div className="scanner-corner br" />
          <div className="scanner-hud-left">SYS_ACTIVE // SCAN_TECH</div>
          <div className="scanner-hud-right">CORE_TECH_C2</div>
        </div>
        <div className="section-header reveal">
          <div>
            <div className="section-label">How We Build</div>
            <h2 className="section-title">Core<br />Technology</h2>
          </div>
        </div>
        <div className="tech-grid reveal">
          {[
            { n: "01", t: "AI & Autonomy", b: "Onboard edge-AI architecture enabling real-time decision-making, swarm coordination, and autonomous navigation in contested environments.", l: ["Autonomous swarm coordination", "AI-based target recognition", "Edge AI computing"] },
            { n: "02", t: "Sensors & Payloads", b: "Modular payload systems engineered for ISR, surveillance, reconnaissance, and tactical mission adaptability.", l: ["EO/IR & thermal imaging", "Radar / lidar integration", "SIGINT collection"] },
            { n: "03", t: "Communications & C2", b: "Secure encrypted data links, mesh-networked drone communication, and distributed C2 infrastructure.", l: ["Encrypted RF & satellite links", "Jam-resistant comms", "Ground control station"] },
            { n: "04", t: "Platform Engineering", b: "Lightweight composite airframes designed for rapid deployment, field maintainability, and mission adaptability.", l: ["Low-observable airframe", "VTOL platforms", "Electric & hybrid propulsion"] },
          ].map((c) => (
            <div key={c.n} className="tech-card">
              <div className="tech-num">{c.n}</div>
              <h3 className="tech-title">{c.t}</h3>
              <p className="tech-body">{c.b}</p>
              <ul className="tech-list">{c.l.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section" id="industries" style={{ background: "var(--off-black)" }}>
        <div className="scanner-overlay">
          <div className="scanner-grid" />
          <div className="scanner-laser" />
          <div className="scanner-radar right" />
          <div className="scanner-corner tl" />
          <div className="scanner-corner tr" />
          <div className="scanner-corner bl" />
          <div className="scanner-corner br" />
          <div className="scanner-hud-left">SYS_ACTIVE // SCAN_IND</div>
          <div className="scanner-hud-right">OPERATE_C2</div>
        </div>
        <div className="section-header reveal">
          <div>
            <div className="section-label">Where We Operate</div>
            <h2 className="section-title">Industries<br />We Serve</h2>
          </div>
        </div>
        <div className="industries-grid reveal">
          {[
            { tag: "01 — Defense", name: "Defense &\nArmed Forces", body: "Advanced autonomous aerial systems for ISR, tactical surveillance, counter-UAS missions, and multi-domain defence operations.", tags: ["ISR & tactical reconnaissance", "Autonomous swarm surveillance", "Counter-UAS"] },
            { tag: "02 — Security", name: "Border &\nHomeland Security", body: "Persistent border monitoring with day/night autonomous patrol and intrusion detection.", tags: ["Border surveillance", "Intrusion detection", "Day/night ops"] },
            { tag: "03 — Infrastructure", name: "Critical\nInfrastructure", body: "AI-powered aerial systems for monitoring power grids, industrial facilities, pipelines, and remote assets.", tags: ["Infrastructure inspection", "Perimeter security", "Real-time analytics"] },
            { tag: "04 — Civil", name: "Law Enforcement\n& Civil Ops", body: "Mission-adaptive drone platforms for public safety, disaster response, search-and-rescue, and emergency operations.", tags: ["Search & rescue", "Disaster response", "Crowd monitoring"] },
          ].map((i) => (
            <div key={i.tag} className="industry-card">
              <div className="industry-tag">{i.tag}</div>
              <h3 className="industry-name" style={{ whiteSpace: "pre-line" }}>{i.name}</h3>
              <p className="industry-body">{i.body}</p>
              <div className="industry-tags">{i.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANY */}
      <section className="section" id="company">
        <div className="scanner-overlay">
          <div className="scanner-grid" />
          <div className="scanner-laser" />
          <div className="scanner-corner tl" />
          <div className="scanner-corner tr" />
          <div className="scanner-corner bl" />
          <div className="scanner-corner br" />
          <div className="scanner-hud-left">SYS_ACTIVE // SCAN_COMP</div>
          <div className="scanner-hud-right">COMPANY_C2</div>
        </div>
        <div className="section-header reveal">
          <div>
            <div className="section-label">Who We Are</div>
            <h2 className="section-title">About<br />Ragas Aerospace</h2>
          </div>
        </div>
        <div className="reveal" style={{ maxWidth: 900 }}>
          <p style={{ color: "var(--dim)", fontSize: 16, lineHeight: 1.8 }}>
            Ragas Aerospace is an Indian defence technology company building next-generation autonomous aerial systems for surveillance, security, and mission-critical operations. Founded in 2026 by a team of engineers, researchers, and defence technology innovators, we develop intelligent drone platforms integrating AI, swarm autonomy, advanced sensing, and secure communications.
          </p>
        </div>
      </section>

      {/* CAREERS */}
      <section className="section" id="careers" style={{ background: "var(--off-black)" }}>
        <div className="scanner-overlay">
          <div className="scanner-grid" />
          <div className="scanner-laser" />
          <div className="scanner-radar left" />
          <div className="scanner-corner tl" />
          <div className="scanner-corner tr" />
          <div className="scanner-corner bl" />
          <div className="scanner-corner br" />
          <div className="scanner-hud-left">SYS_ACTIVE // SCAN_CAREER</div>
          <div className="scanner-hud-right">RECRUIT_C2</div>
        </div>
        <div className="section-header reveal">
          <div>
            <div className="section-label">Join The Team</div>
            <h2 className="section-title">Build What<br />Matters</h2>
          </div>
        </div>
        <p className="reveal" style={{ color: "var(--dim)", maxWidth: 720, fontSize: 16, lineHeight: 1.7 }}>
          Work on the hardest problems in defense technology alongside the best engineers in the world.
        </p>
        <div className="reveal" style={{ marginTop: 40 }}>
          <button className="btn-primary" onClick={() => setOpenRoles(true)} data-testid="careers-open-roles">View Open Roles →</button>
        </div>
      </section>

      {/* SUPPORT / FOUNDERS */}
      <section className="section" id="support">
        <div className="scanner-overlay">
          <div className="scanner-grid" />
          <div className="scanner-laser" />
          <div className="scanner-radar right" />
          <div className="scanner-corner tl" />
          <div className="scanner-corner tr" />
          <div className="scanner-corner bl" />
          <div className="scanner-corner br" />
          <div className="scanner-hud-left">SYS_ACTIVE // SCAN_SUP</div>
          <div className="scanner-hud-right">SUPPORT_C2</div>
        </div>
        <div className="section-header reveal">
          <div>
            <div className="section-label">Support · Get In Touch</div>
            <h2 className="section-title">Founders &<br />Contact</h2>
          </div>
          <Socials />
        </div>

        {/* Official support email block */}
        <div className="reveal support-block" data-testid="support-block">
          <div className="support-block-inner">
            <div>
              <div className="section-label" style={{ marginBottom: 8 }}>— Official Support</div>
              <h3 className="support-mail-title">Email us at</h3>
              <a
                href="mailto:ragasaerospace@gmail.com"
                className="support-mail"
                data-testid="support-mail"
              >
                ragasaerospace@gmail.com
              </a>
              <p className="support-mail-sub">
                For partnerships, general enquiries, press, and product information.
                We typically reply within 1–2 business days.
              </p>
            </div>
            <a
              href="mailto:ragasaerospace@gmail.com"
              className="btn-primary"
              data-testid="support-mail-cta"
            >
              Compose Email →
            </a>
          </div>
        </div>

        {/* Portfolios links block */}
        <div className="reveal portfolios-container" style={{ marginTop: 24 }}>
          <a
            href="https://founder-portfolio-steel.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-card"
            data-testid="founder-portfolio-link"
          >
            <div className="portfolio-card-icon">👤</div>
            <div>
              <h4 className="portfolio-card-title">Founder's Portfolio</h4>
              <p className="portfolio-card-desc">Explore the founder's research, background, and previous projects.</p>
            </div>
            <span className="portfolio-card-arrow">→</span>
          </a>
          <a
            href="https://ragas-aerospace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-card"
            data-testid="company-portfolio-link"
          >
            <div className="portfolio-card-icon">🏢</div>
            <div>
              <h4 className="portfolio-card-title">Company's Portfolio</h4>
              <p className="portfolio-card-desc">View our full corporate portfolio, credentials, and achievements.</p>
            </div>
            <span className="portfolio-card-arrow">→</span>
          </a>
        </div>

        <div className="founders-grid reveal" data-testid="founders-grid" style={{ marginTop: 56 }}>
          {/* FOUNDER — male */}
          <div className="founder-card" data-testid="founder-card">
            <div className="founder-avatar">
              <img src={ASSETS.founder} alt="Founder" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="founder-role">Founder & CEO</div>
              <div className="founder-name">Raghav S</div>
              <p className="founder-bio">
                Aerospace engineer and defence technologist building autonomous systems
                that protect lives. Leads platform engineering and product strategy.
              </p>
              <div className="founder-links">
                <a href="mailto:raghavsaravanan22@gmail.com" data-testid="founder-email">raghavsaravanan22@gmail.com</a>
                <a href="tel:+919884739061" data-testid="founder-phone">+91 98847 39061</a>
              </div>
            </div>
          </div>

          <div className="founder-card" data-testid="kishore-card">
            <div className="founder-avatar">
              <img src={ASSETS.kishore} alt="Kishore Karthik R" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="founder-role">CAO</div>
              <div className="founder-name">Kishore Karthik R</div>
              <p className="founder-bio">
                Coordinates administrative functions, documentation, compliance, and
                internal operations across the organization.
              </p>
              <div className="founder-links">
                <a href="mailto:kishorekarthik432@gmail.com" data-testid="kishore-email">kishorekarthik432@gmail.com</a>
                <a href="tel:+919110628437" data-testid="kishore-phone">+91 91106 28437</a>
              </div>
            </div>
          </div>

          <div className="founder-card" data-testid="varsha-card">
            <div className="founder-avatar">
              <img src={ASSETS.varsha} alt="K P Varsha" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="founder-role">Secretary</div>
              <div className="founder-name">K P Varsha</div>
              <p className="founder-bio">
                Maintains company records, manages communications, schedules meetings,
                and assists with organizational coordination.
              </p>
              <div className="founder-links">
                <a href="mailto:Varshaa.k.pavithran@gmail.com" data-testid="varsha-email">Varshaa.k.pavithran@gmail.com</a>
                <a href="tel:+918610646791" data-testid="varsha-phone">+91 86106 46791</a>
              </div>
            </div>
          </div>

          <div className="founder-card" data-testid="archana-card">
            <div className="founder-avatar">
              <img src={ASSETS.archana} alt="Archana S" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="founder-role">CIO</div>
              <div className="founder-name">Archana S</div>
              <p className="founder-bio">
                Leads digital systems, data management, and technology infrastructure
                supporting drone development and company operations.
              </p>
              <div className="founder-links">
                <a href="mailto:archana061106@gmail.com" data-testid="archana-email">archana061106@gmail.com</a>
                <a href="tel:+918072087765" data-testid="archana-phone">+91 80720 87765</a>
              </div>
            </div>
          </div>

          <div className="founder-card" data-testid="sujitha-card">
            <div className="founder-avatar">
              <img src={ASSETS.sujitha} alt="Sujitha M" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="founder-role">Co-Founder</div>
              <div className="founder-name">Sujitha M</div>
              <p className="founder-bio">
                Supports strategic planning, business growth, partnerships, and the
                successful execution of the company's mission and objectives.
              </p>
              <div className="founder-links">
                <a href="mailto:sujithamoni15@gmail.com" data-testid="sujitha-email">sujithamoni15@gmail.com</a>
                <a href="tel:+919514052550" data-testid="sujitha-phone">+91 95140 52550</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div className="footer-brand">
            <Logo size={56} />
          </div>
          <div style={{ marginTop: 16 }}><Socials /></div>
        </div>
        <p>© 2026 Ragas Aerospace. Precision in every flight.</p>
      </footer>

      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
      <RolesModal
        open={openRoles}
        onClose={() => setOpenRoles(false)}
        onOpenAuth={() => {
          setOpenRoles(false);
          setOpenAuth(true);
        }}
      />
      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      <AchievementModal achievement={activeAchievement} onClose={() => setActiveAchievement(null)} />
    </div>
  );
}

// ---------- ADMIN PAGE ----------
function AdminPage() {
  const { user, login, logout } = useAuth();
  const [tab, setTab] = useState("applications");
  const [stats, setStats] = useState(null);
  const [apps, setApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [logins, setLogins] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const loadAll = async () => {
    try {
      const [s, a, u, l] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/applications"),
        api.get("/admin/users"),
        api.get("/admin/logins"),
      ]);
      setStats(s.data); setApps(a.data); setUsers(u.data); setLogins(l.data);
    } catch (e) {
      setErr(fmtErr(e?.response?.data?.detail) || e.message);
    }
  };

  useEffect(() => {
    if (user?.is_admin) loadAll();
  }, [user]);

  const doLogin = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await login(email.trim(), pwd); }
    catch (e) { setErr(fmtErr(e?.response?.data?.detail) || e.message); }
    finally { setBusy(false); }
  };

  const csvDownload = (rows, filename) => {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const escape = (v) => {
      if (v == null) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  // Loading
  if (user === undefined) {
    return <div className="admin-shell"><p style={{ color: "var(--dim)" }}>Loading…</p></div>;
  }

  // Not signed in
  if (!user) {
    return (
      <div className="admin-shell">
        <div className="admin-login">
          <Link to="/" className="admin-back" data-testid="admin-home-link">← Back to site</Link>
          <div className="section-label" style={{ marginTop: 18 }}>— Restricted</div>
          <h1 className="admin-title">Admin Sign In</h1>
          <p style={{ color: "var(--dim)", marginBottom: 24 }}>Sign in with an admin account to view applications and login history.</p>
          <form onSubmit={doLogin}>
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="admin-email" />
            </div>
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Password</label>
              <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required data-testid="admin-password" />
            </div>
            {err && <div className="form-error" data-testid="admin-error">{err}</div>}
            <button type="submit" className="submit-btn" disabled={busy} data-testid="admin-login-submit">
              {busy ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Signed in but not admin
  if (!user.is_admin) {
    return (
      <div className="admin-shell">
        <div className="admin-login">
          <Link to="/" className="admin-back">← Back to site</Link>
          <div className="section-label" style={{ marginTop: 18 }}>— 403</div>
          <h1 className="admin-title">Not authorised</h1>
          <p style={{ color: "var(--dim)", marginBottom: 18 }}>The account <strong style={{ color: "var(--accent)" }}>{user.email}</strong> is not an admin.</p>
          <button className="btn-ghost" onClick={logout} data-testid="admin-signout-noaccess">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <Link to="/" className="admin-back" data-testid="admin-back">← Back to site</Link>
          <h1 className="admin-title">Ragas Aerospace · Admin</h1>
          <p style={{ color: "var(--dim)", fontSize: 13, marginTop: 4 }}>Signed in as {user.email}</p>
        </div>
        <button className="btn-ghost" onClick={logout} data-testid="admin-signout">Sign out</button>
      </header>

      {stats && (
        <div className="admin-stats" data-testid="admin-stats">
          <div className="admin-stat"><div className="admin-stat-num">{stats.users}</div><div className="admin-stat-label">Users</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{stats.applications}</div><div className="admin-stat-label">Applications</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{stats.logins}</div><div className="admin-stat-label">Logins</div></div>
        </div>
      )}

      <div className="admin-tabs">
        {[["applications", "Applications"], ["users", "Users"], ["logins", "Login History"]].map(([id, label]) => (
          <button key={id} className={`filter-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)} data-testid={`admin-tab-${id}`}>
            {label}
          </button>
        ))}
        <button className="btn-ghost" style={{ marginLeft: "auto" }} onClick={loadAll} data-testid="admin-refresh">↻ Refresh</button>
        {tab === "applications" && <button className="btn-primary" onClick={() => csvDownload(apps, "applications.csv")} data-testid="csv-apps">⤓ CSV</button>}
        {tab === "users" && <button className="btn-primary" onClick={() => csvDownload(users, "users.csv")} data-testid="csv-users">⤓ CSV</button>}
        {tab === "logins" && <button className="btn-primary" onClick={() => csvDownload(logins, "logins.csv")} data-testid="csv-logins">⤓ CSV</button>}
      </div>

      {err && <div className="form-error" data-testid="admin-load-error">{err}</div>}

      {tab === "applications" && (
        <div className="admin-table-wrap" data-testid="apps-table">
          <table className="admin-table">
            <thead><tr><th>Submitted</th><th>Role</th><th>Name</th><th>Email</th><th>Phone</th><th>College</th><th>Year</th><th>Skills</th><th>Notes</th></tr></thead>
            <tbody>
              {apps.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{r.role_title}</td>
                  <td>{[r.data?.first_name, r.data?.last_name].filter(Boolean).join(" ")}</td>
                  <td>{r.data?.email}</td>
                  <td>{r.data?.phone}</td>
                  <td>{r.data?.college}</td>
                  <td>{r.data?.year}</td>
                  <td>{Array.isArray(r.data?.skills) ? r.data.skills.join(", ") : ""}</td>
                  <td>{r.data?.notes}</td>
                </tr>
              ))}
              {apps.length === 0 && <tr><td colSpan="9" style={{ color: "var(--dim)", textAlign: "center", padding: 30 }}>No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-table-wrap" data-testid="users-table">
          <table className="admin-table">
            <thead><tr><th>Joined</th><th>Name</th><th>Email</th><th>Admin</th></tr></thead>
            <tbody>
              {users.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.is_admin ? "✓" : ""}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="4" style={{ color: "var(--dim)", textAlign: "center", padding: 30 }}>No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "logins" && (
        <div className="admin-table-wrap" data-testid="logins-table">
          <table className="admin-table">
            <thead><tr><th>When</th><th>Email</th><th>Name</th><th>IP</th><th>Status</th><th>User Agent</th></tr></thead>
            <tbody>
              {logins.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{r.user_email}</td>
                  <td>{r.user_name}</td>
                  <td>{r.ip}</td>
                  <td><span className={`pill pill-${r.status || ""}`}>{r.status}</span></td>
                  <td style={{ maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.user_agent}</td>
                </tr>
              ))}
              {logins.length === 0 && <tr><td colSpan="6" style={{ color: "var(--dim)", textAlign: "center", padding: 30 }}>No logins yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function App() {
  const [openAuth, setOpenAuth] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <HomePage
              openAuth={openAuth} setOpenAuth={setOpenAuth}
              openRoles={openRoles} setOpenRoles={setOpenRoles}
              activeProduct={activeProduct} setActiveProduct={setActiveProduct}
            />
          } />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
