import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examRoomAPI, submissionAPI } from '../services/api';
import { Clock, Calendar, BookOpen, Trophy, Play, History } from 'lucide-react';

const StudentDashboard = () => {
    const [exams, setExams] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [examsRes, historyRes] = await Promise.all([
                examRoomAPI.getAll(true),
                submissionAPI.getMyHistory(),
            ]);
            setExams(examsRes.data);
            setHistory(historyRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = (examId) => {
        navigate(`/exam/${examId}`);
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

    const isExamActive = (exam) => {
        const now = new Date();
        const start = new Date(exam.start_time);
        const end = new Date(exam.end_time);
        return now >= start && now <= end;
    };

    const getExamStatus = (exam) => {
        const now = new Date();
        const start = new Date(exam.start_time);
        const end = new Date(exam.end_time);

        if (now < start) return { text: 'Upcoming', class: 'badge-warning' };
        if (now > end) return { text: 'Ended', class: 'badge-danger' };
        return { text: 'Active', class: 'badge-success' };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-dark-text">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-lg font-medium animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight">Student Dashboard</h1>
                        <p className="text-dark-text-secondary text-lg">Welcome back! Ready to test your knowledge?</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="card px-6 py-4 flex items-center gap-4 bg-dark-surface/50 min-w-[200px]">
                            <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white leading-none">{exams.length}</div>
                                <div className="text-sm text-dark-text-secondary mt-1">Available Exams</div>
                            </div>
                        </div>
                        <div className="card px-6 py-4 flex items-center gap-4 bg-dark-surface/50 min-w-[200px]">
                            <div className="p-3 bg-secondary-500/10 rounded-xl text-secondary-400">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white leading-none">{history.length}</div>
                                <div className="text-sm text-dark-text-secondary mt-1">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="space-y-8">
                    <div className="flex gap-4 border-b border-dark-border">
                        <button
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${activeTab === 'available'
                                    ? 'text-primary-400'
                                    : 'text-dark-text-secondary hover:text-dark-text'
                                }`}
                            onClick={() => setActiveTab('available')}
                        >
                            <BookOpen size={18} />
                            Available Exams
                            {activeTab === 'available' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 shadow-lg shadow-primary-400/50" />
                            )}
                        </button>
                        <button
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${activeTab === 'history'
                                    ? 'text-primary-400'
                                    : 'text-dark-text-secondary hover:text-dark-text'
                                }`}
                            onClick={() => setActiveTab('history')}
                        >
                            <History size={18} />
                            My History
                            {activeTab === 'history' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 shadow-lg shadow-primary-400/50" />
                            )}
                        </button>
                    </div>

                    {/* Content Section */}
                    {activeTab === 'available' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {exams.length === 0 ? (
                                <div className="col-span-full card py-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed">
                                    <div className="p-4 bg-dark-surface rounded-full text-dark-text-secondary mb-2">
                                        <BookOpen size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">No Exams Available</h3>
                                    <p className="text-dark-text-secondary max-w-xs">There are no exams available for you to take right now. Check back later!</p>
                                </div>
                            ) : (
                                exams.map((exam) => {
                                    const status = getExamStatus(exam);
                                    const active = isExamActive(exam);

                                    return (
                                        <div key={exam.id} className="card flex flex-col group h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{exam.title}</h3>
                                                <span className={`badge ${status.class} ring-2 ring-current ring-offset-2 ring-offset-dark-surface`}>
                                                    {status.text}
                                                </span>
                                            </div>

                                            <p className="text-dark-text-secondary text-sm leading-relaxed mb-6 line-clamp-2">
                                                {exam.description || 'No description provided for this exam.'}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-border mt-auto mb-6">
                                                <div className="flex items-center gap-2 text-dark-text-secondary">
                                                    <Clock size={16} className="text-primary-400" />
                                                    <span className="text-xs font-semibold">{exam.duration_minutes} min</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-dark-text-secondary">
                                                    <Calendar size={16} className="text-primary-400" />
                                                    <span className="text-xs font-semibold">{new Date(exam.start_time).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <button
                                                className={`btn w-full gap-2 text-sm font-bold uppercase tracking-widest ${active ? 'btn-primary' : 'btn-ghost'
                                                    }`}
                                                onClick={() => handleStartExam(exam.id)}
                                                disabled={!active}
                                            >
                                                <Play size={16} fill={active ? "currentColor" : "none"} />
                                                {active ? 'Start Exam' : status.text === 'Upcoming' ? 'Not Started' : 'Exam Ended'}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="max-w-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {history.length === 0 ? (
                                <div className="card py-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed">
                                    <div className="p-4 bg-dark-surface rounded-full text-dark-text-secondary mb-2">
                                        <History size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">No Exam History</h3>
                                    <p className="text-dark-text-secondary max-w-xs">You haven't taken any exams yet. Start your first exam to see your history!</p>
                                </div>
                            ) : (
                                history.map((submission) => (
                                    <div key={submission.id} className="card group hover:scale-[1.01] transition-transform">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                                                    {submission.exam_room_title}
                                                </h4>
                                                <p className="text-sm text-dark-text-secondary">{formatDate(submission.started_at)}</p>
                                            </div>
                                            <div className="flex items-center gap-3 px-4 py-2 bg-dark-bg rounded-xl border border-dark-border group-hover:border-primary-500 transition-colors">
                                                <Trophy size={20} className="text-primary-400" />
                                                <span className="text-2xl font-bold text-white">{submission.total_score || 0}</span>
                                                <span className="text-xs font-bold text-dark-text-secondary uppercase">Score</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-dark-border">
                                            <span className={`badge px-4 py-1.5 ${submission.status === 'SUBMITTED' ? 'badge-success' :
                                                    submission.status === 'AUTO_SUBMITTED' ? 'badge-warning' :
                                                        'badge-primary'
                                                }`}>
                                                {submission.status}
                                            </span>
                                            {submission.time_taken_seconds && (
                                                <span className="flex items-center gap-2 text-dark-text-secondary text-sm font-semibold">
                                                    <Clock size={14} className="text-primary-400" />
                                                    {Math.floor(submission.time_taken_seconds / 60)} min {submission.time_taken_seconds % 60} sec
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
