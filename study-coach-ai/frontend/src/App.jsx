import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
          />
          <Route
            path="/subjects"
            element={<ProtectedRoute><Layout><Subjects /></Layout></ProtectedRoute>}
          />
          <Route
            path="/topics"
            element={<ProtectedRoute><Layout><Topics /></Layout></ProtectedRoute>}
          />
          <Route
            path="/topics/:topicId"
            element={<ProtectedRoute><Layout><TopicDetail /></Layout></ProtectedRoute>}
          />
          <Route
            path="/study-plans"
            element={<ProtectedRoute><Layout><StudyPlans /></Layout></ProtectedRoute>}
          />
          <Route
            path="/quizzes"
            element={<ProtectedRoute><Layout><Quizzes /></Layout></ProtectedRoute>}
          />
          <Route
            path="/quiz-results"
            element={<ProtectedRoute><Layout><QuizResults /></Layout></ProtectedRoute>}
          />
          <Route
            path="/resources"
            element={<ProtectedRoute><Layout><Resources /></Layout></ProtectedRoute>}
          />
          <Route
            path="/resources/:id"
            element={<ProtectedRoute><Layout><ResourceDetail /></Layout></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>}
          />
          <Route
            path="/smart-lecture"
            element={<ProtectedRoute><Layout><SmartLecture /></Layout></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
