import { useContext } from "react"; // Added useContext
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Page Imports
import Login from "./pages/Login";
import Students from "./pages/Students";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Lecturers from "./pages/Lecturers";
import StudentProfile from "./pages/StudentProfile";
import Courses from "./pages/Courses";
import Reports from "./pages/Reports";
import AttendanceScanner from "./pages/AttendanceScanner";

// Context Import
import { AuthContext } from "./store/AuthContext";

// Enhanced component to protect routes by Token AND Role
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // 1. If not logged in, go to login
  if (!token || !user) {
    return <Navigate to="/" />;
  }

  // 2. If role is not allowed for this route, go to dashboard (or a 403 page)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  // 3. Authorized -> Show Layout and Page
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Routes for Everyone Authenticated */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin", "lecturer", "student"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/students"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Students />
            </PrivateRoute>
          }
        />
        <Route
          path="/lecturers"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Lecturers />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Register />
            </PrivateRoute>
          }
        />

        {/* Lecturer & Admin Routes */}
        <Route
          path="/courses"
          element={
            <PrivateRoute allowedRoles={["admin", "lecturer"]}>
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/scanner"
          element={
            <PrivateRoute allowedRoles={["admin", "lecturer"]}>
              <AttendanceScanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute allowedRoles={["admin", "lecturer"]}>
              <Reports />
            </PrivateRoute>
          }
        />

        {/* Student Only Routes */}
        <Route
          path="/my-id"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentProfile />
            </PrivateRoute>
          }
        />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
