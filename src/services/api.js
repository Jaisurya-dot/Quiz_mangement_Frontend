import axios from 'axios';

const API_BASE_URL = 'https://backend-3-7fjr.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Exam Room API
export const examRoomAPI = {
    getAll: (publishedOnly = false) => api.get('/exam-rooms', { params: { published_only: publishedOnly } }),
    getById: (id) => api.get(`/exam-rooms/${id}`),
    getMyExams: () => api.get('/exam-rooms/my-exams'),
    create: (data) => api.post('/exam-rooms', data),
    update: (id, data) => api.put(`/exam-rooms/${id}`, data),
    delete: (id) => api.delete(`/exam-rooms/${id}`),
    publish: (id) => api.post(`/exam-rooms/${id}/publish`),
};

// Question API
export const questionAPI = {
    getByExamRoom: (examRoomId) => api.get(`/questions/exam-room/${examRoomId}`),
    getById: (id) => api.get(`/questions/${id}`),
    create: (examRoomId, data) => api.post(`/questions/exam-room/${examRoomId}`, data),
    update: (id, data) => api.put(`/questions/${id}`, data),
    delete: (id) => api.delete(`/questions/${id}`),
    createOption: (questionId, data) => api.post(`/questions/${questionId}/options`, data),
    updateOption: (optionId, data) => api.put(`/questions/options/${optionId}`, data),
    deleteOption: (optionId) => api.delete(`/questions/options/${optionId}`),
};

// Submission API
export const submissionAPI = {
    start: (examRoomId) => api.post('/submissions/start', { exam_room_id: examRoomId }),
    getById: (id) => api.get(`/submissions/${id}`),
    saveAnswer: (submissionId, data) => api.post(`/submissions/${submissionId}/answers`, data),
    submit: (submissionId) => api.post(`/submissions/${submissionId}/submit`),
    getMyHistory: () => api.get('/submissions/my-history'),
    getExamRoomSubmissions: (examRoomId) => api.get(`/submissions/exam-room/${examRoomId}/submissions`),
};

export default api;
