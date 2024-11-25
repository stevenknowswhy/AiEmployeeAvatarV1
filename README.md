# React Firebase Authentication

A modern React application with Firebase Authentication, featuring a beautiful UI built with Tailwind CSS.

## Features

- Email/Password Authentication
- Protected Routes
- Modern UI with Tailwind CSS
- Responsive Design
- Profile Page
- Loading States

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)

4. Copy your Firebase configuration and update the `.env` file with your credentials:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/         # Reusable components
  │   ├── ui/            # UI components
  │   └── SignUpForm.jsx # Authentication form
  ├── pages/             # Page components
  │   └── Profile.jsx    # Protected profile page
  ├── firebase/          # Firebase configuration
  │   └── firebase.js    # Firebase setup
  ├── App.jsx           # Main application component
  └── index.css         # Global styles
```

## Technologies Used

- React
- Firebase Authentication
- React Router DOM
- Tailwind CSS
- Vite
- Lucide React Icons
