import { AuthProvider } from './contexts/authContext'
import { BrowserRouter as Router, Routes } from 'react-router-dom';

import PublicRoutes from "@/routes/publicRoutes";
import AdminRoutes from "@/routes/adminRoutes";
import TeacherRoutes from "@/routes/teacherRoutes";
import StudentRoutes from "@/routes/studentRoutes";

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {PublicRoutes}
          {AdminRoutes}
          {TeacherRoutes}
          {StudentRoutes}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
