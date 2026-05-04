import React, { useState, useEffect, useRef } from 'react';
import { composeGreetingImage, shareImage, downloadImage } from '../utils/imageComposer';
import './PersonalizeModal.css';

const PersonalizeModal = ({ template, user, onClose }) => {
  const [displayName, setDisplayName] = useState(user?.name || 'Your Name');
  const [avatarDataUrl, setAvatarDataUrl] = useState(user?.avatar || null);
  const [composedImage, setComposedImage] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const fileRef = useRef(null);
  const debounceRef = useRef(null);

  // Compose image whenever inputs change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsComposing(true);
      const img = await composeGreetingImage({
        template,
        userName: displayName,
        avatarDataUrl,
      });
      setComposedImage(img);
      setIsComposing(false);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [template, displayName, avatarDataUrl]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarDataUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleShare = async () => {
    if (!composedImage) return;
    setShareStatus('sharing');
    const result = await shareImage(composedImage, template);
    setShareStatus(result.method === 'native' ? 'shared' : 'downloaded');
    setTimeout(() => setShareStatus(''), 2500);
  };

  const handleDownload = () => {
    if (!composedImage) return;
    downloadImage(composedImage, `greeting-${template.id}.png`);
    setShareStatus('downloaded');
    setTimeout(() => setShareStatus(''), 2000);
  };

  const shareOptions = [
    { id: 'whatsapp', label: 'WhatsApp', emoji: '📱', color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(template.message)}` },
    { id: 'instagram', label: 'Instagram', emoji: '📸', color: '#E4405F', url: '#' },
    { id: 'email', label: 'Email', emoji: '📧', color: '#6B9FFF', url: `mailto:?subject=Greeting from Greeting App&body=${encodeURIComponent(template.message)}` },
    { id: 'copy', label: 'Copy Link', emoji: '🔗', color: '#00D4AA', url: '#' },
  ];

  return (
    <div className="personalize-backdrop" onClick={onClose}>
      <div className="personalize-modal glass-card animate-fade-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="personalize-layout">
          {/* LEFT: Preview */}
          <div className="preview-panel">
            <div className="preview-label">Live Preview</div>
            <div className="composed-preview-wrap">
              {composedImage ? (
                <img
                  src={composedImage}
                  alt="Composed greeting"
                  className={`composed-img ${isComposing ? 'recomposing' : ''}`}
                />
              ) : (
                <div className="preview-loading">
                  <div className="compose-spinner" />
                  <span>Composing...</span>
                </div>
              )}
              {isComposing && composedImage && (
                <div className="recompose-overlay">✦ Updating...</div>
              )}
            </div>

            {/* Template info */}
            <div className="template-meta">
              <span className="template-emoji">{template.emoji}</span>
              <div>
                <div className="template-meta-title">{template.title}</div>
                <div className="template-meta-msg">"{template.message}"</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div className="controls-panel">
            <h2 className="personalize-heading">
              Personalize <em>Your Card</em>
            </h2>

            {/* Avatar Upload */}
            <div className="control-section">
              <label className="control-label">Profile Photo</label>
              <div className="avatar-row">
                <div className="avatar-thumb" onClick={() => fileRef.current?.click()}>
                  {avatarDataUrl
                    ? <img src={avatarDataUrl} alt="avatar" />
                    : <span>👤</span>
                  }
                  <div className="avatar-thumb-overlay">Change</div>
                </div>
                <div className="avatar-row-info">
                  <p>This photo will appear on your card</p>
                  <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
                    Upload Photo
                  </button>
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>

            {/* Name */}
            <div className="control-section">
              <label className="control-label">Your Name on Card</label>
              <input
                type="text"
                className="control-input"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Enter name..."
                maxLength={25}
              />
            </div>

            {/* Share Buttons */}
            <div className="control-section">
              <label className="control-label">Share On</label>
              <div className="share-grid">
                {shareOptions.map(opt => (
                  <a
                    key={opt.id}
                    href={opt.url}
                    target={opt.id !== 'copy' ? '_blank' : undefined}
                    rel="noreferrer"
                    className="share-chip"
                    style={{ '--chip-color': opt.color }}
                    onClick={opt.id === 'copy' ? (e) => {
                      e.preventDefault();
                      navigator.clipboard?.writeText(template.message);
                      setShareStatus('copied');
                      setTimeout(() => setShareStatus(''), 2000);
                    } : undefined}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="action-buttons">
              <button
                className="btn btn-primary share-main-btn"
                onClick={handleShare}
                disabled={!composedImage}
              >
                {shareStatus === 'sharing' ? '⏳ Sharing...' : '📤 Share Image'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleDownload}
                disabled={!composedImage}
                title="Download PNG"
              >
                ⬇
              </button>
            </div>

            {/* Status toast */}
            {shareStatus && shareStatus !== 'sharing' && (
              <div className="share-toast animate-fade-in">
                {shareStatus === 'shared' && '✅ Shared successfully!'}
                {shareStatus === 'downloaded' && '✅ Downloaded!'}
                {shareStatus === 'copied' && '✅ Copied to clipboard!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeModal;
