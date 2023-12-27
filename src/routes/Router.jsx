import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { SignUp } from '../pages/SignUp';
import { LogIn } from '../pages/LogIn';
import { Profile } from '../pages/Profile';
import { New } from '../pages/New';
import { Detail } from '../pages/Detail';
import { Edit } from '../pages/Edit';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new" element={<New />} />
        <Route path="/detail/:detailId" element={<Detail />} />
        <Route path="/edit/:detailId" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
};
