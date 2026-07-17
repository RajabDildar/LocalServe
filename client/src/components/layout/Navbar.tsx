import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link to="/" className="text-lg font-bold">
          LocalServe
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {isAuthenticated && user?.role === "provider" && (
            <>
              <Link to="/provider/profile" className="hover:underline">
                My profile
              </Link>
              <Link to="/provider/services" className="hover:underline">
                My services
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <span className="text-muted-foreground">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
