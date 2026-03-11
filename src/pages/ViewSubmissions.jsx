import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examRoomAPI, submissionAPI } from '../services/api';
import { ArrowLeft, Trophy, Clock, Calendar, User } from 'lucide-react';

const ViewSubmissions = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [examId]);

    const fetchData = async () => {
        try {
            const [examRes, submissionsRes] = await Promise.all([
                examRoomAPI.getById(examId),
                submissionAPI.getExamRoomSubmissions(examId),
            ]);
            setExam(examRes.data);
            setSubmissions(submissionsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
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

    const getAverageScore = () => {
        if (submissions.length === 0) return 0;
        const total = submissions.reduce((sum, sub) => sum + (sub.total_score || 0), 0);
        return (total / submissions.length).toFixed(1);
    };

    const getCompletionRate = () => {
        if (submissions.length === 0) return 0;
        const completed = submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'AUTO_SUBMITTED').length;
        return ((completed / submissions.length) * 100).toFixed(0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-dark-text">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-lg font-medium animate-pulse">Loading submission data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-4">
                        <button
                            className="flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors group"
                            onClick={() => navigate('/admin')}
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Back to Dashboard</span>
                        </button>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-bold text-white tracking-tight">{exam?.title}</h1>
                            <p className="text-dark-text-secondary text-lg">Detailed analysis of student performance and submission history</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-100">
                    <div className="card bg-dark-surface/50 p-6 flex items-center gap-6">
                        <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400">
                            <User size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{submissions.length}</div>
                            <div className="text-sm text-dark-text-secondary font-medium tracking-wide uppercase mt-1">Total Submissions</div>
                        </div>
                    </div>
                    <div className="card bg-dark-surface/50 p-6 flex items-center gap-6">
                        <div className="p-4 bg-secondary-500/10 rounded-2xl text-secondary-400">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{getAverageScore()}</div>
                            <div className="text-sm text-dark-text-secondary font-medium tracking-wide uppercase mt-1">Average Score</div>
                        </div>
                    </div>
                    <div className="card bg-dark-surface/50 p-6 flex items-center gap-6">
                        <div className="p-4 bg-success/10 rounded-2xl text-success">
                            <Clock size={32} />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{getCompletionRate()}%</div>
                            <div className="text-sm text-dark-text-secondary font-medium tracking-wide uppercase mt-1">Completion Rate</div>
                        </div>
                    </div>
                </div>

                {/* Submissions Section */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <div className="flex items-center justify-between border-b border-dark-border pb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Calendar className="text-primary-500" size={24} />
                            Submissions Log
                        </h2>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="card py-24 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2">
                            <div className="w-20 h-20 bg-dark-surface rounded-full flex items-center justify-center text-dark-text-secondary mb-2">
                                <User size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">No Submissions Yet</h3>
                                <p className="text-dark-text-secondary max-w-sm mx-auto">This exam hasn't received any student attempts yet. Once students finish, their results will appear here.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-bold text-dark-text-secondary">
                                            <th className="px-6 py-4">Student_name</th>
                                            <th className="px-6 py-4">Started At</th>
                                            <th className="px-6 py-4">Submitted At</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4">Total Score</th>
                                            <th className="px-6 py-4 text-center">Outcome</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {submissions.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-5 font-mono text-xs text-primary-400">{submission.student_name}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-dark-text text-sm">
                                                        <Calendar size={14} className="text-dark-text-secondary" />
                                                        {formatDate(submission.started_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {submission.submitted_at ? (
                                                        <div className="flex items-center gap-2 text-dark-text text-sm">
                                                            <Calendar size={14} className="text-dark-text-secondary" />
                                                            {formatDate(submission.submitted_at)}
                                                        </div>
                                                    ) : (
                                                        <span className="text-dark-text-secondary italic text-xs tracking-wide">In progress</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    {submission.time_taken_seconds ? (
                                                        <div className="flex items-center gap-2 text-dark-text text-sm">
                                                            <Clock size={14} className="text-dark-text-secondary" />
                                                            {Math.floor(submission.time_taken_seconds / 60)}m {submission.time_taken_seconds % 60}s
                                                        </div>
                                                    ) : (
                                                        <span className="text-dark-text-secondary">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                            <Trophy size={14} />
                                                        </div>
                                                        <span className="font-bold text-white text-base">{submission.total_score || 0}</span>
                                                        <span className="text-dark-text-secondary text-xs font-semibold">/ {exam?.total_marks}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-center">
                                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${submission.status === 'SUBMITTED'
                                                                ? 'bg-success/10 text-success border-success/20'
                                                                : submission.status === 'AUTO_SUBMITTED'
                                                                    ? 'bg-warning/10 text-warning border-warning/20'
                                                                    : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                                                            }`}>
                                                            {submission.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewSubmissions;
