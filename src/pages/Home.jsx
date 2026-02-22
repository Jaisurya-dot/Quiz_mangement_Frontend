import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Award, Users, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-24 sm:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(14,165,233,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-dark-text sm:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            Master Your Knowledge with
                            <span className="block mt-2 bg-clip-text text-transparent bg-linear-to-br from-primary-400 to-secondary-400">
                                {' '}QuizMaster
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-dark-text-secondary animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            The ultimate platform for creating, taking, and managing online exams.
                            Perfect for educators and students alike.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {user ? (
                                <Link
                                    to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                                    className="btn btn-primary btn-lg gap-2"
                                >
                                    Go to Dashboard
                                    <ArrowRight size={20} />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-lg gap-2">
                                        Get Started
                                        <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/login" className="btn btn-ghost btn-lg">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32 bg-dark-bg/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Why Choose QuizMaster?
                        </h2>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                            <div className="card flex flex-col items-center text-center group">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                    <BookOpen size={32} />
                                </div>
                                <dt className="text-xl font-semibold leading-7 text-white">
                                    Easy Exam Creation
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-dark-text-secondary">
                                    <p className="flex-auto">Create comprehensive exams with multiple choice questions in minutes</p>
                                </dd>
                            </div>

                            <div className="card flex flex-col items-center text-center group">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                    <Award size={32} />
                                </div>
                                <dt className="text-xl font-semibold leading-7 text-white">
                                    Instant Results
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-dark-text-secondary">
                                    <p className="flex-auto">Get immediate feedback with detailed performance analytics</p>
                                </dd>
                            </div>

                            <div className="card flex flex-col items-center text-center group">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                    <Users size={32} />
                                </div>
                                <dt className="text-xl font-semibold leading-7 text-white">
                                    Student Management
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-dark-text-secondary">
                                    <p className="flex-auto">Track student progress and performance across all exams</p>
                                </dd>
                            </div>

                            <div className="card flex flex-col items-center text-center group">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={32} />
                                </div>
                                <dt className="text-xl font-semibold leading-7 text-white">
                                    Performance Tracking
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-dark-text-secondary">
                                    <p className="flex-auto">Monitor improvement over time with comprehensive history</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 sm:py-32 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="mx-auto max-w-2xl card-glass p-12 text-center rounded-3xl border-white/10">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to Get Started?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-dark-text-secondary">
                            Join thousands of educators and students using QuizMaster
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {!user && (
                                <Link to="/register" className="btn btn-primary btn-lg gap-2">
                                    Create Free Account
                                    <ArrowRight size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
