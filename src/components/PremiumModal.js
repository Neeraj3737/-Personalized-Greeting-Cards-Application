import React from 'react';
import { useAuth } from '../context/AuthContext';
import './PremiumModal.css';

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '₹99',
    period: '/month',
    tag: null,
    desc: 'Billed every month',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '₹699',
    period: '/year',
    tag: '🔥 Best Value',
    desc: 'Save 41% vs monthly',
  },
];

const PERKS = [
  { icon: '🖼️', text: 'Unlock all 100+ premium templates' },
  { icon: '✨', text: 'No watermark on shared images' },
  { icon: '🎨', text: 'Advanced customization options' },
  { icon: '🚀', text: 'Priority new templates every week' },
  { icon: '📤', text: 'High-res export (2K quality)' },
];

const PremiumModal = ({ template, onClose }) => {
  const { upgradeToPremium } = useAuth();
  const [selected, setSelected] = React.useState('yearly');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    upgradeToPremium();
    setLoading(false);
    setSuccess(true);
    setTimeout(onClose, 1800);
  };

  if (success) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-box glass-card" onClick={e => e.stopPropagation()}>
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h2>You're Premium!</h2>
            <p>All templates are now unlocked. Enjoy crafting!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box glass-card animate-fade-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="modal-header">
          <div className="premium-crown">⭐</div>
          <h2>Unlock <em>Greeting App</em> Premium</h2>
          <p>Get full access to all templates including <strong>{template?.title}</strong></p>
        </div>

        {/* Perks */}
        <ul className="perks-list">
          {PERKS.map((p, i) => (
            <li key={i} className="perk-item">
              <span className="perk-icon">{p.icon}</span>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>

        {/* Plan Selector */}
        <div className="plan-selector">
          {PLANS.map(plan => (
            <button
              key={plan.id}
              className={`plan-card ${selected === plan.id ? 'selected' : ''}`}
              onClick={() => setSelected(plan.id)}
            >
              {plan.tag && <div className="plan-tag">{plan.tag}</div>}
              <div className="plan-name">{plan.label}</div>
              <div className="plan-price">
                {plan.price}<span>{plan.period}</span>
              </div>
              <div className="plan-desc">{plan.desc}</div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn btn-gold subscribe-btn"
          onClick={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <span className="loading-dots">Processing<span>...</span></span>
          ) : (
            <>⭐ Subscribe {PLANS.find(p => p.id === selected)?.price}</>
          )}
        </button>

        <p className="modal-fine-print">
          Cancel anytime. No hidden charges. Secure payment via Razorpay.
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;
