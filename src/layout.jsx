import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="flex max-h-screen">
        {/* Sidebar section with scrollable content if it exceeds screen height */}
        <div className="h-[calc(100vh-80px)] max-h-screen overflow-y-auto src shadow-lg">
          <Sidebar />
        </div>

        {/* Main content section, taking the remaining height after navbar */}
        <div className="flex-1 h-[calc(100vh-80px)] max-h-screen overflow-auto p-6 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
