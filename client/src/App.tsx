import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NewsDetail from './pages/NewsDetail';
import NewsForm from './pages/NewsForm';
import NewsList from './pages/NewsList';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<NewsList />} />
          <Route path="/newsposts/new" element={<NewsForm />} />
          <Route path="/newsposts/:id" element={<NewsDetail />} />
          <Route path="/newsposts/:id/edit" element={<NewsForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
