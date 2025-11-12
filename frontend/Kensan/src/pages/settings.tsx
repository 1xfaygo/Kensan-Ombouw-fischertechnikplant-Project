import React, { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./settings.css";

interface UpdateProfileData {
  currentPassword: string;
  name?: string;
  email?: string;
  newPassword?: string;
}

export const AccountSettings: React.FC = () => {
  const { data: identity, refetch: refetchIdentity } = useGetIdentity();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
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
      refetchIdentity();
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
      refetchIdentity();
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
      updateData.newPassword = newPassword;
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
      refetchIdentity();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to update ${field}`);
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
                        src={previewUrl || `http://localhost:3000${profilePicture}`}
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
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="kensan-input"
                    placeholder="Verify with password"
                  />
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
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="kensan-input"
                    placeholder="Verify with password"
                  />
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
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="kensan-input"
                    placeholder="Current password"
                  />
                </div>
                <div className="kensan-form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="kensan-input"
                    placeholder="New password"
                  />
                </div>
                <div className="kensan-form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="kensan-input"
                    placeholder="Confirm password"
                  />
                </div>
                <button
                  onClick={() => handleUpdateProfile('password')}
                  disabled={isLoading}
                  className="kensan-btn kensan-btn-primary"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
