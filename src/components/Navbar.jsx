import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, BookOpen, LayoutDashboard, Sun, Moon } from 'lucide-react';



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
