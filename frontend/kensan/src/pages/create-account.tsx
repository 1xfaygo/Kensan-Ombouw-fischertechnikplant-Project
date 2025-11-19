import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./settings.css";

export const CreateAccount: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email,
          password,
          name,
          role,
        },
        {
          withCredentials: true,
        }
      );

      // Upload profile picture if selected
      if (selectedFile && response.data.user?.id) {
        const formData = new FormData();
        formData.append("profilePicture", selectedFile);
        formData.append("userId", response.data.user.id);

        try {
          await axios.post(
            "http://localhost:3000/api/profile/upload-picture-for-user",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );
        } catch (uploadErr) {
          console.error("Failed to upload profile picture:", uploadErr);
        }
      }

      setSuccessMessage("Account created successfully!");
      
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("user");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kensan-container">
      <Sidebar activeItem="create-account" />

      <div className="kensan-main-content">
        <div className="kensan-header">
          <div>
            <h1 className="kensan-header-title">Create New Account</h1>
            <p className="kensan-header-subtitle">» Create a new account</p>
          </div>
        </div>

        <main className="kensan-dashboard-main">
          {error && (
            <div className="kensan-settings-notification kensan-settings-error">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="kensan-settings-notification kensan-settings-success">
              <span className="material-symbols-outlined">check_circle</span>
              {successMessage}
            </div>
          )}

          <div className="kensan-create-account-card">
                
                <form onSubmit={handleCreateAccount}>
                  <div className="kensan-form-group">
                    <label>Profile Picture (Optional)</label>
                    <div className="kensan-profile-picture-upload">
                      <div className="kensan-profile-picture-preview-small">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" />
                        ) : (
                          <span className="material-symbols-outlined">person</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          style={{ display: "none" }}
                          id="create-account-picture-input"
                        />
                        <label 
                          htmlFor="create-account-picture-input" 
                          className="kensan-btn kensan-btn-secondary"
                          style={{ width: '100%', display: 'inline-block', textAlign: 'center' }}
                        >
                          {selectedFile ? "Change Picture" : "Select Picture"}
                        </label>
                        {selectedFile && (
                          <p style={{ 
                            marginTop: '0.5rem', 
                            fontSize: '0.85rem', 
                            color: 'var(--color-kensan-light_gray)' 
                          }}>
                            {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="kensan-form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="kensan-input"
                      placeholder="Hamza Bulut"
                      required
                    />
                  </div>

                  <div className="kensan-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="kensan-input"
                      placeholder="user@kensan.nl"
                      required
                    />
                  </div>

                  <div className="kensan-form-group">
                    <label>Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="kensan-input"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="kensan-form-group">
                    <label>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="kensan-input"
                        placeholder="••••••••"
                        style={{ paddingRight: '45px' }}
                        required
                      />
                      <span 
                        className="material-symbols-outlined"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: 'var(--color-kensan-light_gray)',
                          fontSize: '20px',
                          userSelect: 'none'
                        }}
                      >
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </div>
                  </div>

                  <div className="kensan-form-group">
                    <label>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="kensan-input"
                        placeholder="••••••••"
                        style={{ paddingRight: '45px' }}
                        required
                      />
                      <span 
                        className="material-symbols-outlined"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: 'var(--color-kensan-light_gray)',
                          fontSize: '20px',
                          userSelect: 'none'
                        }}
                      >
                        {showConfirmPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="kensan-btn kensan-btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    {isLoading ? "Creating..." : "Create Account"}
                  </button>
                </form>
            </div>
        </main>
      </div>
    </div>
  );
};
