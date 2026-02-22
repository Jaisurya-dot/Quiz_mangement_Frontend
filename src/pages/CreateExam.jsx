import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examRoomAPI, questionAPI } from '../services/api';
import { Plus, Trash2, Save, AlertCircle, BookOpen } from 'lucide-react';

const CreateExam = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [examData, setExamData] = useState({
        title: '',
        description: '',
        duration_minutes: 60,
        start_time: '',
        end_time: '',
    });

    const [questions, setQuestions] = useState([
        {
            question_text: '',
            marks: 1,
            order_index: 0,
            options: [
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ],
        },
    ]);

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

    const removeQuestion = (index) => {
        if (questions.length === 1) {
            alert('You must have at least one question');
            return;
        }
        setQuestions(questions.filter((_, i) => i !== index));
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

        setLoading(true);

        try {
            const total_marks = questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);

            const examPayload = {
                ...examData,
                duration_minutes: parseInt(examData.duration_minutes) || 60,
                total_marks,
                is_published: false,
            };

            const examResponse = await examRoomAPI.create(examPayload);
            const examId = examResponse.data.id;

            for (const question of questions) {
                await questionAPI.create(examId, {
                    ...question,
                    marks: parseInt(question.marks) || 1,
                    order_index: parseInt(question.order_index) || 0,
                });
            }

            alert('Exam created successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error creating exam:', error);
            const errorMessage = error.response?.data?.detail
                ? (Array.isArray(error.response.data.detail)
                    ? error.response.data.detail.map(e => e.msg).join(', ')
                    : error.response.data.detail)
                : 'Failed to create exam';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight">Create New Exam</h1>
                        <p className="text-dark-text-secondary text-lg">Fill in the details below to create a new exam room</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="btn btn-ghost px-6 py-2.5"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 mb-8 bg-error/10 border border-error/20 rounded-xl text-error animate-in zoom-in-95 duration-200">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 pb-24">
                    {/* Exam Details Card */}
                    <div className="card p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <div className="flex items-center gap-3 border-b border-dark-border pb-4">
                            <Save className="text-primary-400" size={24} />
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Exam Details</h2>
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
                                    className="input"
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
                                    className="input min-h-[120px]"
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
                                className="btn btn-secondary gap-2 py-3 px-6"
                                onClick={addQuestion}
                            >
                                <Plus size={20} />
                                Add Question
                            </button>
                        </div>

                        <div className="space-y-8">
                            {questions.map((question, qIndex) => (
                                <div key={qIndex} className="card p-8 group relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                                        {qIndex + 1}
                                    </div>
                                    <div className="flex justify-between items-start mb-8 ml-8">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Question Content</h3>
                                        <button
                                            type="button"
                                            className="p-2 text-dark-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-all"
                                            onClick={() => removeQuestion(qIndex)}
                                            title="Remove question"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-8 ml-0 md:ml-8">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                            <div className="md:col-span-3 space-y-2">
                                                <label className="text-sm font-bold text-dark-text ml-1">Question Text</label>
                                                <textarea
                                                    className="input min-h-[100px]"
                                                    placeholder="Enter your question here..."
                                                    value={question.question_text}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark-text ml-1">Marks</label>
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
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-dark-text-secondary uppercase tracking-widest">Options</label>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost py-2 px-4 text-xs gap-2"
                                                    onClick={() => addOption(qIndex)}
                                                >
                                                    <Plus size={16} />
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
                                                            placeholder={`Option ${oIndex + 1}`}
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
                                            <p className="text-xs text-dark-text-secondary mt-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                                Click the radio button to mark the correct answer
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
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-12 py-4 text-base font-bold gap-3 w-full sm:w-auto shadow-primary-500/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Exam...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Create Exam Room
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExam;
