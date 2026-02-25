import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F19]">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        
        {/* Inner Container FIX */}
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
          <Outlet />
        </div>

      </main>

      {/* Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111827",
            color: "#F9FAFB",
            border: "1px solid #374151",
            borderRadius: "8px",
            fontSize: "14px",
            padding: "10px 14px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#111827",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#111827",
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;