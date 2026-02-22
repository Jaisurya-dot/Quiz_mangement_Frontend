import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examRoomAPI, submissionAPI } from '../services/api';
import { Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

const TakeExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        startExam();
    }, [examId]);

    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const startExam = async () => {
        try {
            const response = await submissionAPI.start(parseInt(examId));
            const data = response.data;

            setSubmission({ id: data.submission_id });
            setQuestions(data.questions);
            setTimeRemaining(data.duration_minutes * 60);

            const examRes = await examRoomAPI.getById(examId);
            setExam(examRes.data);
        } catch (error) {
            console.error('Error starting exam:', error);
            alert(error.response?.data?.detail || 'Failed to start exam');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = async (questionId, optionId) => {
        setAnswers({
            ...answers,
            [questionId]: optionId,
        });

        try {
            await submissionAPI.saveAnswer(submission.id, {
                question_id: questionId,
                selected_option_id: optionId,
            });
        } catch (error) {
            console.error('Error saving answer:', error);
        }
    };

    const handleSubmit = async () => {
        if (!window.confirm('Confirm Submission: Are you sure you wish to submit your responses? This action is final.')) {
            return;
        }

        setSubmitting(true);
        try {
            const response = await submissionAPI.submit(submission.id);
            navigate('/results', { state: { results: response.data } });
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Submission failed. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAutoSubmit = async () => {
        try {
            const response = await submissionAPI.submit(submission.id);
            alert('Examination session has expired. Your responses have been automatically synchronized.');
            navigate('/results', { state: { results: response.data } });
        } catch (error) {
            console.error('Error auto-submitting exam:', error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-dark-text">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-lg font-medium animate-pulse tracking-wide">Initializing secure assessment session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Sticky Exam Header */}
            <header className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary-600 items-center justify-center shadow-lg shadow-primary-500/20">
                                <Send size={24} className="text-white" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{exam?.title}</h1>
                                <div className="mt-1 flex items-center gap-3 justify-center sm:justify-start">
                                    <div className="flex -space-x-1">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-primary-500" />
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-dark-text-secondary uppercase tracking-widest">
                                        Progress: <span className="text-white">{getAnsweredCount()}</span> / {questions.length} Questions
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 shadow-inner ${timeRemaining < 300
                                    ? 'bg-error/5 border-error/20 text-error animate-pulse'
                                    : 'bg-white/5 border-white/10 text-white'
                                }`}>
                                <Clock size={20} className={timeRemaining < 300 ? 'animate-bounce' : ''} />
                                <span className="text-2xl font-black font-mono tracking-tighter">
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-1000 ease-out"
                            style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="space-y-12 md:space-y-20">
                    {questions.map((question, index) => (
                        <section key={question.id} className="relative group scroll-mt-32 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                            {/* Question Number Badge */}
                            <div className="absolute -left-4 md:-left-12 top-0 flex flex-col items-center gap-4">
                                <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-dark-surface border border-white/10 flex items-center justify-center font-black text-white text-lg md:text-2xl shadow-xl">
                                    {index + 1}
                                </div>
                                <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent flex-1 hidden md:block" />
                            </div>

                            <div className="card p-6 md:p-10 border border-white/5 hover:border-primary-500/20 transition-all duration-300 shadow-2xl bg-dark-surface/30">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed tracking-tight underline decoration-primary-500/30 underline-offset-8">
                                            {question.question_text}
                                        </h3>
                                    </div>
                                    <span className="px-3 py-1 rounded-lg bg-primary-500/10 text-primary-400 text-[10px] font-black tracking-widest uppercase border border-primary-500/20 whitespace-nowrap">
                                        {question.marks} Points
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {question.options.map((option) => (
                                        <label
                                            key={option.id}
                                            className={`relative flex items-center p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 group/option ${answers[question.id] === option.id
                                                    ? 'bg-primary-600/10 border-primary-500 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                className="hidden"
                                                value={option.id}
                                                checked={answers[question.id] === option.id}
                                                onChange={() => handleAnswerChange(question.id, option.id)}
                                            />
                                            <div className={`w-6 h-6 rounded-full border-2 mr-6 flex items-center justify-center transition-all ${answers[question.id] === option.id
                                                    ? 'border-primary-500 bg-primary-500'
                                                    : 'border-dark-border bg-dark-bg group-hover/option:border-white/30'
                                                }`}>
                                                {answers[question.id] === option.id && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            <span className={`text-base md:text-lg font-medium transition-colors ${answers[question.id] === option.id ? 'text-white' : 'text-dark-text'
                                                }`}>
                                                {option.option_text}
                                            </span>

                                            {answers[question.id] === option.id && (
                                                <div className="absolute right-6 flex items-center gap-2 text-primary-400 animate-in zoom-in-50">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Selected</span>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Submit Footer */}
                <div className="mt-32 p-10 card border border-white/5 bg-gradient-to-br from-primary-900/10 via-dark-surface to-secondary-900/10 text-center space-y-8 animate-in zoom-in-95 duration-700">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Review Your Work</h2>
                        <p className="text-dark-text-secondary text-lg">Double-check all questions before finalizing your submission.</p>
                    </div>

                    {getAnsweredCount() < questions.length && (
                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-warning/5 border border-warning/10 rounded-2xl text-warning">
                            <AlertCircle size={24} />
                            <span className="font-bold text-sm uppercase tracking-widest">
                                Careful: {questions.length - getAnsweredCount()} questions remain unanswered
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <button
                            className="btn btn-primary btn-lg px-20 py-5 text-lg font-black tracking-widest gap-4 shadow-2xl shadow-primary-500/20 active:scale-95 transition-transform"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Send size={24} />
                                    Finalize Submission
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TakeExam;
