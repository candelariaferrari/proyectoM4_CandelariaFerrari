import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../config/navItems";
import "./Sidebar.css";

interface SidebarProps {
  onLogout: () => void;
  onNewTaskClick: () => void;
}

function Sidebar({ onLogout, onNewTaskClick }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">for today</div>

      <button type="button" className="sidebar__add-btn" onClick={onNewTaskClick}>
        + Nueva Tarea
      </button>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__nav-item${isActive ? " sidebar__nav-item--active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__spacer" />

      <button type="button" className="sidebar__logout" onClick={onLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;