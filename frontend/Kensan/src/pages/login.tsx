import { useLogin } from "@refinedev/core";
import { useState } from "react";
import "../kensan.css";
import "../login.css";

export const Login: React.FC = () => {
  const { mutate: login } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    login(
      { email, password },
      {
        onError: (error) => {
          setError(error.message || "Invalid email or password");
          setIsLoading(false);
        },
        onSuccess: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
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
            src="/logo.png"
            alt="Kensan Logo"
            className="kensan-login-logo"
          />
          <p className="kensan-login-subtitle">Login to continue</p>
        </div>

        {error && <div className="kensan-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
                required
                placeholder="your@email.com"
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
                required
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
