import { Route } from "react-router-dom";
import PublicRoute from "@/routes/PublicRoute";

import Home from "@/pages/public/Home";
import Login from "@/pages/public/Login";
import RegisterStudent from "@/pages/public/RegisterStudent";
import RegisterTeacher from "@/pages/public/RegisterTeacher";
import UnAuthorized from "@/pages/public/UnAuthorized";

const PublicRoutes = (
    <>
        <Route element={<PublicRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-student" element={<RegisterStudent />} />
            <Route path="/register-teacher" element={<RegisterTeacher />} />
        </Route>
        <Route path="/unauthorized" element={<UnAuthorized />} />
    </>
);

export default PublicRoutes;
