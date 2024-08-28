import React, { useEffect, useState } from "react";
import Register from "./Components/AuthenticationPages/Register";
import Login from "./Components/AuthenticationPages/Login";
import { NotFound } from "./Components/AuthenticationPages/NotFound";
import { HashRouter, Routes, Route, Navigation, Navigate } from "react-router-dom";
import ProtectedRoute from "./Components/MainPages/ProtectedRoute";
import MainPage from "./Components/MainPages/MainPage";
import { TestPage } from "./Components/MainPages/TestPages/TestPage";
import { ConfirmSignUp } from "./Components/AuthenticationPages/ConfirmSignUp";
import { TestMainPage } from "./Components/MainPages/TestPages/TestMainPage";


function Logout() {
  localStorage.clear()
  return <Navigate to={'/login'} />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/" 
          element ={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/test" element={<TestPage/>}/>
        <Route path="/:email" element={<MainPage />} />
        <Route path="/confirm/:email" element={<ConfirmSignUp/>}/>
        <Route path="/test/:email" element={<TestMainPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
    
  )
}

export default App;
