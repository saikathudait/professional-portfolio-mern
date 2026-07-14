import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FaviconUpdater from './components/FaviconUpdater';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsTracker from './components/AnalyticsTracker';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Education = lazy(() => import('./pages/Education'));
const Experience = lazy(() => import('./pages/Experience'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Books = lazy(() => import('./pages/Books'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const BooksTable = lazy(() => import('./pages/BooksTable'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogTable = lazy(() => import('./pages/BlogTable'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Resume = lazy(() => import('./pages/Resume'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageHome = lazy(() => import('./pages/admin/ManageHome'));
const ManageAbout = lazy(() => import('./pages/admin/ManageAbout'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageBlog = lazy(() => import('./pages/admin/ManageBlog'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageExperience = lazy(() => import('./pages/admin/ManageExperience'));
const ManageEducation = lazy(() => import('./pages/admin/ManageEducation'));
const ManageBooks = lazy(() => import('./pages/admin/ManageBooks'));
const ManageMessages = lazy(() => import('./pages/admin/ManageMessages'));
const ManageResume = lazy(() => import('./pages/admin/ManageResume'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const PublicLayout = () => (
  <>
    <Navbar />
    <main className="public-main">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <AnalyticsTracker />
          <FaviconUpdater />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--surface-strong)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--card-shadow)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: 'var(--accent-2)',
                  secondary: 'var(--surface-strong)',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'var(--surface-strong)',
                },
              },
            }}
          />

          <Suspense fallback={<Loading fullScreen />}>
            <Routes>
              <Route element={<PublicLayout />}>
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
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />

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
                <Route
                  path="*"
                  element={
                    <NotFound
                      title="Admin Page Not Found"
                      message="The admin page you requested does not exist."
                      linkTo="/admin"
                      linkLabel="Back to Dashboard"
                    />
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
