import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar section, fixed width */}
        <div className="overflow-y-auto">
          <Sidebar />
        </div>
        
        {/* Main content section, flexible width */}
        <div className="flex-1 p-4 ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
