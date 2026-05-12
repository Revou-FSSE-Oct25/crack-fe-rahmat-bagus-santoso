const BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api/v1';

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const result = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!result.ok) {
    const body = await result.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${result.status}`);
  }

  if (result.status === 204) return undefined as T;

  return result.json() as Promise<T>;
}


import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Child,
  CreateChildRequest,
  Module,
  Lesson,
  Quiz,
  SubmitRequest,
  SubmitResponse,
  ModuleProgress,
} from '@/types/types';

export const authApi = {
  register: (body: RegisterRequest) =>
    apiFetch<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: LoginRequest) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  logout: () =>
    apiFetch<void>('/auth/logout', { method: 'POST' }),
};


export const userApi = {
  getProfile: () => apiFetch<User>('/user/profile'),
};


export const childrenApi = {
  create: (body: CreateChildRequest) =>
    apiFetch<Child>('/children', { method: 'POST', body: JSON.stringify(body) }),

  getAll: () => apiFetch<Child[]>('/children'),

  getOne: (childId: string) => apiFetch<Child>(`/children/${childId}`),

  access: (childId: string, pin?: string) =>
    apiFetch<Child>(`/children/${childId}/access`, {
      method: 'POST',
      body: JSON.stringify(pin ? { pin } : {}),
    }),

  getProgress: (childId: string) =>
    apiFetch<ModuleProgress[]>(`/children/${childId}/progress`),

  getQuizzesForLesson: (childId: string, lessonId: string) =>
    apiFetch<Quiz[]>(`/children/${childId}/lessons/${lessonId}/quizzes`),
};


export const modulesApi = {
  getAll: (search?: string) =>
    apiFetch<Module[]>(`/modules${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getOne: (moduleId: string) => apiFetch<Module>(`/modules/${moduleId}`),

  getLessons: (moduleId: string) =>
    apiFetch<Lesson[]>(`/modules/${moduleId}/lessons`),
};


export const lessonsApi = {
  getOne: (lessonId: string) => apiFetch<Lesson>(`/lessons/${lessonId}`),
};


export const submissionsApi = {
  submit: (
    childId: string,
    lessonId: string,
    quizId: string,
    body: SubmitRequest
  ) =>
    apiFetch<SubmitResponse>(
      `/children/${childId}/lessons/${lessonId}/quizzes/${quizId}/submit`,
      { method: 'POST', body: JSON.stringify(body) }
    ),
};
