import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examRoomAPI } from '../services/api';
import { Plus, Edit, Trash2, Eye, Users, BookOpen, Calendar, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await examRoomAPI.getMyExams();
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (examId) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) {
            return;
        }

        try {
            await examRoomAPI.delete(examId);
            setExams(exams.filter((exam) => exam.id !== examId));
        } catch (error) {
            console.error('Error deleting exam:', error);
            alert('Failed to delete exam');
        }
    };

    const handlePublish = async (examId) => {
        try {
            await examRoomAPI.publish(examId);
            setExams(
                exams.map((exam) =>
                    exam.id === examId ? { ...exam, is_published: true } : exam
                )
            );
        } catch (error) {
            console.error('Error publishing exam:', error);
            alert('Failed to publish exam');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-dark-text">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-lg font-medium animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                        <p className="text-dark-text-secondary text-lg">Manage your exams and track student performance</p>
                    </div>
                    <button
                        className="btn btn-primary gap-2 py-4 px-8 shadow-primary-500/20 hover:shadow-primary-500/40 transition-all text-base"
                        onClick={() => navigate('/admin/create-exam')}
                    >
                        <Plus size={24} />
                        Create New Exam
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <div className="card bg-dark-surface/50 p-6 flex items-center gap-6">
                        <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400">
                            <BookOpen size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{exams.length}</div>
                            <div className="text-sm text-dark-text-secondary font-medium tracking-wide uppercase mt-1">Total Exams</div>
                        </div>
                    </div>
                    <div className="card bg-dark-surface/50 p-6 flex items-center gap-6">
                        <div className="p-4 bg-success/10 rounded-2xl text-success">
                            <Eye size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                {exams.filter((e) => e.is_published).length}
                            </div>
                            <div className="text-sm text-dark-text-secondary font-medium tracking-wide uppercase mt-1">Published</div>
                        </div>
                    </div>
                    <div className="card bg-dark-surface/50 p-6 flex items-center gap-6">
                        <div className="p-4 bg-secondary-500/10 rounded-2xl text-secondary-400">
                            <Users size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">0</div>
                            <div className="text-sm text-dark-text-secondary font-medium tracking-wide uppercase mt-1">Total Submissions</div>
                        </div>
                    </div>
                </div>

                {/* Exams List Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-dark-border pb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BookOpen className="text-primary-500" size={24} />
                            Your Exams
                        </h2>
                    </div>

                    {exams.length === 0 ? (
                        <div className="card py-24 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2">
                            <div className="w-20 h-20 bg-dark-surface rounded-full flex items-center justify-center text-dark-text-secondary mb-2">
                                <BookOpen size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">No Exams Created Yet</h3>
                                <p className="text-dark-text-secondary max-w-sm mx-auto">Start by creating your first exam. You can add questions and set timing later.</p>
                            </div>
                            <button className="btn btn-primary px-8 py-3 gap-2" onClick={() => navigate('/admin/create-exam')}>
                                <Plus size={20} />
                                Create Exam
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            {exams.map((exam) => (
                                <div key={exam.id} className="card flex flex-col group relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className={`badge py-1.5 px-4 rounded-full font-bold text-[11px] shadow-sm ${exam.is_published
                                                ? 'bg-success/20 text-success ring-1 ring-success/30'
                                                : 'bg-warning/20 text-warning ring-1 ring-warning/30'
                                            }`}>
                                            {exam.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight line-clamp-1 mb-3">
                                            {exam.title}
                                        </h3>
                                        <p className="text-dark-text-secondary text-sm leading-relaxed line-clamp-2 h-10 mb-6">
                                            {exam.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-dark-border/50 mb-6">
                                        <div className="flex items-center gap-2 text-dark-text-secondary text-xs font-semibold">
                                            <Clock size={16} className="text-primary-500" />
                                            {exam.duration_minutes} min
                                        </div>
                                        <div className="flex items-center gap-2 text-dark-text-secondary text-xs font-semibold">
                                            <Calendar size={16} className="text-primary-500" />
                                            {new Date(exam.start_time).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-auto">
                                        <button
                                            className="btn btn-ghost py-2.5 text-xs gap-2"
                                            onClick={() => navigate(`/admin/exam/${exam.id}`)}
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-ghost py-2.5 text-xs gap-2"
                                            onClick={() => navigate(`/admin/submissions/${exam.id}`)}
                                        >
                                            <Users size={14} />
                                            Results
                                        </button>
                                        {!exam.is_published ? (
                                            <button
                                                className="btn btn-secondary py-2.5 text-xs gap-2 group/pub"
                                                onClick={() => handlePublish(exam.id)}
                                            >
                                                <Eye size={14} className="group-hover/pub:scale-110 transition-transform" />
                                                Publish
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-center bg-success/5 border border-success/10 rounded-lg text-success text-[10px] font-bold uppercase tracking-wider">
                                                Active
                                            </div>
                                        )}
                                        <button
                                            className="btn btn-danger py-2.5 text-xs gap-2 group/del"
                                            onClick={() => handleDelete(exam.id)}
                                        >
                                            <Trash2 size={14} className="group-hover/del:scale-110 transition-transform" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
