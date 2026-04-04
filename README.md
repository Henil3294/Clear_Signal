# 🛰️ Clear Signal — AI News Verification Platform

> **Verify. Break through the noise. Stay informed.**

Clear Signal is a powerful, AI-driven platform designed to protect users from the growing spread of misinformation. By leveraging **Gemini 1.5 Flash** and real-time evidence gathering, we provide users with a clean, transparent, and evidence-backed way to check if the news they are reading is true, misleading, or a complete fabrication.

![License](https://img.shields.io/badge/License-MIT-cyan)
![Node](https://img.shields.io/badge/Node-18+-purple)
![Angular](https://img.shields.io/badge/Angular-18+-cyan)

---

## ✨ Key Features

*   **🔍 One-Click Verification**: Simply paste a news article or headline to start a deep analytical scan.
*   **📡 Real-Time Evidence**: We search **Google**, **NewsAPI**, and **Wikipedia** in parallel to find corroborating or contradicting facts.
*   **⚖️ Multivariable Grading**: Each report includes a credibility score, bias detection, and manipulation flags.
*   **📰 In-Depth Reports**: Get a professional-grade article explaining exactly *why* a claim is verified or misleading.
*   **💾 Analysis History**: Keep track of your past investigations in a sleek, holographic dashboard.

---

## 🛠️ Tech Stack

*   **Frontend**: Angular 18+, SCSS, RxJS (Cyberpunk/Holographic UI)
*   **Backend**: Node.js, Express.js
*   **AI Engine**: Google Gemini 1.5 Flash
*   **Database**: MongoDB
*   **External APIs**: Google Custom Search, NewsAPI, Wikipedia

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (Local or Atlas)

### 2. Installation & Setup

#### **Backend**
1.  Navigate to `/backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add your keys:
    ```env
    PORT=5000
    MONGO_URI=<your_mongodb_uri>
    JWT_SECRET=<your_secret>
    GEMINI_API_KEY=<your_gemini_key>
    GOOGLE_API_KEY=<your_google_search_key>
    GOOGLE_CX=<your_cx_id>
    NEWS_API_KEY=<your_news_api_key>
    ```
4.  Start the server: `node server.js`

#### **Frontend**
1.  Navigate to `/frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run start`
4.  Open `http://localhost:4200` in your browser.

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

> **Note**: This project was built to help everyday users identify misleading information and is not intended for official forensic or legal testimony.
