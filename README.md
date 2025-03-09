# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and built using React with TypeScript, styled with Tailwind CSS, and uses Zustand for state management.


## Technology Stack

React: Used for building the user interface components
TypeScript: For static typing and improved code quality
Tailwind CSS: For styling components with utility classes
Zustand: For state management (replacing Redux)
Socket.io-client: For real-time communication
React Router: For application routing
Axios: For HTTP requests to the backend API
Headless UI: For accessible UI components

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/prajwalsm17/chat-application.git
   cd chat-application
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the TypeScript files:
   ```
   npm run build
   ```

4. Start the development server:
   ```
   npm run start

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Project Structure
Copysrc/
├── assets/             # Static assets like images
├── components/         # Reusable UI components
│   ├── auth/           # Authentication-related components
│   ├── chat/           # Chat-related components
│   ├── shared/         # Shared utility components
│   └── layout/         # Layout components
├── pages/              # Page components that correspond to routes
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
├── services/           # API services
├── utils/              # Utility functions
└── App.tsx             # Root component

Key Components
Authentication Components
•	Login.tsx: Login form with email and password authentication
•	Register.tsx: Registration form for new users
Chat Components
•	UserList.tsx: Displays a list of available users with their status
•	ChatWindow.tsx: Main chat interface showing messages between users
•	StatusSelector.tsx: Allows users to change their availability status
Pages
•	Login.tsx: Login page
•	Register.tsx: Registration page
•	Chat.tsx: Main chat page that includes UserList and ChatWindow

State Management
The application uses Zustand for state management, with three main stores:

authStore.ts 
•	Manages user authentication state
•	Handles login/logout operations
•	Tracks the current user's information and status
userStore.ts
•	Manages the list of users
•	Tracks the currently selected user for chatting
•	Handles user status updates
chatStore.ts
•	Manages messages between users
•	Handles sending and receiving messages
•	Tracks read/unread status of messages
•	Manages message replies



