import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const list = [
    { name: 'Buy Cards', path: '/' },
    { name: 'My Cards', path: '/my-cards' },
    { name: 'Get Cards', path: '/get-card' },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Sidebar section */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="menu bg-[#34495E] text-white min-h-screen w-60 p-4">
          {list.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg p-3 my-2 transition-colors ${
                  isActive ? 'bg-red-500' : 'hover:bg-slate-400'
                }`
              }
              aria-label={item.name}
            >
              <div className="border-b border-white">
                <p className="text-base">{item.name}</p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
