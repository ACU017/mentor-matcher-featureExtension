import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Mentor from "./pages/Mentor";
import Mentee from "./pages/Mentee";
import Admin from "./pages/Admin";
import Index from "./pages/Index";
// import MenteesList from "./components/MenteesList";
import { Routes, Route } from "react-router-dom";
import Matches from "./components/Matches";
import MentorsList from "./components/MentorsList";

function App() {
  return (
    <>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/mentee" element={<Mentee />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/admin/mentors" element={<MentorsList />} />
        </Routes>

        {/* <MenteesList /> */}
      </div>
    </>
  );
}

export default App;
