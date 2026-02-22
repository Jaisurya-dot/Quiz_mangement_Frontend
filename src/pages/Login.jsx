import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-dark-bg overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="card-glass border-white/10 p-8 sm:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-primary-600 to-primary-700 rounded-2xl text-white shadow-lg shadow-primary-500/20 mb-4">
                            <LogIn size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-dark-text-secondary">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-error/10 border border-error/20 rounded-xl text-error animate-in zoom-in-95 duration-200">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-dark-text ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary group-focus-within:text-primary-400 transition-colors" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    className="input pl-12"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-dark-text ml-1" htmlFor="password">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary group-focus-within:text-primary-400 transition-colors" size={20} />
                                <input
                                    id="password"
                                    type="password"
                                    className="input pl-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="remember" className="rounded border-dark-border bg-dark-bg text-primary-500 focus:ring-primary-500/20" />
                                <label htmlFor="remember" className="text-sm text-dark-text-secondary cursor-pointer">Remember me</label>
                            </div>
                            <a href="#" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn btn-primary w-full py-4 text-base" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-dark-text-secondary">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
