import React from "react";
import "./App.css";
import Dashboard from "./pages/dashboard";

/**
 * 🏭 KENSAN APP - HOOFDBESTAND
 * 
 * Dit is de basis van je applicatie.
 * Login systeem is tijdelijk uitgeschakeld.
 * 
 * TODO: In de toekomst een email-gebaseerd login systeem toevoegen
 * - Email/password login form
 * - Geen Google/GitHub OAuth
 * - JWT tokens voor authenticatie
 */

function App() {
  return <Dashboard />;
}

export default App;
