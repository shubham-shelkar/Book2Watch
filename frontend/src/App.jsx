import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ===============================
// USER PAGES
// ===============================
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Booking from "./pages/Booking";
import Seats from "./pages/Seats";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import Movies from "./pages/Movies";

// ===============================
// COMPONENTS
// ===============================
import Footer from "./components/Footer";

// ===============================
// ADMIN PAGES
// ===============================
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminCinemas from "./pages/admin/AdminCinemas";
import AdminShows from "./pages/admin/AdminShows";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminUsers from "./pages/admin/AdminUsers";

import "./App.css";


// =====================================================
// PROTECTED USER ROUTE
// =====================================================

function ProtectedRoute({ children }) {

  const user = localStorage.getItem("user");

  // User login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User login hai
  return children;
}


// =====================================================
// APP
// =====================================================

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            DEFAULT
        ================================================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />


        {/* =================================================
            USER AUTH
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================================
            PUBLIC ABOUT PAGE
        ================================================= */}

        <Route
          path="/about"
          element={<AboutUs />}
        />


        {/* =================================================
            PROTECTED USER PAGES
        ================================================= */}

        {/* Home */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />


        {/* Movies */}

        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />


        {/* Movie Details */}

        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />


        {/* Booking */}

        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />


        {/* Seats */}

        <Route
          path="/seats/:id"
          element={
            <ProtectedRoute>
              <Seats />
            </ProtectedRoute>
          }
        />


        {/* Payment */}

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />


        {/* My Bookings */}

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/movies"
          element={<AdminMovies />}
        />

        <Route
          path="/admin/cinemas"
          element={<AdminCinemas />}
        />

        <Route
          path="/admin/shows"
          element={<AdminShows />}
        />

        <Route
          path="/admin/bookings"
          element={<AdminBookings />}
        />

        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />


        {/* =================================================
            INVALID URL
        ================================================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;