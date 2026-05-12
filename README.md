# BlogTech

BlogTech is a modern full-stack blog application built with React, Node.js, Express, and MongoDB.  
The project was designed as a professional blogging platform with AI-powered multilingual support, newsletter integration, and a clean responsive interface.

The application allows users to browse blog posts, read articles, manage content, and dynamically switch between multiple languages using an AI translation system powered by Hugging Face models.

---

# 🚀 Features

## 🌍 AI-Powered Multilingual System
- Dynamic translation generation using Hugging Face AI models
- Automatic creation of language JSON files
- Translation caching using localStorage
- i18next integration for global app translation
- Lazy loading of translations
- Persistent language selection
- Translation synchronization system from the default `en.json`
- Automatic fallback to English

## 📰 Blog Features
- Create blog posts
- Read full blog articles
- Display latest blogs
- Delete blog posts
- Responsive blog cards layout
- Dynamic routing with React Router

## 📧 Newsletter Integration
- Newsletter subscription system
- Brevo integration for email management
- Unsubscribe functionality

## 🎨 Frontend Features
- Responsive modern UI
- Global language selector
- Translation loading overlay
- React Hooks architecture
- Component-based structure
- Smooth navigation and scroll restoration

## ⚙️ Backend Features
- REST API architecture
- Modular controller/service/routes structure
- Dynamic translation file generation
- AI translation services
- Retry mechanism for translation failures
- Batch translation processing
- File synchronization utilities

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router
- i18next
- React-i18next
- CSS3
- Redux

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## AI & Translation
- Hugging Face Inference API
- Helsinki-NLP Translation Models

## Email Service
- Brevo API



---

# 📂 Project Structure

## Backend

```bash
server/
│
├── controllers/
├── routes/
├── services/
├── translations/
├── scripts/
└── server.js

```

# 📦 Installation

## 1️⃣ Clone the repository

```bash
git clone https://github.com/oussamachaouch/blog-backend.git
cd blog-backend
```

## 2️⃣ Install dependencies

```bash
npm install
```

## ▶️ Running the Project

```bash
npm start
```