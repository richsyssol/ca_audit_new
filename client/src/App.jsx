import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect/AuthRedirect";
import useAuthStore from "./store/authStore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/404/PageNotFound";
import Form1Application from "./pages/Forms/Form1Application";
import Form2Application from "./pages/Forms/Form2Application";
import Form7Application from "./pages/Forms/Form7Application";
import Form8Application from "./pages/Forms/Form8Application";
import Form9Application from "./pages/Forms/Form9Application";
import Form6Application from "./pages/Forms/Form6Application";
import Form5Application from "./pages/Forms/Form5Application";
import Form4Application from "./pages/Forms/Form4Application";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check authentication on mount
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route
          index
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <Signup />
            </AuthRedirect>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/peer/form1"
          element={
            <ProtectedRoute>
              <Form1Application />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/peer/form1"
          element={
            <ProtectedRoute>
              <Form2Application />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/peer/form4"
          element={
            <ProtectedRoute>
              <Form4Application />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/peer/form5"
          element={
            <ProtectedRoute>
              <Form5Application />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/peer/form6"
          element={
            <ProtectedRoute>
              <Form6Application />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/peer/form7"
          element={
            <ProtectedRoute>
              <Form7Application />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/peer/form8"
          element={
            <ProtectedRoute>
              <Form8Application />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/peer/form9"
          element={
            <ProtectedRoute>
              <Form9Application />
            </ProtectedRoute>
          }
        />
        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
