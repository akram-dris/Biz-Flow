# Biz-Flow

A modern full-stack business flow management application built with React (Vite) and NestJS.

## 🏗️ Project Structure

```
Biz-Flow/
├── frontend/          # React + Vite + TypeScript
├── backend/           # NestJS + TypeScript
└── README.md
```

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Express** - HTTP server

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

### Development

Run both services concurrently:

**Frontend** (Port 5173)
```bash
cd frontend
npm run dev
```

**Backend** (Port 3000)
```bash
cd backend
npm run start:dev
```

### Production Build

**Frontend**
```bash
cd frontend
npm run build
```

**Backend**
```bash
cd backend
npm run build
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run start:dev` - Start in development mode with watch
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run tests

## 📝 License

MIT
