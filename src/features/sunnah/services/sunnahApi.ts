import type { BooksResponse, CollectionsResponse, HadithsResponse } from '../types';

const BASE_URL = 'https://api.sunnah.com/v1';
const API_KEY = process.env.EXPO_PUBLIC_SUNNAH_API_KEY ?? '';

const headers = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json',
};

export async function fetchCollections(): Promise<CollectionsResponse> {
  const response = await fetch(`${BASE_URL}/collections?limit=100`, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch collections: ${response.status}`);
  }
  return response.json() as Promise<CollectionsResponse>;
}

export async function fetchBooks(collectionName: string): Promise<BooksResponse> {
  const response = await fetch(`${BASE_URL}/collections/${collectionName}/books?limit=100`, {
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status}`);
  }
  return response.json() as Promise<BooksResponse>;
}

export async function fetchHadiths(
  collectionName: string,
  bookNumber: string,
  page: number
): Promise<HadithsResponse> {
  const response = await fetch(
    `${BASE_URL}/collections/${collectionName}/books/${bookNumber}/hadiths?page=${page}&limit=20`,
    { headers }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch hadiths: ${response.status}`);
  }
  return response.json() as Promise<HadithsResponse>;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
