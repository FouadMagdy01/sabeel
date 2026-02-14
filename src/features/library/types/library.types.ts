export interface FavoriteSura {
  id: number;
  name: string;
  translation: string;
  versesCount: number;
}

export interface FavoriteReciter {
  id: string;
  name: string;
  surasCount: number;
  nationality: string;
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

export interface FavoriteAya {
  id: string;
  suraName: string;
  suraNumber: number;
  ayaNumber: number;
  arabicText: string;
  translation: string;
}

export interface DownloadedSura {
  id: number;
  name: string;
  translation: string;
  versesCount: number;
  fileSize: string;
}

export interface DownloadedReciter {
  id: string;
  name: string;
  surasCount: number;
  nationality: string;
  totalSize: string;
}

export interface DownloadedAya {
  id: string;
  suraName: string;
  suraNumber: number;
  ayaNumber: number;
  arabicText: string;
  translation: string;
}
