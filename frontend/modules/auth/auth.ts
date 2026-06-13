import { reactive } from 'vue'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'PRODUCT_OWNER' | 'DEVELOPER'
  team_id: number | null
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: AuthUser
}

const TOKEN_KEY = 'pm_token'
const USER_KEY = 'pm_user'
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const authState = reactive<{
  token: string | null
  user: AuthUser | null
}>({
  token: null,
  user: null,
})

function saveSession(token: string, user: AuthUser) {
  authState.token = token
  authState.user = user
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearSession() {
  authState.token = null
  authState.user = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function extractErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === 'object' && 'error' in data && typeof (data as { error?: unknown }).error === 'string') {
    return (data as { error: string }).error
  }
  return fallback
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401) clearSession()
    throw new Error(extractErrorMessage(data, `Request failed with status ${response.status}`))
  }

  return data as T
}

export function restoreAuthSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  const userRaw = localStorage.getItem(USER_KEY)
  if (!token || !userRaw) return
  try {
    authState.token = token
    authState.user = JSON.parse(userRaw) as AuthUser
  } catch {
    clearSession()
  }
}

export function isAuthenticated() {
  return Boolean(authState.token)
}

export function getAuthToken() {
  return authState.token
}

export async function login(payload: LoginPayload) {
  const data = await request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  saveSession(data.token, data.user)
  return data
}

export async function register(payload: RegisterPayload) {
  return request<{ message: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchMe() {
  const token = getAuthToken()
  if (!token) throw new Error('No auth token')

  const user = await request<AuthUser>('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
  authState.user = user
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  clearSession()
}

