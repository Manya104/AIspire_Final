import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const navLinks = [
    { to: '/career-path', label: 'Career Paths' },
    { to: '/map', label: 'Map' },
    { to: '/skillcard', label: 'Skill-Card' },
    { to: '/clusters', label: 'Clusters' },
    { to: '/accessible', label: 'Accessible' },
    { to: '/search', label: 'Search' },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 px-6 md:px-20 py-4 bg-background-light/90 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative size-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-accent-blue opacity-20 rounded-full blur-lg"></div>
          <span className="material-symbols-outlined text-primary font-bold text-2xl">blur_on</span>
        </div>
        <Link to="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
          AISPIRE
        </Link>
      </div>
      <nav className="flex flex-1 justify-end items-center gap-4 md:gap-6 flex-wrap">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors ${
              location.pathname === link.to
                ? 'text-primary'
                : 'text-slate-600 hover:text-primary'
            }`}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin ? (
          <>
            <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Admin
            </Link>
            <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            Admin Login
          </Link>
        )}
        <Link
          to="/search"
          className="inline-flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
        >
          Start Now
        </Link>
      </nav>
    </header>
  );
}
