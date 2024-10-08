import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Results from "./Pages/Results";
import Fees from "./Pages/Fees";
import Helpdesk from "./Pages/Helpdesk";
import TopScore from "./Pages/TopScore";
import Community from "./Pages/Community";
import Drops from "./Pages/Drops";
import AlumniIcons from "./Pages/Alumni-Icons";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <ToastContainer autoClose={2000}/>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/results" element={<Results />}></Route>
        <Route path="/fees" element={<Fees />}></Route>
        <Route path="/helpdesk" element={<Helpdesk />}></Route>
        <Route path="/ranks" element={<TopScore />}></Route>
        <Route path="/community" element={<Community />}></Route>
        <Route path="/drops" element={<Drops />}></Route>
        <Route path="/alumni" element={<AlumniIcons />}></Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
