import { Outlet, NavLink } from "react-router-dom";

export function Layout() {
  return (
     <div style={{ padding: 16 }}>
      <header style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <NavLink to="/" end
          style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}
        >
          Home
        </NavLink>

        <NavLink to="/items"
          style={({ isActive }) => ({ fontWeight: isActive ? "bold" : "normal" })}
        >
          Items
        </NavLink>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
} 