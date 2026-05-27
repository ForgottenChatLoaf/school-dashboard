import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PageWrapper from './components/layout/PageWrapper';
import StudentRecords from './pages/admin/StudentRecords';
import AttendanceLog from './pages/admin/AttendanceLog';
import Gradebook from './pages/admin/Gradebook';
import MyAttendance from './pages/student/MyAttendance';
import MyGrades from './pages/student/MyGrades';
import Playground from './pages/student/Playground';
import Settings from './pages/Settings';
import { StatCard } from './components/ui/StatCard';
import { Users, BookOpen, CheckCircle, TrendingUp, Clock, Award, Sparkles, GraduationCap, Zap } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import api from './services/api';
import { useState, useEffect } from 'react';

const AdminDashboard = () => (
  <PageWrapper title="Admin Dashboard">
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-surface to-surface border border-accent/20 relative overflow-hidden stagger-1">
      <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
      <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Welcome back</p>
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-1 flex items-center gap-2">Good {getGreeting()}, Admin <Sparkles className="w-6 h-6 text-accent" /></h2>
      <p className="text-text-muted text-sm">Here's what's happening in your school today.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="stagger-1"><StatCard title="Total Students" value="1,248" icon={Users} trend={{ isPositive: true, value: 4.2 }} /></div>
      <div className="stagger-2"><StatCard title="Active Classes" value="84" icon={BookOpen} /></div>
      <div className="stagger-3"><StatCard title="Attendance Rate" value="94.2%" icon={CheckCircle} trend={{ isPositive: false, value: 0.8 }} /></div>
    </div>
  </PageWrapper>
);

const TeacherDashboard = () => (
  <PageWrapper title="Teacher Dashboard">
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-surface to-surface border border-blue-500/20 relative overflow-hidden stagger-1">
      <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
      <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Teacher Portal</p>
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-1 flex items-center gap-2">Good {getGreeting()}, Teacher <BookOpen className="w-6 h-6 text-blue-400" /></h2>
      <p className="text-text-muted text-sm">You have classes scheduled today. Keep up the great work!</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="stagger-1"><StatCard title="My Classes" value="4" icon={BookOpen} /></div>
      <div className="stagger-2"><StatCard title="Total Students" value="128" icon={Users} trend={{ isPositive: true, value: 2.1 }} /></div>
      <div className="stagger-3"><StatCard title="Average Grade" value="88.4%" icon={TrendingUp} /></div>
    </div>
  </PageWrapper>
);

const StudentDashboard = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    api.get('/game/points').then(r => setPoints(r.data.activityPoints || 0)).catch(() => {});
  }, []);

  return (
    <PageWrapper title="Student Dashboard">
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 via-surface to-surface border border-green-500/20 relative overflow-hidden stagger-1">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-green-500/5 to-transparent pointer-events-none" />
        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">Student Portal</p>
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-1 flex items-center gap-2">Good {getGreeting()}, Student <GraduationCap className="w-6 h-6 text-green-400" /></h2>
        <p className="text-text-muted text-sm">Stay on track and keep pushing forward!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="stagger-1 md:col-span-2"><StatCard title="Activity Points" value={points.toString()} icon={Zap} trend={{ isPositive: true, value: "Top 10%" }} /></div>
        <div className="stagger-2"><StatCard title="Current GPA" value="3.8" icon={Award} trend={{ isPositive: true, value: 0.2 }} /></div>
        <div className="stagger-3"><StatCard title="Attendance" value="96%" icon={CheckCircle} /></div>
      </div>
    </PageWrapper>
  );
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#0e0e1a', color: '#eeeef5', border: '1px solid rgba(255,255,255,0.08)' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#0e0e1a' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#0e0e1a' } },
      }} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentRecords />} />
            <Route path="/admin/attendance" element={<AttendanceLog />} />
            <Route path="/admin/grades" element={<Gradebook />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/attendance" element={<AttendanceLog />} />
            <Route path="/teacher/grades" element={<Gradebook />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/attendance" element={<MyAttendance />} />
            <Route path="/student/grades" element={<MyGrades />} />
            <Route path="/student/playground" element={<Playground />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
