# 🌿 EverNear – Community Events & Volunteering Platform

**EverNear** is a community-driven platform that brings people together through volunteering, social activities, and local events. It helps users discover upcoming events, participate in meaningful activities, and stay connected with their communities.

## ✨ Features

- **User Authentication:** Register and sign in using email/password or Google authentication.
- **Explore Events:** Browse upcoming and completed community events.
- **Join Events:** Register for events that interest you.
- **Event Reminders:** Save reminders for upcoming events.
- **User Profile:** View your account information and profile picture.
- **Manage Events:** Manage event information and registrations.
- **Community Stories:** Explore memories and highlights from previous events.
- **Responsive Design:** Enjoy the platform on desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React
- Better Auth

### Backend
- Node.js
- Express.js
- MongoDB
- Better Auth integration

### Authentication & Deployment
- Google OAuth 2.0
- Vercel

## 📁 Project Structure

```text
EverNear/
│
├── evernear_client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.local
│   └── package.json
│
└── EverNear_server/
    ├── index.js
    ├── .env
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd EverNear
```

### 2. Setup Frontend

Navigate to the frontend folder:

```bash
cd evernear_client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will run at:

`http://localhost:3000`

### 3. Setup Backend

Open another terminal and navigate to the backend folder:

```bash
cd EverNear_server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8000
```

Start the backend:

```bash
npm run dev
```

Backend will run at:

`http://localhost:8000`

## 🔐 Authentication

EverNear uses Better Auth for authentication.

Supported authentication methods:

- Email and password
- Google OAuth 2.0

Google OAuth requires a configured Google Cloud project with the appropriate OAuth Client ID, Client Secret, and authorized redirect URI.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | Fetch events |
| GET | `/events/:id` | Fetch event details |
| POST | `/events/join` | Register for an event |
| POST | `/events/remind` | Save an event reminder |

The events endpoint supports filtering:

```text
/events?status=upcoming
/events?status=completed
```

## 🌐 Deployment

The application can be deployed using Vercel.

- **Frontend:** Deploy the Next.js application.
- **Backend:** Deploy the Express.js API.
- **Database:** Use MongoDB Atlas or another accessible MongoDB deployment.

Remember to configure the required environment variables in your deployment settings.

## 🎯 Links
GITHUB Client side :https://github.com/humayra-yeasmin-star8/EverNear_Client
GITHUB Server side:https://github.com/humayra-yeasmin-star8/EverNear_Server
LIVE LINK:https://ever-near-client.vercel.app



**Small actions can create meaningful changes. Let's make a difference together! 🌱**

---

**Developed with ❤️ for building stronger communities.**
