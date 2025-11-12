import React from "react";
import { Refine, Authenticated } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import "./App.css";

import { authProvider } from "./providers/authProvider";
import Dashboard from "./pages/dashboard";
import { Login } from "./pages/login";
import { AccountSettings } from "./pages/settings";

function App() {
  return (
    <BrowserRouter>
      <Refine
        authProvider={authProvider}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          <Route
            element={
              <Authenticated
                key="authenticated-routes"
                fallback={<Navigate to="/login" replace />}
              >
                <Outlet />
              </Authenticated>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<AccountSettings />} />
          </Route>

          <Route
            element={
              <Authenticated key="auth-pages" fallback={<Outlet />}>
                <Navigate to="/" replace />
              </Authenticated>
            }
          >
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
