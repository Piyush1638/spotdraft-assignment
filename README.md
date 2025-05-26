# PDF Collaboration App

## Overview

This is a modern web application that enables users to **upload, manage, and collaborate on PDF documents seamlessly**. Designed for teams and individuals alike, the app offers an intuitive interface for **sharing PDFs, commenting, and real-time collaboration** — making document workflows faster and more productive.

---

## Tech Stack

### Frontend

- **Next.js 13 (App Router)** — React framework for server-side rendering, routing, and optimized performance.
- **TypeScript** — Ensures type safety and maintainability.
- **Tailwind CSS** — Utility-first CSS framework for rapid styling and responsive design.
- **Lottie-react** — For engaging animated illustrations (e.g., PDF animation on the landing page).
- **React Context API** — For global state management of user data and authentication status.
- **React Hooks** — Used extensively for state and lifecycle management.

### Backend / API

- **Next.js API Routes** — Backend endpoints built directly in Next.js for handling user data, authentication, and PDF management.
- **MongoDB / Mongoose** — NoSQL database for storing user profiles, PDF metadata, and shared file references.
- **JWT Authentication** — Secure user sessions and API access control.
- **File Storage** — PDFs are stored either in the file system, cloud storage (e.g., AWS S3), or a dedicated file service, referenced in the database.

### DevOps / Deployment

- **Vercel** — Hosting platform for automatic deployment from GitHub, with serverless function support.
- **GitHub** — Source control and version management.
- **ESLint / Prettier** — Code quality and formatting tools.

---

## Key Features

- **User Authentication**: Secure signup/login with JWT tokens and protected API routes.
- **PDF Upload & Storage**: Users can upload PDFs, which are stored and referenced in the database.
- **File Sharing**: Share PDFs with other users by email or username, controlling access.
- **Collaboration**: Users can comment on PDFs and track changes (future feature).
- **Dashboard**: Personalized user dashboard showing owned and shared files.
- **Responsive Design**: Optimized UI for desktops, tablets, and mobile devices.
- **Animations & UX**: Smooth Lottie animations to enhance the experience.
- **Global User Context**: Context API stores logged-in user details accessible throughout the app.

---

## Architecture & Implementation

### All APIs used in this project : 
https://www.postman.com/piyushkumarsingh3669/my-workspace/collection/7h2o671/spotdraft

### 1. User Authentication

- Upon signup or login, the backend API authenticates users and returns a JWT token.
- The token is saved in cookies/local storage for subsequent API calls.
- `UserProvider` React Context fetches and stores user data globally on app load.
- User's email is verified by an email verification 

### 2. PDF Upload Flow

- Users select PDF files using an upload form.
- Frontend sends the file via `fetch` or `Axios` to an API route.
- Backend validates file type, size, and stores the PDF securely.
- PDF metadata (filename, owner, sharedWith array) is saved in MongoDB.

### 3. File Sharing & Collaboration

- Users can share PDFs with other registered users by adding their emails to a `sharedWith` array in the PDF document.
- Shared users see the file in their dashboard.
- Future extensions include adding comments and real-time collaboration features.

### 4. Frontend UI

- The landing page features an animated introduction with Lottie.
- The dashboard lists user-owned and shared PDFs with options to upload, open, and share.
- Responsive layout is achieved using Tailwind CSS flex/grid utilities.
- Components are reusable and maintainable, utilizing React hooks and context for state.

### 5. API Routes

- RESTful API endpoints handle user data (`/api/user`), PDF uploads (`/api/pdf/upload`), sharing (`/api/pdf/share`), and fetching files.
- Error handling and validation ensure robust and secure operations.

### 6. Deployment

- Connected GitHub repository with Vercel triggers automatic deployments on push.
- Environment variables (MongoDB URI, JWT secret, storage credentials) are configured securely in Vercel.
- Serverless functions power API routes, scaling automatically with user demand.

---

## How to Run Locally

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/pdf-collaboration-app.git
   cd pdf-collaboration-app

   ```

2. Install dependencies

   ```bash
   npm install
   #or
   pnpm install
   #or
   yarn install

   ```

3. Create a .env.local file in the root directory and add your environment variables:
   // Please use your own credientials
   MONGODB_URI = mongodb+srv://piyushkumarsingh:Piyush1638@cluster0.uxcwmmi.mongodb.net/
   JWT_SECRET = SpotDraft@Assignment
   NODE_ENV = development
   NEXT_PUBLIC_BASE_URL = http://localhost:3000

   # Related to SMTP

   SMTP_SERVER = smtp-relay.brevo.com
   SMTP_PORT = 587
   SMTP_USER = 8da044001@smtp-brevo.com
   SMTP_PASS = gkO6LHQ2VF4GfJ7p
   SMTP_FROM = piyushkumarsingh665@gmail.com

   # uploadthing

   UPLOADTHING_TOKEN='eyJhcGlLZXkiOiJza19saXZlXzBkMmQ2YWY4Mjg4ODViYjE5MjBlNjAzMWYyNGYzMzg4ZDA1M2I4Y2I2YmQxZDRmMjNmNWViYTRhMGU4NjM0NzciLCJhcHBJZCI6InY5a2U2YTBjamwiLCJyZWdpb25zIjpbInNlYTEiXX0='

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to http://localhost:3000 to see the app.

## Future Enhancements

1. PDF annotation tools (highlight, draw, comment)

2. Real-time collaborative editing with WebSocket or WebRTC

3. OAuth login options (Google, GitHub)

4. Offline mode and sync support

5. Versioning and change history for PDFs

