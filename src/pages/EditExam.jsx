import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examRoomAPI, questionAPI } from '../services/api';
import { Plus, Trash2, Save, AlertCircle, ArrowLeft, BookOpen } from 'lucide-react';

const EditExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [examData, setExamData] = useState({
        title: '',
        description: '',
        duration_minutes: 60,
        start_time: '',
        end_time: '',
    });

    const [questions, setQuestions] = useState([]);
    const [existingQuestions, setExistingQuestions] = useState([]);

    useEffect(() => {
        fetchExamData();
    }, [examId]);

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    const fetchExamData = async () => {
        try {
            const [examRes, questionsRes] = await Promise.all([
                examRoomAPI.getById(examId),
                questionAPI.getByExamRoom(examId),
            ]);

            const exam = examRes.data;
            setExamData({
                title: exam.title,
                description: exam.description,
                duration_minutes: exam.duration_minutes,
                start_time: formatDateTimeLocal(exam.start_time),
                end_time: formatDateTimeLocal(exam.end_time),
            });

            setExistingQuestions(questionsRes.data);
            setQuestions(questionsRes.data.map(q => ({
                id: q.id,
                question_text: q.question_text,
                marks: q.marks,
                order_index: q.order_index,
                options: q.options.map(opt => ({
                    id: opt.id,
                    option_text: opt.option_text,
                    is_correct: opt.is_correct,
                })),
            })));
        } catch (error) {
            console.error('Error fetching exam data:', error);
            setError('Failed to load exam data');
        } finally {
            setLoading(false);
        }
    };



    const handleExamChange = (e) => {
        setExamData({
            ...examData,
            [e.target.name]: e.target.value,
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...questions];

        if (field === 'is_correct' && value) {
            newQuestions[qIndex].options.forEach((opt, i) => {
                opt.is_correct = i === oIndex;
            });
        } else {
            newQuestions[qIndex].options[oIndex][field] = value;
        }

        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                marks: 1,
                order_index: questions.length,
                options: [
                    { option_text: '', is_correct: false },
                    { option_text: '', is_correct: false },
                ],
            },
        ]);
    };

    const removeQuestion = async (index) => {
        const question = questions[index];

        if (question.id) {
            if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
                return;
            }

            try {
                await questionAPI.delete(question.id);
                setQuestions(questions.filter((_, i) => i !== index));
            } catch (error) {
                console.error('Error deleting question:', error);
                alert('Failed to delete question');
            }
        } else {
            if (questions.length === 1) {
                alert('You must have at least one question');
                return;
            }
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length >= 6) {
            alert('Maximum 6 options allowed');
            return;
        }
        newQuestions[qIndex].options.push({ option_text: '', is_correct: false });
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length <= 2) {
            alert('Minimum 2 options required');
            return;
        }
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const validateForm = () => {
        if (!examData.title || !examData.description) {
            setError('Please fill in all exam details');
            return false;
        }

        if (!examData.start_time || !examData.end_time) {
            setError('Please set exam start and end times');
            return false;
        }

        if (new Date(examData.end_time) <= new Date(examData.start_time)) {
            setError('End time must be after start time');
            return false;
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question_text) {
                setError(`Question ${i + 1} is empty`);
                return false;
            }

            const hasCorrect = q.options.some((opt) => opt.is_correct);
            if (!hasCorrect) {
                setError(`Question ${i + 1} must have at least one correct answer`);
                return false;
            }

            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].option_text) {
                    setError(`Question ${i + 1}, Option ${j + 1} is empty`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const total_marks = questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);

            const examPayload = {
                ...examData,
                duration_minutes: parseInt(examData.duration_minutes) || 60,
                total_marks,
            };

            await examRoomAPI.update(examId, examPayload);

            for (const question of questions) {
                if (question.id) {
                    await questionAPI.update(question.id, {
                        question_text: question.question_text,
                        marks: parseInt(question.marks) || 1,
                        order_index: parseInt(question.order_index) || 0,
                    });

                    for (const option of question.options) {
                        if (option.id) {
                            await questionAPI.updateOption(option.id, {
                                option_text: option.option_text,
                                is_correct: option.is_correct,
                            });
                        } else {
                            await questionAPI.createOption(question.id, {
                                option_text: option.option_text,
                                is_correct: option.is_correct,
                            });
                        }
                    }
                } else {
                    await questionAPI.create(examId, {
                        ...question,
                        marks: parseInt(question.marks) || 1,
                        order_index: parseInt(question.order_index) || 0,
                    });
                }
            }

            alert('Exam updated successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating exam:', error);
            const errorMessage = error.response?.data?.detail
                ? (Array.isArray(error.response.data.detail)
                    ? error.response.data.detail.map(e => e.msg).join(', ')
                    : error.response.data.detail)
                : 'Failed to update exam';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-dark-text">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-lg font-medium animate-pulse">Loading exam configuration...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <button
                            className="flex items-center gap-2 text-dark-text-secondary hover:text-white mb-4 transition-colors group"
                            onClick={() => navigate('/admin')}
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-semibold">Back to Dashboard</span>
                        </button>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Edit Exam</h1>
                        <p className="text-dark-text-secondary text-lg">Modify exam details and manage your question bank</p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 mb-8 bg-error/10 border border-error/20 rounded-xl text-error animate-in zoom-in-95 duration-200">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 pb-24">
                    {/* Exam Details Card */}
                    <div className="card p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 ring-1 ring-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 border-b border-dark-border pb-4">
                            <Save className="text-primary-400" size={24} />
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Core Settings</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-text ml-1" htmlFor="title">
                                    Exam Title <span className="text-error">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    className="input focus:ring-primary-500/50"
                                    placeholder="e.g., Mathematics Final Exam 2024"
                                    value={examData.title}
                                    onChange={handleExamChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-text ml-1" htmlFor="description">
                                    Description <span className="text-error">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="input min-h-[120px] focus:ring-primary-500/50"
                                    placeholder="Describe the topics and instructions..."
                                    value={examData.description}
                                    onChange={handleExamChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-dark-text ml-1" htmlFor="duration_minutes">
                                        Duration (min) <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="duration_minutes"
                                        name="duration_minutes"
                                        type="number"
                                        className="input"
                                        min="1"
                                        value={examData.duration_minutes}
                                        onChange={handleExamChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-dark-text ml-1" htmlFor="start_time">
                                        Start Time <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="start_time"
                                        name="start_time"
                                        type="datetime-local"
                                        className="input cursor-pointer"
                                        value={examData.start_time}
                                        onChange={handleExamChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-dark-text ml-1" htmlFor="end_time">
                                        End Time <span className="text-error">*</span>
                                    </label>
                                    <input
                                        id="end_time"
                                        name="end_time"
                                        type="datetime-local"
                                        className="input cursor-pointer"
                                        value={examData.end_time}
                                        onChange={handleExamChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-dark-border pb-4">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="text-primary-400" size={24} />
                                Questions ({questions.length})
                            </h2>
                            <button
                                type="button"
                                className="btn btn-secondary gap-2 py-3 px-6 shadow-lg shadow-black/20"
                                onClick={addQuestion}
                            >
                                <Plus size={20} />
                                Add New Question
                            </button>
                        </div>

                        <div className="space-y-12">
                            {questions.map((question, qIndex) => (
                                <div key={qIndex} className="card p-8 group relative animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 z-10">
                                        {qIndex + 1}
                                    </div>

                                    <div className="flex justify-between items-start mb-8 ml-8">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Question Details</h3>
                                            {question.id ? (
                                                <span className="badge bg-primary-500/10 text-primary-400 text-[10px] px-2 py-0.5 border border-primary-500/20">Saved</span>
                                            ) : (
                                                <span className="badge bg-warning/10 text-warning text-[10px] px-2 py-0.5 border border-warning/20">Draft</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="p-2 text-dark-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-all"
                                            onClick={() => removeQuestion(qIndex)}
                                            title="Delete question"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-8 ml-0 md:ml-8">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                            <div className="md:col-span-3 space-y-2">
                                                <label className="text-sm font-bold text-dark-text ml-1">Question Content</label>
                                                <textarea
                                                    className="input min-h-[100px]"
                                                    placeholder="Enter your question here..."
                                                    value={question.question_text}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark-text ml-1">Marks Allocation</label>
                                                <input
                                                    type="number"
                                                    className="input"
                                                    min="1"
                                                    value={question.marks}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                                                    <label className="text-xs font-bold text-white uppercase tracking-widest">Options Configuration</label>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost py-1.5 px-3 text-[10px] gap-2 hover:bg-white/10"
                                                    onClick={() => addOption(qIndex)}
                                                >
                                                    <Plus size={14} />
                                                    Add Option
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {question.options.map((option, oIndex) => (
                                                    <div key={oIndex} className="flex items-center gap-4 group/option">
                                                        <div className="relative">
                                                            <input
                                                                type="radio"
                                                                name={`correct-${qIndex}`}
                                                                className="w-6 h-6 rounded-full border-2 border-dark-border bg-dark-bg checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer appearance-none"
                                                                checked={option.is_correct}
                                                                onChange={(e) => handleOptionChange(qIndex, oIndex, 'is_correct', e.target.checked)}
                                                            />
                                                            {option.is_correct && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className={`input flex-1 ${option.is_correct ? 'border-primary-500/50 bg-primary-500/5' : ''}`}
                                                            placeholder={`Option ${oIndex + 1} content...`}
                                                            value={option.option_text}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, 'option_text', e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="p-2 text-dark-text-secondary hover:text-error opacity-0 group-hover/option:opacity-100 transition-all"
                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-dark-text-secondary mt-4 flex items-center gap-2 italic">
                                                <div className="w-1 h-1 rounded-full bg-primary-500" />
                                                Mandatory: Select exactly one correct answer using the radio buttons above
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t border-dark-border">
                        <button
                            type="button"
                            className="btn btn-ghost px-10 py-4 text-base font-bold w-full sm:w-auto"
                            onClick={() => navigate('/admin')}
                        >
                            Discard Updates
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-12 py-4 text-base font-bold gap-3 w-full sm:w-auto shadow-primary-500/20"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving Progress...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Synchronize Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExam;
