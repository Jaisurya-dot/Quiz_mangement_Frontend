import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, User, BookOpen, LayoutDashboard, Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="theme-toggle group"
            id="theme-toggle-btn"
        >
            <span
                key={isDark ? 'moon' : 'sun'}
                className="theme-toggle-icon"
                style={{
                    animation: 'iconSwap 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {isDark ? (
                    <Sun size={18} className="text-yellow-400" />
                ) : (
                    <Moon size={18} className="text-primary-500" />
                )}
            </span>

            <style>{`
                @keyframes iconSwap {
                    0%   { opacity: 0; transform: rotate(-90deg) scale(0.5); }
                    100% { opacity: 1; transform: rotate(0deg) scale(1); }
                }
            `}</style>
        </button>
    );
};

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-dark-surface/80 backdrop-blur-xl border-b border-dark-border py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-10">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-2xl font-bold text-primary-400 transition-all hover:text-primary-300 hover:scale-105"
                    >
                        <BookOpen size={28} />
                        <span>QuizMaster</span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    to={isAdmin() ? '/admin' : '/dashboard'}
                                    className="flex items-center gap-2 text-dark-text font-medium transition-colors hover:text-primary-400"
                                >
                                    <LayoutDashboard size={18} />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>

                                {/* Theme Toggle */}
                                {/* <ThemeToggle /> */}

                                <div className="flex items-center gap-3">
                                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-dark-bg rounded-lg border border-dark-border">
                                        <User size={18} className="text-primary-400" />
                                        <span className="text-sm font-medium">{user.email}</span>
                                        <span className={`badge ${isAdmin() ? 'badge-primary' : 'badge-success'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <button onClick={handleLogout} className="btn-ghost btn-sm btn">
                                        <LogOut size={16} />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* Theme Toggle for guests too */}
                                <ThemeToggle />
                                <Link to="/login" className="btn-ghost btn-sm btn">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary btn-sm btn">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
