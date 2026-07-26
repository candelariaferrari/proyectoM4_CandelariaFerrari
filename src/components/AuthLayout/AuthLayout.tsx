import "./AuthLayout.css";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <div className="auth-layout__logo">
          <h1>For today</h1>
          <p>by matecode</p>
        </div>

        <p className="auth-layout__tagline">
          Organizá tu día,
          <br />
          <span className="accent">un paso a la vez.</span>
        </p>

        <p className="auth-layout__foot">© for today — gestor de tareas</p>
      </div>


      <main className="auth-layout__content">
        {children}
      </main>


    </div>
  );
}

export default AuthLayout