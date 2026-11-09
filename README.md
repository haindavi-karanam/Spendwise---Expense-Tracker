# 💰 SpendWise — Expense Tracker

SpendWise is a full-stack expense tracking application that helps users manage their personal finances. Users can securely track their income and expenses, monitor their current balance, manage transactions, and scan receipts using OCR technology.

## 🚀 Live Demo

🌐 **Frontend:** [Add your Vercel URL here]

⚙️ **Backend API:** [Add your Render URL here]

---

## ✨ Features

- 🔐 **User Authentication** — Secure user registration and login using JWT.
- 📊 **Dashboard** — View total balance, total income, and total expenses.
- 💰 **Transaction Management** — Add, view, edit, and delete income and expense transactions.
- 🧾 **Receipt Scanner** — Upload receipt images and extract useful information using Tesseract.js OCR.
- 📅 **Transaction Tracking** — Organize transactions by category and date.
- 🌙 **Modern Dark UI** — Clean and responsive interface with an orange accent theme.
- ☁️ **Cloud Deployment** — Frontend and backend deployed separately for a production-ready architecture.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Tesseract.js

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 📂 Project Structure

```text
Spendwise/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── uploads/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Spendwise
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal and run:

```bash
cd backend
npm install
```

---

## 🔐 Environment Variables

### Backend

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

### Frontend

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to your deployed backend API URL.

---

## ▶️ Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login a user |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expense` | Get user transactions |
| POST | `/api/expense` | Create a transaction |
| PUT | `/api/expense/:id` | Update a transaction |
| DELETE | `/api/expense/:id` | Delete a transaction |

### Receipt Scanner

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/receipts/scan` | Scan a receipt using OCR |

---

## 🧾 Receipt Scanning

SpendWise uses **Tesseract.js** to extract text from uploaded receipt images.

The application attempts to identify useful receipt information such as:

- Store name
- Total amount
- Date

Receipt images are temporarily processed by the backend before the extracted information is returned to the user.

---


## 🎯 Future Improvements

- Add expense charts and analytics.
- Add filtering and sorting for transactions.
- Support more receipt formats.
- Add budget and savings goals.
- Add profile management.
- Improve OCR accuracy using AI-based receipt processing.

---

## 👩‍💻 Author

**Haindavi Karanam**

---

⭐ If you found this project useful, consider giving it a star!