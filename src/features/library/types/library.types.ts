export interface FavoriteSura {
  id: number;
  reciterId: number;
  moshafId: number;
  surahId: number;
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
  server: string;
  surahList: string;
  createdAt: number;
}

export interface FavoriteReciter {
  id: number;
  reciterId: number;
  moshafId: number;
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
  server: string;
  surahList: string;
  surahTotal: number;
  createdAt: number;
}

export interface DownloadedSura {
  id: number;
  reciterId: number;
  moshafId: number;
  surahId: number;
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
  server: string;
  surahList: string;
  filePath: string;
  fileSize: number;
  createdAt: number;
}

export interface DownloadedReciter {
  reciterId: number;
  moshafId: number;
  reciterNameAr: string;
  reciterNameEn: string;
  moshafNameAr: string;
  moshafNameEn: string;
  server: string;
  surahList: string;
  surasCount: number;
  totalSize: number;
}

export interface FeaturedReciter {
  id: string;
  name: string;
  style: string;
  isFeatured: boolean;
}

export interface RecommendedReciter {
  id: string;
  name: string;
  surasAvailable: number;
  isStarred: boolean;
}
