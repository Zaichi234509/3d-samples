import { Routes, Route, Link } from "react-router-dom";
import UserSite from "./pages/UserSite";
import AdminSite from "./pages/AdminSite";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserSite />} />
      <Route path="/admin/*" element={<AdminSite />} />
      <Route
        path="*"
        element={
          <div className="empty" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
            <div>
              <div className="big">☕</div>
              <h2 style={{ color: "var(--velvet)" }}>Page not found</h2>
              <p>This cup is empty. Let's get you back to the menu.</p>
              <Link className="btn btn-primary" to="/" style={{ marginTop: "1rem" }}>
                Back to Velvet Brew
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
