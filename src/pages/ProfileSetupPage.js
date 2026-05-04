import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProfileSetupPage.css';

const ProfileSetupPage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(user?.avatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), avatar: preview });
    navigate('/home');
  };

  const initials = name.trim()
    ? name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="setup-root">
      <div className="app-bg" />
      <div className="setup-container">
        <div className="setup-header animate-fade-up">
          <div className="step-badge">Profile Setup</div>
          <h1>Make it <em>yours</em></h1>
          <p>Add your photo and name to personalize every greeting</p>
        </div>

        <div className="setup-card glass-card animate-fade-up delay-2">
          {/* Avatar Upload */}
          <div className="avatar-section">
            <div
              className={`avatar-drop-zone ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview} alt="Avatar preview" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <span className="avatar-initials">{initials}</span>
                </div>
              )}
              <div className="avatar-overlay">
                <span>📷</span>
                <span>Upload Photo</span>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={e => handleFile(e.target.files[0])}
            />
            <p className="upload-hint">Click or drag & drop your photo</p>
          </div>

          {/* Name Input */}
          <div className="name-section">
            <label className="field-label">Display Name</label>
            <div className="name-input-wrap">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name..."
                className="name-input"
                maxLength={30}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <span className="name-counter">{name.length}/30</span>
            </div>
          </div>

          {/* Preview Badge */}
          {name.trim() && (
            <div className="preview-badge animate-fade-in">
              {preview ? (
                <img src={preview} alt="" className="preview-badge-avatar" />
              ) : (
                <div className="preview-badge-initials">{initials}</div>
              )}
              <span>{name.trim()}</span>
              <span className="preview-badge-label">on your cards</span>
            </div>
          )}

          <div className="setup-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!name.trim()}
              style={{ flex: 1 }}
            >
              Continue to Templates ✦
            </button>
          </div>

          <button className="skip-btn" onClick={() => navigate('/home')}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
