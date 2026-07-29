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
      <div className="bottom-nav__links">
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
      </div>

      {/* Este bloque central solo reserva el espacio horizontal del botón +
          (que se dibuja flotando arriba con position:absolute). Antes el +
          se centraba con left:50% sobre TODO el nav, pero al tener solo 2
          links + "Salir" repartidos con space-around, el centro del nav
          coincidía con "Mis tareas" y el botón quedaba encima del texto. */}
      <div className="bottom-nav__center">
        <button
          type="button"
          className="bottom-nav__add-btn"
          aria-label="Nueva tarea"
          onClick={onNewTaskClick}
        >
          +
        </button>
      </div>

      <button type="button" className="bottom-nav__logout" onClick={onLogout}>
        Salir
      </button>
    </nav>
  );
}

export default BottomNav;
