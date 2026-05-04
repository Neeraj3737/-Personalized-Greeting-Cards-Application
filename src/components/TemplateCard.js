import React, { useEffect, useRef, useState } from 'react';
import './TemplateCard.css';

const drawPreview = (canvas, template, userName, avatarDataUrl) => {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Background
  const colors = template.gradient.match(/#[0-9a-fA-F]{3,6}/g) || ['#222831', '#222831', '#ffd369'];
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, colors[0] || '#222831');
  grad.addColorStop(0.5, colors[1] || '#222831');
  grad.addColorStop(1, colors[2] || '#ffd369');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle dots overlay
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = template.accentColor;
  for (let i = 0; i < 12; i++) {
    const x = ((i * 37 + 11) % W);
    const y = ((i * 53 + 17) % H);
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Emoji
  ctx.font = `${H * 0.28}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText(template.emoji, W / 2, H * 0.38);

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${H * 0.1}px Playfair Display, Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.fillText(userName || 'Your Name', W / 2, H * 0.58);

  // Message (truncated)
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = `${H * 0.07}px DM Sans, sans-serif`;
  const msg = template.message.length > 24 ? template.message.slice(0, 24) + '…' : template.message;
  ctx.fillText(msg, W / 2, H * 0.72);

  // Draw avatar if available
  if (avatarDataUrl) {
    const img = new Image();
    img.onload = () => {
      const r = H * 0.12;
      const ax = W / 2 - r;
      const ay = H * 0.76;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, ay + r, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, ax, ay, r * 2, r * 2);
      ctx.restore();
    };
    img.src = avatarDataUrl;
  }
};

const TemplateCard = ({ template, user, onClick, index }) => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawPreview(canvas, template, user?.name, user?.avatar);
    setLoaded(true);
  }, [template, user?.name, user?.avatar]);

  return (
    <div
      className="template-card animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}
    >
      <div className="template-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className={`template-canvas ${loaded ? 'loaded' : ''}`}
        />
        {/* Status badge */}
        <div className={`template-badge tag ${template.isPremium ? 'tag-premium' : 'tag-free'}`}>
          {template.isPremium ? '⭐ Premium' : '✓ Free'}
        </div>
        {/* Hover overlay */}
        <div className="template-hover-overlay">
          <div className="hover-cta">
            {template.isPremium ? '⭐ Unlock' : '✦ Personalize'}
          </div>
        </div>
      </div>
      <div className="template-info">
        <span className="template-title">{template.title}</span>
        <span className="template-category">{template.emoji}</span>
      </div>
    </div>
  );
};

export default TemplateCard;
