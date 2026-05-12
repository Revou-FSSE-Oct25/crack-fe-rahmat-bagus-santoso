export interface LoginResponse {
  message: string;
  accessToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PARENT' | 'ADMIN';
  createdAt: string;
}

export interface Child {
  id: string;
  name: string;
  avatar: string | null;
  age: number;
  parentId: string;
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
  badge: Badge | null;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  orderNumber: number;
  moduleId: string;
}

export interface QuizOption {
  id: string;
  optionText: string;
  quizId: string;
}

export interface Quiz {
  id: string;
  question: string;
  explanation: string | null;
  orderNumber: number;
  points: number;
  lessonId: string;
  options: QuizOption[];
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  moduleId: string;
}

export interface SubmitResponse {
  isCorrect: boolean;
  earnedPoints: number;
  explanation: string | null;
  badge: Badge | null;
}

export interface ModuleProgress {
  id: string;
  completedQuizzes: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  totalPoints: number;
  childId: string;
  moduleId: string;
}

// Request bodies
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateChildRequest {
  name: string;
  age: number;
  avatar?: string;
}

export interface SubmitRequest {
  selectedOptionId: string;
}
