const API_BASE = '/api';

export const NEWSPOST_GENRES = ['Politic', 'Business', 'Sport', 'Other'] as const;
export type NewspostGenre = (typeof NEWSPOST_GENRES)[number];

export interface NewspostAuthor {
  id: number;
  email: string;
}

export interface NewspostData {
  id?: number;
  title: string;
  text: string;
  genre: NewspostGenre;
  isPrivate: boolean;
  createDate?: string;
  author?: NewspostAuthor;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

function getAuthHeaders(headers: HeadersInit = {}): HeadersInit {
  const storedToken =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('authToken') || window.localStorage.getItem('token')
      : null;

  if (!storedToken) {
    return headers;
  }

  const authToken = storedToken.startsWith('Bearer ') ? storedToken : `Bearer ${storedToken}`;
  return {
    ...headers,
    Authorization: authToken
  };
}

export async function getAllNewsposts(params: PaginationParams = {}): Promise<NewspostData[]> {
  const page = typeof params.page === 'number' && Number.isInteger(params.page) && params.page >= 0 ? params.page : 0;
  const size = typeof params.size === 'number' && Number.isInteger(params.size) && params.size > 0 ? params.size : 10;
  const response = await fetch(`${API_BASE}/newsposts?page=${page}&size=${size}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch newsposts');
  }

  return response.json();
}

export async function getNewspostById(id: number): Promise<NewspostData> {
  const response = await fetch(`${API_BASE}/newsposts/${id}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch newspost');
  }

  return response.json();
}

export async function createNewspost(data: Omit<NewspostData, 'id' | 'createDate' | 'author'>): Promise<NewspostData> {
  const response = await fetch(`${API_BASE}/newsposts`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create newspost');
  }

  return response.json();
}

export async function updateNewspost(
  id: number,
  data: Partial<Omit<NewspostData, 'id' | 'createDate' | 'author'>>
): Promise<NewspostData> {
  const response = await fetch(`${API_BASE}/newsposts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to update newspost');
  }

  return response.json();
}

export async function deleteNewspost(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/newsposts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to delete newspost');
  }
}

