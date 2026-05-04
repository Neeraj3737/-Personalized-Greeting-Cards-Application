/**
 * Image Composer Utility
 * Handles merging of template background, user photo overlay, and text into a single image.
 * Uses HTML5 Canvas API for pixel-level compositing.
 */

/**
 * Draws a rounded rectangle path on a canvas context.
 */
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

/**
 * Draws background gradient based on template config.
 */
const drawBackground = (ctx, template, W, H) => {
  // Parse gradient stops from CSS gradient string
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, extractGradientColor(template.gradient, 0));
  grad.addColorStop(0.5, extractGradientColor(template.gradient, 1));
  grad.addColorStop(1, extractGradientColor(template.gradient, 2));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
};

const extractGradientColor = (gradientStr, index) => {
  const matches = gradientStr.match(/#[0-9a-fA-F]{3,6}/g);
  if (matches && matches[index] !== undefined) return matches[index];
  return index === 0 ? '#1a0533' : index === 1 ? '#3d1a6e' : '#7b2fff';
};

/**
 * Draws decorative pattern overlay based on template pattern type.
 */
const drawPattern = (ctx, pattern, accentColor, W, H) => {
  ctx.save();
  ctx.globalAlpha = 0.12;

  if (pattern === 'stars' || pattern === 'moon') {
    ctx.fillStyle = accentColor;
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'hearts') {
    ctx.font = '20px serif';
    ctx.fillStyle = accentColor;
    for (let i = 0; i < 15; i++) {
      ctx.globalAlpha = 0.08 + Math.random() * 0.08;
      ctx.fillText('♥', Math.random() * W, Math.random() * H);
    }
  } else if (pattern === 'confetti') {
    const colors = [accentColor, '#ff6b6b', '#00d4aa', '#ff6bef'];
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.15;
      ctx.save();
      ctx.translate(Math.random() * W, Math.random() * H);
      ctx.rotate(Math.random() * Math.PI);
      ctx.fillRect(-4, -2, 8, 4);
      ctx.restore();
    }
  } else if (pattern === 'geometric') {
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 8; i++) {
      const cx = Math.random() * W;
      const cy = Math.random() * H;
      const r = 20 + Math.random() * 60;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    // Default circles
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 6; i++) {
      const cx = (i % 3) * (W / 2.5) + W * 0.1;
      const cy = Math.floor(i / 3) * (H / 1.5) + H * 0.1;
      const r = 40 + i * 20;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
};

/**
 * Draws the user avatar as a circular clipped image.
 */
const drawAvatar = (ctx, avatarImg, avatarDataUrl, x, y, diameter, accentColor) => {
  return new Promise((resolve) => {
    const drawCircle = (img) => {
      const r = diameter / 2;
      ctx.save();

      // Glow ring
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + r, y + r, r + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // White border
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Clip to circle
      ctx.beginPath();
      ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
      ctx.clip();

      if (img) {
        ctx.drawImage(img, x, y, diameter, diameter);
      } else {
        // Placeholder gradient avatar
        const grad = ctx.createLinearGradient(x, y, x + diameter, y + diameter);
        grad.addColorStop(0, accentColor);
        grad.addColorStop(1, '#3d1a6e');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, diameter, diameter);

        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `bold ${diameter * 0.4}px DM Sans, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', x + r, y + r);
      }

      ctx.restore();
      resolve();
    };

    if (avatarDataUrl) {
      const img = new Image();
      img.onload = () => drawCircle(img);
      img.onerror = () => drawCircle(null);
      img.src = avatarDataUrl;
    } else {
      drawCircle(null);
    }
  });
};

/**
 * Draws text with a semi-transparent pill background.
 */
const drawTextOverlay = (ctx, name, message, emoji, W, H, accentColor, position) => {
  const padding = 24;
  const boxW = W - padding * 2;
  const boxH = position === 'center' ? H * 0.25 : H * 0.2;
  const boxX = padding;
  let boxY;

  if (position === 'top') boxY = padding;
  else if (position === 'center') boxY = (H - boxH) / 2;
  else boxY = H - boxH - padding; // bottom

  // Frosted glass background
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = 'rgba(10, 4, 26, 0.85)';
  roundRect(ctx, boxX, boxY, boxW, boxH, 16);
  ctx.fill();

  // Accent top border
  ctx.globalAlpha = 1;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  roundRect(ctx, boxX, boxY, boxW, boxH, 16);
  ctx.stroke();

  // Emoji
  ctx.font = `${boxH * 0.55}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText(emoji, W / 2, boxY + boxH * 0.38);

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.min(boxH * 0.3, 32)}px Playfair Display, Georgia, serif`;
  ctx.fillText(name, W / 2, boxY + boxH * 0.62);

  // Message
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `${Math.min(boxH * 0.22, 18)}px DM Sans, sans-serif`;
  ctx.fillText(message, W / 2, boxY + boxH * 0.82);

  ctx.restore();
};

/**
 * Main composer function.
 * Returns a Promise<string> resolving to a base64 PNG data URL of the merged image.
 *
 * @param {Object} template - Template config object
 * @param {string} userName - Display name
 * @param {string|null} avatarDataUrl - Base64 avatar image or null
 * @param {number} width - Output width in px (default 800)
 * @param {number} height - Output height in px (default 800)
 */
export const composeGreetingImage = async ({
  template,
  userName,
  avatarDataUrl,
  width = 800,
  height = 800,
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Seed random to be deterministic per template
  const origRandom = Math.random;
  let seed = template.id.charCodeAt(0) * 7 + template.id.charCodeAt(1) * 13;
  Math.random = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // 1. Draw background gradient
  drawBackground(ctx, template, width, height);

  // 2. Draw decorative pattern
  drawPattern(ctx, template.pattern, template.accentColor, width, height);

  // 3. Draw avatar (centered horizontally, upper-middle area)
  const avatarSize = 250;
  const avatarX = (width - avatarSize) / 2;
  const textPos = template.textPosition;
  const avatarY = textPos === 'bottom'
    ? height * 0.15
    : textPos === 'top'
    ? height * 0.55
    : height * 0.08;

  await drawAvatar(ctx, null, avatarDataUrl, avatarX, avatarY, avatarSize, template.accentColor);

  // 4. Draw text overlay
  drawTextOverlay(
    ctx,
    userName,
    template.message,
    template.emoji,
    width,
    height,
    template.accentColor,
    textPos
  );

  // Restore random
  Math.random = origRandom;

  return canvas.toDataURL('image/png');
};

/**
 * Triggers a file download of the composed image.
 */
export const downloadImage = (dataUrl, filename = 'greeting-greeting.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Converts a canvas data URL to a Blob for native sharing.
 */
export const dataUrlToBlob = async (dataUrl) => {
  const res = await fetch(dataUrl);
  return res.blob();
};

/**
 * Shares the composed image using Web Share API if available.
 * Falls back to download if not supported.
 */
export const shareImage = async (dataUrl, template) => {
  const blob = await dataUrlToBlob(dataUrl);
  const file = new File([blob], 'greeting-greeting.png', { type: 'image/png' });
  const shareData = {
    title: `Greeting App – ${template.title}`,
    text: template.message,
    files: [file],
  };

  if (navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { method: 'native', success: true };
    } catch (err) {
      if (err.name !== 'AbortError') {
        downloadImage(dataUrl, `greeting-${template.id}.png`);
        return { method: 'download', success: true };
      }
      return { method: 'cancelled', success: false };
    }
  } else {
    downloadImage(dataUrl, `greeting-${template.id}.png`);
    return { method: 'download', success: true };
  }
};
