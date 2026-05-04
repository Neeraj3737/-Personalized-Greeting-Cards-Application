# ✦ Personalized Greetings Application

> Design stunning custom greeting cards featuring your photo and name — share instantly with a single click.

![Personalized Greetings App](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Ready%20for%20Production-brightgreen)


---

## 🖼️ Key Capabilities

| Capability | Implementation Status |
|---|---|
| Authentication via Google / Email / Guest | ✅ |
| User profile configuration (name and photo) | ✅ |
| Collection of 17 themed templates | ✅ |
| Interactive canvas preview with personalization | ✅ |
| Differentiation between free and premium content | ✅ |
| Premium subscription prompt | ✅ |
| Canvas-based image merging | ✅ |
| Native sharing interface (Web Share API) | ✅ |
| Alternative sharing for WhatsApp / Email / Download | ✅ |
| Optimized for mobile and desktop | ✅ |

---

## 🚀 Getting Started

### System Requirements
- **Node.js** version 18 or later
- **npm** version 9 or later

### Setup Instructions

```bash
# 1. Download the project
git clone https://github.com/yourusername/personalized-greetings-app.git
cd personalized-greetings-app

# 2. Install required packages
npm install

# 3. Launch the development environment
npm start
```

The application will be accessible at **http://localhost:3000**

### Production Deployment

```bash
npm run build
```

The build files will be in the `/build` directory — ready for deployment on Vercel, Netlify, or Firebase Hosting.

---

## 📁 Code Organization

```
personalized-greetings-app/
├── public/
│   └── index.html                  # Main HTML template with font loading
├── src/
│   ├── context/
│   │   └── AuthContext.js          # Centralized authentication management
│   ├── pages/
│   │   ├── LoginPage.js / .css     # Authentication interface
│   │   ├── ProfileSetupPage.js/.css # User information setup
│   │   └── HomePage.js / .css      # Template selection dashboard
│   ├── components/
│   │   ├── TemplateCard.js/.css    # Compact canvas preview component
│   │   ├── PersonalizeModal.js/.css # Customization and sharing interface
│   │   ├── PremiumModal.js/.css    # Subscription encouragement
│   │   └── ProtectedRoute.js       # Route security component
│   ├── utils/
│   │   ├── templates.js            # Template specifications (17 designs)
│   │   └── imageComposer.js        # Canvas rendering system
│   ├── App.js                      # Application routing configuration
│   ├── index.js                    # React application entry point
│   └── index.css                   # Global styling framework
├── TECHNICAL_APPROACH.md           # Comprehensive technical details
├── package.json
└── README.md
```

---

## 🎨 User Experience Flow

```
/ (Authentication)
  ├── Google Sign-in ──┐
  ├── Email Sign-in ───┤──► /setup (Profile Configuration) ──► /home (Template Selection)
  ├── Registration ────┘
  └── Guest Access ───────────────────────────────► /home (Template Selection)
```

```
/home
  ├── Explore categories and search options
  ├── Select free template ──────────► PersonalizeModal
  │                                      ├── Modify name
  │                                      ├── Add photo
  │                                      ├── Real-time canvas display
  │                                      └── Share or download
  └── Select premium template ──────► PremiumModal (upgrade prompt)
                                         └── Subscribe ──► unlock everything
```

---

## 🛠️ Technology Framework

- **React 18** – User interface library
- **React Router v6** – Client-side navigation
- **Context API** – Authentication state management
- **HTML5 Canvas API** – Client-side image processing (no external libraries)
- **Web Share API** – Native mobile sharing functionality
- **Google Fonts** – Playfair Display, DM Sans, Cormorant Garamond
- **Vanilla CSS** – Custom design system using CSS variables

---

## 📄 Template Collection

| Theme | Number of Templates | Free | Premium |
|---|---|---|---|
| 🎂 Celebrations | 4 | 2 | 2 |
| 💕 Special Occasions | 3 | 2 | 1 |
| 🎉 Holiday Events | 4 | 2 | 2 |
| 🏆 Achievements | 2 | 1 | 1 |
| 🙏 Appreciation | 2 | 1 | 1 |
| ❤️ Romantic | 2 | 1 | 1 |

---

## 🔮 Development Roadmap

- [ ] Implement Firebase Authentication for Google OAuth
- [ ] Add Razorpay payment processing for subscriptions
- [ ] Create Firestore-based template management system
- [ ] Integrate AI for custom background generation
- [ ] Enable animated GIF creation
- [ ] Develop Progressive Web App features
- [ ] Support multiple languages

---

## 📝 Licensing

MIT © 2025 Personalized Greetings Application
