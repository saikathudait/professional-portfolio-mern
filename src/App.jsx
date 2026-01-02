import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FaviconUpdater from './components/FaviconUpdater';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Education from './pages/Education';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import BooksTable from './pages/BooksTable';
import Blog from './pages/Blog';
import BlogTable from './pages/BlogTable';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Resume from './pages/Resume';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageHome from './pages/admin/ManageHome';
import ManageAbout from './pages/admin/ManageAbout';
import ManageProjects from './pages/admin/ManageProjects';
import ManageBlog from './pages/admin/ManageBlog';
import ManageSkills from './pages/admin/ManageSkills';
import ManageExperience from './pages/admin/ManageExperience';
import ManageEducation from './pages/admin/ManageEducation';
import ManageBooks from './pages/admin/ManageBooks';
import ManageMessages from './pages/admin/ManageMessages';
import ManageResume from './pages/admin/ManageResume';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <FaviconUpdater />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#00ffff',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ff4b4b',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/books/all" element={<BooksTable />} />
                    <Route path="/books/:id" element={<BookDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/all" element={<BlogTable />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/resume" element={<Resume />} />
                  </Routes>
                  <Footer />
                </>
              }
            />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="home" element={<ManageHome />} />
              <Route path="about" element={<ManageAbout />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="blog" element={<ManageBlog />} />
              <Route path="skills" element={<ManageSkills />} />
              <Route path="experience" element={<ManageExperience />} />
              <Route path="education" element={<ManageEducation />} />
              <Route path="books" element={<ManageBooks />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="cv" element={<ManageResume />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
