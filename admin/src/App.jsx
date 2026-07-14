import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

// Phim
import Movies from './pages/Movies';
import MovieForm from './pages/MovieForm';
import MovieDetails from './pages/MovieDetails';

// Banner
import BannerList from './pages/BannerList';
import BannerForm from './pages/BannerForm';
import BannerDetails from './pages/BannerDetails';

// Lịch chiếu
import ShowtimeList from './pages/ShowtimeList';
import ShowtimeForm from './pages/ShowtimeForm';

// Phòng chiếu
import RoomList from './pages/RoomList';
import RoomForm from './pages/RoomForm';

// Người dùng
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';

// Ghế ngồi
import SeatManagement from './pages/SeatManagement';

// Đơn vé
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import VoucherList from './pages/VoucherList';

// Rạp chiếu phim
import CinemaList from './pages/CinemaList';
import CinemaForm from './pages/CinemaForm';

// Bắp nước
import FoodDrinkList from './pages/FoodDrinkList';
import FoodDrinkForm from './pages/FoodDrinkForm';
import FoodDrinkDetails from './pages/FoodDrinkDetails';
import AdminProfile from './pages/AdminProfile';

import AuthPage from './pages/AuthPage';
import StaffForm from './pages/StaffForm';
import LightManagement from './pages/LightManagement';
import './styles/App.css';

const IndexRedirect = () => {
  const userStr = localStorage.getItem('adminUser');
  let isStaff = false;
  if (userStr) {
    try {
      isStaff = JSON.parse(userStr).role === 'STAFF';
    } catch (e) {}
  }
  return isStaff ? <Navigate to="/invoices" replace /> : <Dashboard />;
};

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('adminUser');
  let isAdmin = false;
  if (userStr) {
    try {
      isAdmin = JSON.parse(userStr).role === 'ADMIN';
    } catch (e) {}
  }
  return isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<IndexRedirect />} />
          
          {/* Movies Routes */}
          <Route path="movies" element={<Movies />} />
          <Route path="movies/create" element={<MovieForm />} />
          <Route path="movies/edit/:id" element={<MovieForm />} />
          <Route path="movies/details/:id" element={<MovieDetails />} />

          {/* Cinemas Routes */}
          <Route path="cinemas" element={<CinemaList />} />
          <Route path="cinemas/create" element={<CinemaForm />} />
          <Route path="cinemas/edit/:id" element={<CinemaForm />} />

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
          <Route path="food-drinks/details/:id" element={<FoodDrinkDetails />} />

          <Route path="profile" element={<AdminProfile />} />

          {/* Seats Route */}
          <Route path="seats" element={<SeatManagement />} />
          
          {/* Invoices Route */}
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />

          {/* Admin Only Routes */}
          {/* Users Route */}
          <Route path="users" element={<AdminRoute><UserList /></AdminRoute>} />
          <Route path="users/create-staff" element={<AdminRoute><StaffForm /></AdminRoute>} />
          <Route path="users/edit-staff/:id" element={<AdminRoute><StaffForm /></AdminRoute>} />
          <Route path="users/:id" element={<AdminRoute><UserDetail /></AdminRoute>} />

          {/* Banners Routes */}
          <Route path="banners" element={<AdminRoute><BannerList /></AdminRoute>} />
          <Route path="banners/create" element={<AdminRoute><BannerForm /></AdminRoute>} />
          <Route path="banners/edit/:id" element={<AdminRoute><BannerForm /></AdminRoute>} />
          <Route path="banners/details/:id" element={<AdminRoute><BannerDetails /></AdminRoute>} />

          {/* Lights Route */}
          <Route path="lights" element={<AdminRoute><LightManagement /></AdminRoute>} />

          {/* Vouchers Route */}
          <Route path="vouchers" element={<AdminRoute><VoucherList /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
