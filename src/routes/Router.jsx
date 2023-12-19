import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignUp } from '../pages/SignUp';
import { LogIn } from '../pages/LogIn';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
};
