import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/components/login/Login";
import Botpage from "../src/components/bot_page/Botpage";
import Homepage from "./components/homepage/Homepage";
import Jobpage from "./components/jobpage/Jobpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/client/:clientName" element={<Jobpage />} />
        <Route path="/client/:clientName/job/:jobId" element={<Botpage />} />
      </Routes>
    </Router>
  );
}

export default App;
