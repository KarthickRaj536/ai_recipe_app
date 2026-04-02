# 🍳 AI Recipe Platform

![AI Recipe Platform Banner](frontend/public/pasta-dish.png)

An intelligent web application designed to be your #1 AI Cooking Assistant. Turn your leftovers into masterpieces by simply snapping a photo of your fridge or pantry. Our AI recognizes your ingredients and generates delicious, gourmet recipes on the fly—helping you save money, reduce food waste, and eat better.

---

## 🌟 Key Features

*   **📸 Smart Pantry Scan:** Snap a photo of your fridge or pantry. Our AI automatically identifies ingredients using Google Gemini's vision capabilities.
*   **🤖 AI Chef Suggestions:** Instantly transforms random ingredients into structured, easy-to-follow recipes complete with prep times, instructions, and nutritional tips.
*   **🔍 Advanced Recipe Search:** Instantly search through thousands of recipes. Filter by cuisine, dietary needs, or time.
*   **📖 Digital Cookbook:** Save your favorite generated meals into your personal digital cookbook.
*   **📄 Export to PDF:** Easily download and export your favorite recipes as a PDF to share with family and friends or keep for offline viewing.
*   **🔒 Secure Authentication:** Seamless user login and management powered by Clerk.

---

## 🏗️ Architecture

The project is structured as a modern full-stack web application, decoupled into a distinct **Frontend** and **Backend** architecture.

### **Frontend (Next.js)**
The frontend is built with **Next.js (App Router)** and utilizes modern React 19. It acts as the primary user interface, handling:
*   User authentication states via Clerk.
*   Taking user image uploads (fridge photos) and communicating with Google Generative AI to parse ingredients and create recipes.
*   Presenting a highly responsive, modern UI built with **Tailwind CSS** and **Radix UI** primitives.
*   Generating PDFs on the client-side for recipe exports.
*   Route protection and bot mitigation using **Arcjet**.

### **Backend (Strapi CMS)**
The backend operates on **Strapi**, a powerful headless Node.js CMS, backed by a **PostgreSQL** database. 
*   It securely stores structured data for recipes (titles, ingredients, instructions, cuisines, categories, etc.).
*   Manages the relationships between users (authors) and their saved/created recipes.
*   Exposes secure REST APIs to the frontend for saving to the digital cookbook and fetching historical recipes.

---

## 🛠️ Tech Stack

### **Frontend Playground (`/frontend`)**
*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **UI Library:** [React 19](https://react.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Components:** [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Security & Rate Limiting:** [Arcjet](https://arcjet.com/)
*   **AI Integration:** `@google/generative-ai` (Google Gemini API)
*   **PDF Generation:** `@react-pdf/renderer`
*   **Icons:** [Lucide React](https://lucide.dev/)

### **Backend & Database (`/backend`)**
*   **Headless CMS:** [Strapi v5](https://strapi.io/)
*   **Runtime:** Node.js
*   **Database:** PostgreSQL (via `pg` driver)

---

## 🚀 Getting Started

To get the application running locally, you need to spin up both the backend and frontend servers.

### Prerequisites
*   Node.js (v20+ recommended)
*   PostgreSQL running locally or a cloud database URL.
*   API Keys: Clerk, Google Gemini, Arcjet.

### 1. Setup Backend (Strapi)
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
# Fill in your Database credentials and Strapi secrets in .env

# Run development server
npm run develop
```
The backend will be running at `http://localhost:1337`.

### 2. Setup Frontend (Next.js)
```bash
cd frontend
npm install

# Setup your environment variables
# You will need to provide your valid NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, GOOGLE_GEMINI_API_KEY, ARCJET_KEY, etc.

# Run development server
npm run dev
```
The frontend will be running at `http://localhost:3000`.


