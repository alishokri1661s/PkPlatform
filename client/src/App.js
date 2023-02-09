import React, { Component, useState, useEffect } from "react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import MainScreen from "./screens/MainScreen";
import SubScreen from "./screens/SubScreen";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<HomeScreen />} />
          <Route path="/main" element={<MainScreen />} />
          <Route path="/snapp" element={<SubScreen />} />
          <Route path="/digikala" element={<SubScreen />} />
          <Route path="/home" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
