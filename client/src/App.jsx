import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Mentor from "./pages/Mentor";
import Mentee from "./pages/Mentee";
import Admin from "./pages/Admin";
import Test from "./pages/Test";
// import MenteesList from "./components/MenteesList";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div>
        <Navbar />

        <Routes>
          {/* <Route path="/" element={<MenteesList />} /> */}
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/mentee" element={<Mentee />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        {/* <MenteesList /> */}
      </div>
    </>
  );
}

export default App;
