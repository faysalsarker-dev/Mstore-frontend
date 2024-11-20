import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const list = [
    { name: 'Buy Cards', path: '/', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 9 4-16 3 7h4" />
      </svg>
    )},
    { name: 'My Cards', path: '/my-cards', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    )},
    { name: 'Get Cards', path: '/get-card', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3 3v-6" />
      </svg>
    )},
  ];

  const adminsRoute = [
    { name: "All Users", path: "/users", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8l4 4H7a3 3 0 0 0-3 3v1" />
      </svg>
    )},
    { name: "Add Card", path: "/add-card", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    )},
    { name: "Manage Cards", path: "/manage-card", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    )},

  ];

  const user = true;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Sidebar section */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

        <div className="menu bg-[#2C3E50] text-white min-h-screen w-60 p-4">
          {user && (
            <div>
              <h2 className="text-gray-400 uppercase text-xs mb-3 tracking-wider">Admin Panel</h2>
              {adminsRoute.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-md my-1 transition-colors ${
                      isActive ? 'bg-gray-700 text-white font-semibold border-l-4 border-blue-500' : 'hover:bg-gray-600 hover:text-gray-200'
                    }`
                  }
                  aria-label={item.name}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          )}

          <div>
            <h2 className="text-gray-400 uppercase text-xs mt-6 mb-3 tracking-wider">User Section</h2>
            {list.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md my-1 transition-colors ${
                    isActive ? 'bg-gray-700 text-white font-semibold border-l-4 border-blue-500' : 'hover:bg-gray-600 hover:text-gray-200'
                  }`
                }
                aria-label={item.name}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
