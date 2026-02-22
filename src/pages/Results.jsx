import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle, XCircle, Home } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results;

    if (!results) {
        navigate('/dashboard');
        return null;
    }

    const { total_score, answers } = results;
    const correctCount = answers.filter((a) => a.is_correct).length;
    const totalQuestions = answers.length;
    const percentage = ((correctCount / totalQuestions) * 100).toFixed(1);

    const getGrade = () => {
        if (percentage >= 90) return { grade: 'A+', color: 'success', message: 'Outstanding!' };
        if (percentage >= 80) return { grade: 'A', color: 'success', message: 'Excellent!' };
        if (percentage >= 70) return { grade: 'B', color: 'primary', message: 'Good Job!' };
        if (percentage >= 60) return { grade: 'C', color: 'warning', message: 'Fair' };
        return { grade: 'F', color: 'danger', message: 'Keep Practicing' };
    };

    const gradeInfo = getGrade();

    return (
        <div className="results-page">
            <div className="container">
                <div className="results-container fade-in">
                    <div className="results-header card-glass">
                        <div className="trophy-icon">
                            <Trophy size={64} />
                        </div>
                        <h1>Exam Completed!</h1>
                        <p>Here are your results</p>
                    </div>

                    <div className="results-summary">
                        <div className="score-card card">
                            <div className="score-circle">
                                <svg viewBox="0 0 200 200">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        fill="none"
                                        stroke="var(--dark-border)"
                                        strokeWidth="12"
                                    />
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        fill="none"
                                        stroke={`var(--${gradeInfo.color}-500)`}
                                        strokeWidth="12"
                                        strokeDasharray={`${(percentage / 100) * 565} 565`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 100 100)"
                                    />
                                </svg>
                                <div className="score-content">
                                    <div className="score-percentage">{percentage}%</div>
                                    <div className={`score-grade badge-${gradeInfo.color}`}>{gradeInfo.grade}</div>
                                </div>
                            </div>
                            <h3>{gradeInfo.message}</h3>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box card">
                                <div className="stat-icon success">
                                    <CheckCircle size={32} />
                                </div>
                                <div className="stat-value">{correctCount}</div>
                                <div className="stat-label">Correct Answers</div>
                            </div>

                            <div className="stat-box card">
                                <div className="stat-icon danger">
                                    <XCircle size={32} />
                                </div>
                                <div className="stat-value">{totalQuestions - correctCount}</div>
                                <div className="stat-label">Wrong Answers</div>
                            </div>

                            <div className="stat-box card">
                                <div className="stat-icon primary">
                                    <Trophy size={32} />
                                </div>
                                <div className="stat-value">{total_score}</div>
                                <div className="stat-label">Total Score</div>
                            </div>
                        </div>
                    </div>

                    <div className="answers-review card">
                        <h3>Answer Review</h3>
                        <div className="answers-list">
                            {answers.map((answer, index) => (
                                <div
                                    key={answer.question_id}
                                    className={`answer-item ${answer.is_correct ? 'correct' : 'incorrect'}`}
                                >
                                    <div className="answer-number">Q{index + 1}</div>
                                    <div className="answer-icon">
                                        {answer.is_correct ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <XCircle size={20} />
                                        )}
                                    </div>
                                    <div className="answer-status">
                                        {answer.is_correct ? 'Correct' : 'Incorrect'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="results-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                            <Home size={20} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
