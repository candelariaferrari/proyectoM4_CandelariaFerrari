import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../config/navItems";
import "./BottomNav.css";

interface BottomNavProps {
  onLogout: () => void;
  onNewTaskClick: () => void;
}

function BottomNav({ onLogout, onNewTaskClick }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}

      <button
        type="button"
        className="bottom-nav__item bottom-nav__item--new"
        onClick={onNewTaskClick}
      >
        + Nueva tarea
      </button>

      <button
        type="button"
        className="bottom-nav__item bottom-nav__item--logout"
        onClick={onLogout}
      >
        Salir
      </button>
    </nav>
  );
}

export default BottomNav;
