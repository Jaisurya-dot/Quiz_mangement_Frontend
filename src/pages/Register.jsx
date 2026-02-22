import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.role
        );

        if (result.success) {
            if (formData.role === 'ADMIN') {
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
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-dark-bg overflow-hidden py-12">
            {/* Background decorative elements */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl opacity-50" />

            <div className="w-full max-w-lg relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="card-glass border-white/10 p-8 sm:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-primary-600 to-primary-700 rounded-2xl text-white shadow-lg shadow-primary-500/20 mb-4">
                            <UserPlus size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-dark-text-secondary">Join QuizMaster and start your learning journey</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-error/10 border border-error/20 rounded-xl text-error animate-in zoom-in-95 duration-200">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-dark-text ml-1" htmlFor="username">
                                    Username
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary group-focus-within:text-primary-400 transition-colors" size={18} />
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        className="input pl-12"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-dark-text ml-1" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary group-focus-within:text-primary-400 transition-colors" size={18} />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="input pl-12"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-dark-text ml-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary group-focus-within:text-primary-400 transition-colors" size={18} />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="input pl-12"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-dark-text ml-1" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary group-focus-within:text-primary-400 transition-colors" size={18} />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className="input pl-12"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-dark-text ml-1" htmlFor="role">
                                Account Type
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="input appearance-none bg-dark-bg cursor-pointer"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="STUDENT">Student - I want to take quizzes</option>
                                <option value="ADMIN">Admin/Teacher - I want to create quizzes</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-full py-4 text-base mt-4" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-dark-text-secondary">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
