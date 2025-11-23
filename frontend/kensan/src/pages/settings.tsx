import React, { useState, useEffect } from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./settings.css";

interface UpdateProfileData {
  currentPassword: string;
  name?: string;
  email?: string;
  password?: string;
}

export const AccountSettings: React.FC = () => {
  const { data: identity, refetch: refetchIdentity } = useGetIdentity();
  const { mutate: logout } = useLogout();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (identity) {
      setName(identity.name || "");
      setEmail(identity.email || "");
      setProfilePicture(identity.profile_picture || null);
    }
  }, [identity]);

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

  const handleUploadPicture = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/profile/upload-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccessMessage("Profile picture uploaded successfully!");
      setProfilePicture(response.data.profile_picture);
      setSelectedFile(null);
      setPreviewUrl(null);
      await refetchIdentity();
      // Trigger sidebar update
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await axios.delete("http://localhost:3000/api/profile/delete-picture", {
        withCredentials: true,
      });

      setSuccessMessage("Profile picture deleted successfully!");
      setProfilePicture(null);
      await refetchIdentity();
      // Trigger sidebar update
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (field: 'name' | 'email' | 'password') => {
    if (!currentPassword) {
      setError("Current password is required to make changes");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const updateData: UpdateProfileData = {
      currentPassword,
    };

    if (field === 'name') {
      if (!name) {
        setError("Name cannot be empty");
        setIsLoading(false);
        return;
      }
      updateData.name = name;
    } else if (field === 'email') {
      if (!email) {
        setError("Email cannot be empty");
        setIsLoading(false);
        return;
      }
      updateData.email = email;
    } else if (field === 'password') {
      if (!newPassword) {
        setError("New password cannot be empty");
        setIsLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        setIsLoading(false);
        return;
      }
      updateData.password = newPassword;
    }

    try {
      await axios.put(
        "http://localhost:3000/api/profile/update",
        updateData,
        {
          withCredentials: true,
        }
      );

      setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      setCurrentPassword("");
      if (field === 'password') {
        setNewPassword("");
        setConfirmPassword("");
      }
      await refetchIdentity();
      // Trigger sidebar update
      window.dispatchEvent(new Event('profileUpdated'));
      
      // Auto-logout after password or email change
      if (field === 'password' || field === 'email') {
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to update ${field}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Password is required to delete your account");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await axios.delete(
        "http://localhost:3000/api/profile/delete-account",
        {
          data: { password: deletePassword },
          withCredentials: true,
        }
      );

      setSuccessMessage("Account deleted successfully. Logging out...");
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kensan-container">
      <Sidebar activeItem="settings" />

      <div className="kensan-main-content">
        <main className="kensan-dashboard-main">
          <div className="kensan-settings-wrapper">
            <h1 className="kensan-settings-title">Account Settings</h1>

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

            <div className="kensan-settings-grid">
              {/* Profile Picture Section */}
              <div className="kensan-settings-card">
                <h2 className="kensan-settings-section-title">Profile Picture</h2>
                <div className="kensan-profile-picture-section">
                  <div className="kensan-profile-picture-preview">
                    {previewUrl || profilePicture ? (
                      <img
                        src={previewUrl || (profilePicture?.startsWith('http') 
                          ? profilePicture 
                          : `http://localhost:3000/profile_pictures/${profilePicture}`
                        )}
                        alt="Profile"
                      />
                    ) : (
                      <span className="material-symbols-outlined">person</span>
                    )}
                  </div>
                  <div className="kensan-profile-picture-actions">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                      id="profile-picture-input"
                    />
                    <label htmlFor="profile-picture-input" className="kensan-btn kensan-btn-secondary">
                      Select Picture
                    </label>
                    {selectedFile && (
                      <button
                        onClick={handleUploadPicture}
                        disabled={isLoading}
                        className="kensan-btn kensan-btn-primary"
                      >
                        Upload
                      </button>
                    )}
                    {profilePicture && (
                      <button
                        onClick={handleDeletePicture}
                        disabled={isLoading}
                        className="kensan-btn kensan-btn-danger"
                      >
                        Delete Picture
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name Section */}
              <div className="kensan-settings-card">
                <h2 className="kensan-settings-section-title">Change Name</h2>
                <div className="kensan-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="kensan-input"
                    placeholder="Your name"
                  />
                </div>
                <div className="kensan-form-group">
                  <label>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="kensan-input"
                      placeholder="Verify with password"
                      style={{ paddingRight: '45px' }}
                    />
                    <span 
                      className="material-symbols-outlined"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                      {showCurrentPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateProfile('name')}
                  disabled={isLoading}
                  className="kensan-btn kensan-btn-primary"
                >
                  Update Name
                </button>
              </div>

              {/* Email Section */}
              <div className="kensan-settings-card">
                <h2 className="kensan-settings-section-title">Change Email</h2>
                <div className="kensan-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="kensan-input"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="kensan-form-group">
                  <label>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="kensan-input"
                      placeholder="Verify with password"
                      style={{ paddingRight: '45px' }}
                    />
                    <span 
                      className="material-symbols-outlined"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                      {showCurrentPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateProfile('email')}
                  disabled={isLoading}
                  className="kensan-btn kensan-btn-primary"
                >
                  Update Email
                </button>
              </div>

              {/* Password Section */}
              <div className="kensan-settings-card">
                <h2 className="kensan-settings-section-title">Change Password</h2>
                <div className="kensan-form-group">
                  <label>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="kensan-input"
                      placeholder="Current password"
                      style={{ paddingRight: '45px' }}
                    />
                    <span 
                      className="material-symbols-outlined"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                      {showCurrentPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </div>
                </div>
                <div className="kensan-form-group">
                  <label>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="kensan-input"
                      placeholder="New password"
                      style={{ paddingRight: '45px' }}
                    />
                    <span 
                      className="material-symbols-outlined"
                      onClick={() => setShowNewPassword(!showNewPassword)}
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
                      {showNewPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </div>
                </div>
                <div className="kensan-form-group">
                  <label>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="kensan-input"
                      placeholder="Confirm password"
                      style={{ paddingRight: '45px' }}
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
                  onClick={() => handleUpdateProfile('password')}
                  disabled={isLoading}
                  className="kensan-btn kensan-btn-primary"
                >
                  Update Password
                </button>
              </div>

              {/* Delete Account Section */}
              <div className="kensan-settings-card" style={{ gridColumn: '1 / -1', maxWidth: '600px', borderColor: 'var(--color-kensan-power-off)' }}>
                <h2 className="kensan-settings-section-title" style={{ color: 'var(--color-kensan-power-off)' }}>Delete Account</h2>
                <p style={{ color: 'var(--color-kensan-light_gray)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  ⚠️ Warning: This action is permanent and cannot be undone.
                </p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="kensan-btn kensan-btn-danger"
                  >
                    Delete My Account
                  </button>
                ) : (
                  <div>
                    <div className="kensan-form-group">
                      <label>Confirm Password to Delete Account</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showDeletePassword ? "text" : "password"}
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="kensan-input"
                          placeholder="Enter your password"
                          style={{ paddingRight: '45px' }}
                        />
                        <span 
                          className="material-symbols-outlined"
                          onClick={() => setShowDeletePassword(!showDeletePassword)}
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
                          {showDeletePassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="kensan-btn kensan-btn-danger"
                      >
                        {isLoading ? "Deleting..." : "Confirm Delete"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword("");
                        }}
                        disabled={isLoading}
                        className="kensan-btn kensan-btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
