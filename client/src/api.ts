const API_BASE = '/api';

export interface NewspostData {
    id?:number;
    title:string;
    text:string;
    createDate?:string;
}

export async function getAllNewsposts(): Promise<NewspostData[]> {
    const response = await fetch(`${API_BASE}/newsposts`);
    if (!response.ok)throw new Error ('Failed to fetch newsposts');
    return response.json();
}

export async function getNewspostById(id:number): Promise<NewspostData>{
    const response = await fetch(`${API_BASE}/newsposts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch newspost');
    return response.json();
}

export async function createNewspost(data: Omit<NewspostData, 'id'>): Promise<NewspostData> {
    const response = await fetch(`${API_BASE}/newsposts`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create newspost');
    return response.json();
}

export async function updateNewspost(id:number, data: Partial<NewspostData>): Promise<NewspostData> {
    const response = await fetch(`${API_BASE}/newsposts/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update newspost');
    return response.json();
}

export async function deleteNewspost(id:number): Promise<void>{
    const response = await fetch (`${API_BASE}/newsposts/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete newspost');
}

