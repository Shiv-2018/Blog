import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { PenTool, Menu, X, LogOut, User, Home, BookOpen } from "lucide-react";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-xl text-gradient"
          onClick={closeMenu}
        >
          <PenTool className="h-6 w-6 text-primary" />
          <span>BlogSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-foreground/80 hover:text-foreground transition-colors flex items-center space-x-1"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-foreground/80 hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <BookOpen className="h-4 w-4" />
                <span>My Posts</span>
              </Link>
              <Link
                to="/create"
                className="text-foreground/80 hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <PenTool className="h-4 w-4" />
                <span>Write</span>
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-primary" />
                <span className="text-foreground/80">
                  Welcome, {user?.username}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container max-w-7xl mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={closeMenu}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors py-2"
                  onClick={closeMenu}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>My Posts</span>
                </Link>
                <Link
                  to="/create"
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors py-2"
                  onClick={closeMenu}
                >
                  <PenTool className="h-4 w-4" />
                  <span>Write</span>
                </Link>
                <div className="flex items-center space-x-2 py-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-foreground/80">
                    Welcome, {user?.username}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/register");
                    closeMenu();
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
