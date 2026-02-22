# QuizMaster Frontend

A modern, beautiful quiz management system built with React and Vite.

## Features

### For Students
- 📚 Browse available exams
- ⏱️ Take timed exams with auto-save
- 📊 View instant results with detailed analytics
- 📜 Track exam history and performance

### For Admins/Teachers
- ✏️ Create and manage exams
- ❓ Add multiple-choice questions with ease
- 📝 Publish/unpublish exams
- 👥 View student submissions

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - API requests
- **Lucide React** - Icons
- **CSS3** - Styling with modern design system

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/      # Reusable components
│   └── Navbar.jsx
├── contexts/        # React contexts
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── StudentDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── CreateExam.jsx
│   ├── TakeExam.jsx
│   └── Results.jsx
├── services/        # API services
│   └── api.js
├── App.jsx          # Main app component
├── App.css          # Component styles
├── index.css        # Global styles & design system
└── main.jsx         # Entry point
```

## API Configuration

The frontend connects to the backend API at `http://localhost:8000`. To change this:

1. Open `src/services/api.js`
2. Update the `API_BASE_URL` constant

## User Roles

### Student
- Can view and take published exams
- Can view their exam history and results
- Cannot create or manage exams

### Admin
- Can create, edit, and delete exams
- Can add questions to exams
- Can publish/unpublish exams
- Can view all submissions

## Design System

The application uses a modern design system with:
- **Color Palette**: Primary (Blue), Secondary (Purple), Success, Warning, Error
- **Typography**: Inter font family
- **Components**: Buttons, Cards, Inputs, Badges, etc.
- **Animations**: Smooth transitions and micro-interactions
- **Dark Theme**: Premium dark mode design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Highlights

### Authentication
- JWT-based authentication
- Role-based access control
- Automatic token refresh
- Secure password handling

### Exam Taking
- Real-time timer with auto-submit
- Auto-save answers
- Progress tracking
- Responsive design for mobile

### Results
- Circular progress visualization
- Grade calculation
- Detailed answer review
- Performance statistics

### Admin Panel
- Intuitive exam creation
- Dynamic question builder
- Drag-and-drop option management
- Bulk operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.
