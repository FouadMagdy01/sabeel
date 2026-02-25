export interface SunnahCollectionName {
  lang: string;
  title: string;
}

export interface SunnahCollection {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  collection: SunnahCollectionName[];
  totalHadith: number;
  totalAvailableHadith: number;
}

export interface SunnahBookName {
  lang: string;
  name: string;
}

export interface SunnahBook {
  bookNumber: string;
  book: SunnahBookName[];
  hadithStartNumber: number;
  hadithEndNumber: number;
  numberOfHadith: number;
}

export interface SunnahHadithGrade {
  graded_by: string;
  grade: string;
}

export interface SunnahHadithBody {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  urn: number;
  body: string;
  grades: SunnahHadithGrade[];
}

export interface SunnahHadith {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: SunnahHadithBody[];
}

export interface CollectionsResponse {
  data: SunnahCollection[];
  total: number;
  limit: number;
  next: number | null;
  previous: number | null;
}

export interface BooksResponse {
  data: SunnahBook[];
  total: number;
  limit: number;
  next: number | null;
  previous: number | null;
}

export interface HadithsResponse {
  data: SunnahHadith[];
  total: number;
  limit: number;
  next: number | null;
  previous: number | null;
}
