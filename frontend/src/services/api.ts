const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (!token) throw new Error('Não autenticado');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Erro ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'CLOSED';

export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  label: string | null;
}

export interface DaySchedule {
  date: string;
  isClosed: boolean;
  closedReason: string | null;
  slots: Slot[];
}

export interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string; role: string; };
}

// ── Public ────────────────────────────────────────────────────────────────────

export const scheduleService = {
  getWeek: (startDate?: string): Promise<DaySchedule[]> => {
    const qs = startDate ? `?startDate=${startDate}` : '';
    return request(`/schedules/week${qs}`);
  },

  getDay: (date: string): Promise<Slot[]> => {
    return request(`/schedules/day/${date}`);
  },
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => localStorage.removeItem('admin_token'),

  saveToken: (token: string) => localStorage.setItem('admin_token', token),

  isAuthenticated: () => !!getToken(),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface CreateSlotPayload {
  date: string;
  startTime: string;
  endTime: string;
  status?: SlotStatus;
  label?: string;
}

export interface BulkCreatePayload {
  date: string;
  slots: Array<{ startTime: string; endTime: string; status?: SlotStatus; label?: string; }>;
}

export const adminService = {
  createSlot: (data: CreateSlotPayload): Promise<Slot> =>
    request('/admin/schedules', { method: 'POST', body: JSON.stringify(data) }, true),

  bulkCreate: (data: BulkCreatePayload) =>
    request('/admin/schedules/bulk', { method: 'POST', body: JSON.stringify(data) }, true),

  updateSlot: (id: string, data: { status?: SlotStatus; label?: string; }): Promise<Slot> =>
    request(`/admin/schedules/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),

  bookSlot: (id: string): Promise<Slot> =>
    request(`/admin/schedules/${id}/book`, { method: 'PATCH' }, true),

  deleteSlot: (id: string): Promise<void> =>
    request(`/admin/schedules/${id}`, { method: 'DELETE' }, true),

  setDayStatus: (date: string, isClosed: boolean, reason?: string) =>
    request('/admin/day-config', {
      method: 'POST',
      body: JSON.stringify({ date, isClosed, reason }),
    }, true),
};