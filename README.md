Event Management and Ticketing Application
A modern, responsive React application built with Vite and Tailwind CSS for managing events, registering for them, and generating tickets.

Features
Event Discovery: Browse upcoming events on the home page.
User Authentication: Secure login system with protected routes.
Event Registration: Users can register for events and receive unique tickets.
Digital Tickets: View generated tickets (with QR code integration) for seamless event entry.
User Dashboard:
My Tickets: View and manage purchased tickets.
My Schedule: Keep track of registered events and schedules.
Admin Dashboard:
Create new events.
Edit existing events.
Manage event details.
Notifications: Toast notification system for user feedback.
Tech Stack
Frontend Framework: React 19
Build Tool: Vite
Routing: React Router DOM v7
Styling: Tailwind CSS
Icons: Lucide React
QR Code Generation: qrcode.react
State Management: React Context API (Auth & Notifications)
Other Utilities: UUID for unique identifiers
Getting Started
Prerequisites
Node.js (v18 or higher recommended)
npm or yarn
Installation
Clone the repository and navigate to the project folder: (CLONE THE "ui_ux" branch)

cd reactjs_sem2-main
Install dependencies:

npm install
Start the development server:

npm run dev
Open your browser and visit http://localhost:5173 (or the port provided in your terminal).

Scripts
npm run dev: Starts the Vite development server.
npm run build: Builds the app for production into the dist directory.
npm run lint: Runs ESLint to check for code quality and errors.
npm run preview: Previews the production build locally.
Project Structure
src/
├── components/      # Reusable UI components (Navbar, Toast, ProtectedRoute, etc.)
├── context/         # React Context providers (AuthContext, NotificationContext)
├── pages/           # Application views (Home, Login, Admin, EventDetails, etc.)
├── App.jsx          # Root component and application routing
├── index.css        # Global CSS and Tailwind directives
└── main.jsx         # React application entry point
About
No description, website, or topics provided.
Resources
 Readme
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Report repository
Releases
No releases published
Packages
No packages published
Contributors
2
@Aareen80085
Aareen80085 Aareen Dakway
@TanishRS
TanishRS 09tanish
Languages
JavaScript
99.0%
 
Other
1.0%
Footer
© 2026 GitHub, Inc.
Footer navigation
Terms
Privacy
