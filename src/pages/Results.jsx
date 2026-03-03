import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, CheckCircle, XCircle, Home } from "lucide-react";

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results;

    useEffect(() => {
        if (!results) navigate("/dashboard");
    }, [results, navigate]); // navigate is safe to include as a dependency in v6 [web:6]

    if (!results) return null;

    const { total_score, answers } = results;

    const correctCount = answers.filter((a) => a.is_correct).length;
    const totalQuestions = answers.length;
    const percentage = ((correctCount / totalQuestions) * 100).toFixed(1);

    const gradeInfo = useMemo(() => {
        const p = Number(percentage);
        if (p >= 90) return { grade: "A+", color: "green", message: "Outstanding!" };
        if (p >= 80) return { grade: "A", color: "green", message: "Excellent!" };
        if (p >= 70) return { grade: "B", color: "blue", message: "Good Job!" };
        if (p >= 60) return { grade: "C", color: "amber", message: "Fair" };
        return { grade: "F", color: "red", message: "Keep Practicing" };
    }, [percentage]);

    // Circle math (565 is ~ 2πr with r=90)
    // Using strokeDasharray to show partial circumference is a common SVG technique [web:5].
    const dash = (Number(percentage) / 100) * 565;

    const gradeBadgeClass =
        gradeInfo.color === "green"
            ? "bg-green-100 text-green-700 ring-green-200"
            : gradeInfo.color === "blue"
                ? "bg-blue-100 text-blue-700 ring-blue-200"
                : gradeInfo.color === "amber"
                    ? "bg-amber-100 text-amber-700 ring-amber-200"
                    : "bg-red-100 text-red-700 ring-red-200";

    const ringStrokeClass =
        gradeInfo.color === "green"
            ? "stroke-green-500"
            : gradeInfo.color === "blue"
                ? "stroke-blue-500"
                : gradeInfo.color === "amber"
                    ? "stroke-amber-500"
                    : "stroke-red-500";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="space-y-6">
                    {/* Header (glass) */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
                        <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center gap-2">
                            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                                <Trophy className="h-10 w-10 text-yellow-400" />
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight">Exam Completed!</h1>
                            <p className="text-slate-300">Here are your results</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Score Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
                            <div className="relative mx-auto grid h-56 w-56 place-items-center">
                                <svg viewBox="0 0 200 200" className="h-full w-full">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        fill="none"
                                        strokeWidth="12"
                                        className="stroke-slate-700"
                                    />
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="90"
                                        fill="none"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        strokeDasharray={`${dash} 565`}
                                        transform="rotate(-90 100 100)"
                                        className={ringStrokeClass}
                                    />
                                </svg>

                                <div className="absolute inset-0 grid place-items-center text-center">
                                    <div className="text-4xl font-bold tabular-nums">{percentage}%</div>
                                    <div
                                        className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ${gradeBadgeClass}`}
                                    >
                                        {gradeInfo.grade}
                                    </div>
                                </div>
                            </div>

                            <h3 className="mt-4 text-center text-xl font-semibold">{gradeInfo.message}</h3>
                        </div>

                        {/* Stats */}
                        <div className="lg:col-span-2 grid gap-6 sm:grid-cols-3">
                            <div className="rounded-2xl border flex flex-col  justify-center  border-white/10 bg-white/5 p-6 shadow-lg">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-500/15 ring-1 ring-green-500/20">
                                        <CheckCircle className="h-7 w-7 text-green-400" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="text-2xl font-bold tabular-nums">{correctCount}</div>
                                        <div className="text-slate-300 text-sm">Correct Answers</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border flex flex-col  justify-center  border-white/10 bg-white/5 p-6 shadow-lg">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-500/15 ring-1 ring-red-500/20">
                                        <XCircle className="h-7 w-7 text-red-400" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="text-2xl font-bold tabular-nums">
                                            {totalQuestions - correctCount}
                                        </div>
                                        <div className="text-slate-300 text-sm">Wrong Answers</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl flex flex-col  justify-center border border-white/10 bg-white/5 p-6 shadow-lg">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/15 ring-1 ring-blue-500/20">
                                        <Trophy className="h-7 w-7 text-blue-400" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="text-2xl font-bold tabular-nums">{total_score}</div>
                                        <div className="text-slate-300 text-sm">Total Score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Answer Review */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
                        <h3 className="text-xl font-semibold">Answer Review</h3>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {answers.map((answer, index) => {
                                const ok = answer.is_correct;
                                return (
                                    <div
                                        key={answer.question_id}
                                        className={`flex items-center justify-between rounded-xl border p-4 ${ok
                                                ? "border-green-500/20 bg-green-500/10"
                                                : "border-red-500/20 bg-red-500/10"
                                            }`}
                                    >
                                        <div className="font-semibold">Q{index + 1}</div>

                                        <div className="flex items-center gap-2">
                                            {ok ? (
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-400" />
                                            )}
                                            <span className={`text-sm ${ok ? "text-green-200" : "text-red-200"}`}>
                                                {ok ? "Correct" : "Incorrect"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center">
                        <button
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.99]"
                            onClick={() => navigate("/dashboard")}
                        >
                            <Home className="h-5 w-5" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
