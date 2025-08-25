import { AuthProvider } from './contexts/authContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';

import PublicRoutes from "@/routes/publicRoutes";
import AdminRoutes from "@/routes/adminRoutes";
import TeacherRoutes from "@/routes/teacherRoutes";
import StudentRoutes from "@/routes/studentRoutes";
import NotFound from './pages/public/NotFound';

function App() {

  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            {PublicRoutes}
            {AdminRoutes}
            {TeacherRoutes}
            {StudentRoutes}
            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  )
}

export default App
