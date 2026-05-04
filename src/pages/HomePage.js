import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TEMPLATES, CATEGORIES } from '../utils/templates';
import TemplateCard from '../components/TemplateCard';
import PremiumModal from '../components/PremiumModal';
import PersonalizeModal from '../components/PersonalizeModal';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [premiumTemplate, setPremiumTemplate] = useState(null);
  const [personalizeTemplate, setPersonalizeTemplate] = useState(null);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const handleTemplateClick = (template) => {
    if (template.isPremium && !user?.isPremium) {
      setPremiumTemplate(template);
    } else {
      setPersonalizeTemplate(template);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="home-root">
      <div className="app-bg" />

      {/* NAV */}
      <nav className="home-nav">
        <div className="nav-brand">
          <span className="nav-logo">✦</span>
          <span className="nav-title">Greeting App</span>
        </div>
        <div className="nav-right">
          {user?.isPremium && (
            <div className="tag tag-premium">⭐ Premium</div>
          )}
          <div className="nav-user-menu">
            <div className="nav-avatar" onClick={() => navigate('/setup')}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} />
                : <span>{user?.name?.[0]?.toUpperCase() || '?'}</span>
              }
            </div>
            <div className="nav-user-info">
              <span className="nav-user-name">{user?.name}</span>
              <button className="nav-logout" onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="home-hero animate-fade-up">
        <div className="hero-greeting">
          Good day, <em>{user?.name?.split(' ')[0] || 'Friend'}</em> ✦
        </div>
        <h1 className="hero-headline">
          Craft a greeting<br />that truly <em>matters</em>
        </h1>
        <p className="hero-sub">
          {TEMPLATES.length} beautiful templates · Personalized with your photo & name
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="home-controls animate-fade-up delay-2">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="category-chips">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div className="stats-bar animate-fade-up delay-3">
        <span>{filteredTemplates.length} templates</span>
        <span>·</span>
        <span>{filteredTemplates.filter(t => !t.isPremium).length} free</span>
        <span>·</span>
        <span>{filteredTemplates.filter(t => t.isPremium).length} premium</span>
      </div>

      {/* GRID */}
      <div className="templates-grid">
        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🔍</div>
            <p>No templates found for "{search}"</p>
            <button className="btn btn-ghost" onClick={() => setSearch('')}>Clear search</button>
          </div>
        ) : (
          filteredTemplates.map((template, i) => (
            <TemplateCard
              key={template.id}
              template={template}
              user={user}
              index={i}
              onClick={() => handleTemplateClick(template)}
            />
          ))
        )}
      </div>

      {/* PREMIUM UPSELL BANNER (if not premium) */}
      {!user?.isPremium && (
        <div className="upsell-banner glass-card animate-fade-up">
          <div className="upsell-left">
            <div className="upsell-crown">⭐</div>
            <div>
              <h3>Unlock All {TEMPLATES.filter(t => t.isPremium).length} Premium Templates</h3>
              <p>Get unlimited access to exclusive designs, high-res export & more</p>
            </div>
          </div>
          <button
            className="btn btn-gold"
            onClick={() => setPremiumTemplate({ title: 'All Premium Templates' })}
          >
            Go Premium
          </button>
        </div>
      )}

      {/* MODALS */}
      {premiumTemplate && (
        <PremiumModal
          template={premiumTemplate}
          onClose={() => setPremiumTemplate(null)}
        />
      )}
      {personalizeTemplate && (
        <PersonalizeModal
          template={personalizeTemplate}
          user={user}
          onClose={() => setPersonalizeTemplate(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
