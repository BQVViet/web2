import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

// Phim
import Movies from './pages/Movies';
import MovieForm from './pages/MovieForm';

// Banner
import BannerList from './pages/BannerList';
import BannerForm from './pages/BannerForm';

// Lịch chiếu
import ShowtimeList from './pages/ShowtimeList';
import ShowtimeForm from './pages/ShowtimeForm';

// Phòng chiếu
import RoomList from './pages/RoomList';
import RoomForm from './pages/RoomForm';

// Người dùng
import UserList from './pages/UserList';

// Đơn vé
import InvoiceList from './pages/InvoiceList';

// Rạp chiếu phim
import CinemaList from './pages/CinemaList';
import CinemaForm from './pages/CinemaForm';

// Bắp nước
import FoodDrinkList from './pages/FoodDrinkList';
import FoodDrinkForm from './pages/FoodDrinkForm';

import AuthPage from './pages/AuthPage';
import './styles/App.css';

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Movies Routes */}
          <Route path="movies" element={<Movies />} />
          <Route path="movies/create" element={<MovieForm />} />
          <Route path="movies/edit/:id" element={<MovieForm />} />

          {/* Cinemas Routes */}
          <Route path="cinemas" element={<CinemaList />} />
          <Route path="cinemas/create" element={<CinemaForm />} />
          <Route path="cinemas/edit/:id" element={<CinemaForm />} />

          {/* Banners Routes */}
          <Route path="banners" element={<BannerList />} />
          <Route path="banners/create" element={<BannerForm />} />
          <Route path="banners/edit/:id" element={<BannerForm />} />

          {/* Showtimes Routes */}
          <Route path="showtimes" element={<ShowtimeList />} />
          <Route path="showtimes/create" element={<ShowtimeForm />} />
          <Route path="showtimes/edit/:id" element={<ShowtimeForm />} />

          {/* Rooms Routes */}
          <Route path="rooms" element={<RoomList />} />
          <Route path="rooms/create" element={<RoomForm />} />
          <Route path="rooms/edit/:id" element={<RoomForm />} />

          {/* Food/Drink Routes */}
          <Route path="food-drinks" element={<FoodDrinkList />} />
          <Route path="food-drinks/create" element={<FoodDrinkForm />} />
          <Route path="food-drinks/edit/:id" element={<FoodDrinkForm />} />

          {/* Users Route */}
          <Route path="users" element={<UserList />} />
          
          {/* Invoices Route */}
          <Route path="invoices" element={<InvoiceList />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
