import React from 'react';
// We import React Router tools to handle multiple pages (URLs) in our Single Page Application
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import our contexts which hold our global state (User Data and Dark Mode)
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import standard layout pieces that show on every page
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';

// Import all our individual pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import CreateJob from './pages/CreateJob';
import ManageJobs from './pages/ManageJobs';

// Import our custom security guards. These stop guests from seeing private pages.
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    // 1. ThemeProvider gives dark mode styling to the whole app
    <ThemeProvider>
      {/* 2. AuthProvider tracks who is logged in and gives that data to all pages */}
      <AuthProvider>
        {/* 3. Router tells React to watch the URL bar and change pages accordingly */}
        <Router>
          {/* A wrapper that applies our background colors and handles flexbox layout so the footer stays at the bottom */}
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-300">
            
            {/* The Navigation bar always shows at the top */}
            <Navbar />
            
            {/* The main content area where our pages will render */}
            <main className="flex-grow">
              <Routes>
                
                {/* ── PUBLIC PAGES ── 
                    Anyone can visit these pages, even if they aren't logged in. 
                */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/jobs" element={<JobSearch />} />
                
                {/* Notice the ":id". This is a dynamic route for a specific job (e.g., /jobs/123) */}
                <Route path="/jobs/:id" element={<JobDetail />} />

                {/* ── JOB SEEKER PAGES ── 
                    Notice how we wrap the page inside <ProtectedRoute> and <RoleRoute>.
                    This means: You MUST be logged in AND you MUST be a JOBSEEKER to see this.
                */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="JOBSEEKER">
                      <CandidateDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                } />
                <Route path="/saved-jobs" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="JOBSEEKER">
                      <SavedJobs />
                    </RoleRoute>
                  </ProtectedRoute>
                } />

                {/* ── SHARED SECURE PAGES ── 
                    Both Employers and Job Seekers can view these, as long as they are logged in.
                */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/applications" element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                } />

                {/* ── EMPLOYER PAGES ── 
                    You MUST be logged in AND be an EMPLOYER to see these pages.
                */}
                <Route path="/employer/dashboard" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="EMPLOYER">
                      <EmployerDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                } />
                <Route path="/employer/jobs" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="EMPLOYER">
                      <ManageJobs />
                    </RoleRoute>
                  </ProtectedRoute>
                } />
                <Route path="/employer/create-job" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="EMPLOYER">
                      <CreateJob />
                    </RoleRoute>
                  </ProtectedRoute>
                } />
                <Route path="/employer/edit-job/:id" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="EMPLOYER">
                      <CreateJob />
                    </RoleRoute>
                  </ProtectedRoute>
                } />
                <Route path="/employer/profile" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="EMPLOYER">
                      <Profile />
                    </RoleRoute>
                  </ProtectedRoute>
                } />
                <Route path="/employer/applicants" element={
                  <ProtectedRoute>
                    <RoleRoute allowedRole="EMPLOYER">
                      <Applications />
                    </RoleRoute>
                  </ProtectedRoute>
                } />
              </Routes>
            </main>

            {/* The Footer always shows at the bottom */}
            <Footer />
            
            {/* ToastContainer renders the small popup notifications across the app */}
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
