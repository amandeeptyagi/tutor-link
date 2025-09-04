import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1000,
          style: {
            background: "#fff",
            color: "#333",
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
