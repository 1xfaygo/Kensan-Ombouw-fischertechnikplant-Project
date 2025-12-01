import { useLogin } from "@refinedev/core";
import { useState, useEffect } from "react";
import axios from "axios";
import "../kensan.css";
import "../login.css";

const API_URL = "http://localhost:3000/api";

export const Login: React.FC = () => {
  const { mutate: login } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('kensan-theme');
    return saved === 'dark' || saved === null;
  });

  // Logo path based on theme
  const logoSrc = isDarkMode ? '/logo_dark.png' : '/logo_light.png';

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('kensan-theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Frontend validatie
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true
      });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      }
    } catch (err: any) {
      console.log('Login failed:', err);
      setError(err?.response?.data?.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      // Dark mode
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem('kensan-theme', 'dark');
    } else {
      // Light mode
      document.documentElement.classList.add("light-mode");
      localStorage.setItem('kensan-theme', 'light');
    }
  };

  return (
    <div className="kensan-login-container">
      <div className="kensan-login-theme-toggle">
        <button
          className={`kensan-theme-toggle-btn ${!isDarkMode ? "light" : ""}`}
          onClick={toggleTheme}
        >
          <span className="material-symbols-outlined kensan-theme-icon sunny">
            sunny
          </span>
          <span className="material-symbols-outlined kensan-theme-icon dark_mode">
            dark_mode
          </span>
        </button>
      </div>

      <div className="kensan-login-card">
        <div className="kensan-login-header">
          <img
            src={logoSrc}
            alt="Kensan Logo"
            className="kensan-login-logo"
          />
          <p className="kensan-login-subtitle">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="kensan-login-error">{error}</div>}
          
          <div className="kensan-login-form-group">
            <label htmlFor="email" className="kensan-login-label">
              Email
            </label>
            <div className="kensan-login-input-wrapper">
              <span className="material-symbols-outlined kensan-login-input-icon">
                person
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@kensan.nl"
                className="kensan-login-input"
              />
            </div>
          </div>

          <div className="kensan-login-form-group">
            <label htmlFor="password" className="kensan-login-label">
              Password
            </label>
            <div className="kensan-login-input-wrapper">
              <span className="material-symbols-outlined kensan-login-input-icon">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="kensan-login-input kensan-login-input-with-icon-right"
              />
              <span
                className="material-symbols-outlined kensan-login-input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="kensan-login-button"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
