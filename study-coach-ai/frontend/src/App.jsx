import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Topics from './pages/Topics';
import StudyPlans from './pages/StudyPlans';
import Quizzes from './pages/Quizzes';
import QuizResults from './pages/QuizResults';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import SmartLecture from './pages/SmartLecture';
import TopicDetail from './pages/TopicDetail';
import ResourceDetail from './pages/ResourceDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminStudentDetail from './pages/admin/AdminStudentDetail';
import AdminResources from './pages/admin/AdminResources';
import AdminResourceForm from './pages/admin/AdminResourceForm';

const Layout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">{children}</main>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><Layout><Subjects /></Layout></ProtectedRoute>} />
          <Route path="/topics" element={<ProtectedRoute><Layout><Topics /></Layout></ProtectedRoute>} />
          <Route path="/topics/:topicId" element={<ProtectedRoute><Layout><TopicDetail /></Layout></ProtectedRoute>} />
          <Route path="/study-plans" element={<ProtectedRoute><Layout><StudyPlans /></Layout></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><Layout><Quizzes /></Layout></ProtectedRoute>} />
          <Route path="/quiz-results" element={<ProtectedRoute><Layout><QuizResults /></Layout></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Layout><Resources /></Layout></ProtectedRoute>} />
          <Route path="/resources/:id" element={<ProtectedRoute><Layout><ResourceDetail /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/smart-lecture" element={<ProtectedRoute><Layout><SmartLecture /></Layout></ProtectedRoute>} />

          {/* Admin routes — redirect /admin to /admin/dashboard */}
          <Route path="/admin" element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><AdminLayout><AdminStudents /></AdminLayout></AdminRoute>} />
          <Route path="/admin/students/:id" element={<AdminRoute><AdminLayout><AdminStudentDetail /></AdminLayout></AdminRoute>} />
          <Route path="/admin/resources" element={<AdminRoute><AdminLayout><AdminResources /></AdminLayout></AdminRoute>} />
          <Route path="/admin/resources/new" element={<AdminRoute><AdminLayout><AdminResourceForm /></AdminLayout></AdminRoute>} />
          <Route path="/admin/resources/:id/edit" element={<AdminRoute><AdminLayout><AdminResourceForm /></AdminLayout></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
