import { Route } from "react-router-dom";
import PublicRoute from "@/routes/PublicRoute";

import Home from "@/pages/public/Home";
import Login from "@/pages/public/Login";
import UnAuthorized from "@/pages/public/UnAuthorized";

const PublicRoutes = (
    <>
        <Route element={<PublicRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/unauthorized" element={<UnAuthorized />} />
    </>
);

export default PublicRoutes;
