import axios from 'axios';

const BASE_URL = 'http://api.quran-tafseer.com';

export type TafseerEdition = {
  id: number;
  name: string;
  language: string;
  author: string;
  book_name: string;
};

export type TafseerResponse = {
  tafseer_id: number;
  tafseer_name: string;
  ayah_number: number;
  text: string;
};

export async function fetchTafseerList(): Promise<TafseerEdition[]> {
  const response = await axios.get<TafseerEdition[]>(`${BASE_URL}/tafseer/`);
  return response.data.filter((edition) => edition.id !== 1);
}

export async function fetchTafseerForAyah(
  tafseerId: number,
  surahId: number,
  ayahNumber: number
): Promise<TafseerResponse> {
  const response = await axios.get<TafseerResponse>(
    `${BASE_URL}/tafseer/${String(tafseerId)}/${String(surahId)}/${String(ayahNumber)}`
  );
  return response.data;
}
