import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "sonner";

// Page Components
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { MenuPage } from "./pages/MenuPage";
import { BookTablePage } from "./pages/BookTablePage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { MyReservationsPage } from "./pages/MyReservationsPage";
import { AdminDashboard } from "./pages/AdminDashboard";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#F3F2ED] font-sans antialiased text-[#01311F]">
          {/* Main Navigation */}
          <Navbar />

          {/* Core Pages Content Viewport */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/menu" element={<MenuPage />} />

              {/* Customer Area Protected Routes */}
              <Route 
                path="/book-table" 
                element={
                  <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                    <BookTablePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                    <MyOrdersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-reservations" 
                element={
                  <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                    <MyReservationsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Area Protected Route */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Graceful Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Universal Footer Component */}
          <Footer />

          {/* Sonner toast manager style configuration */}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: "#01311F",
                color: "#F3F2ED",
                border: "1px solid #C6AA58"
              }
            }} 
          />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
