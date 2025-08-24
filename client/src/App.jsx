import { AuthProvider } from './contexts/authContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PublicRoutes from "@/routes/publicRoutes";
import AdminRoutes from "@/routes/adminRoutes";
import TeacherRoutes from "@/routes/teacherRoutes";
import StudentRoutes from "@/routes/studentRoutes";
import NotFound from './pages/public/NotFound';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {PublicRoutes}
          {AdminRoutes}
          {TeacherRoutes}
          {StudentRoutes}
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
