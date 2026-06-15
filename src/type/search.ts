export type GetNearbyLibrariesParams = {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  cursor?: string;
  limit?: number;
};

export type NearbyLibraryItem = {
  libraryId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  homepageUrl: string | null;
  tel: string | null;
  distanceKm: number;
  openNow: boolean;
  bookmarked?: boolean;
};

export type GetNearbyLibrariesResponse = {
  hasNext: boolean;
  nextCursor: string | null;
  items: NearbyLibraryItem[];
};

export type GetNearbyBookAvailabilityParams = {
  isbn: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
  loanAvailable?: boolean;
  openNow?: boolean;
  cursor?: string;
  limit?: number;
};

export type NearbyBookAvailabilityItem = {
  libraryId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  homepageUrl: string | null;
  tel: string | null;
  distanceKm: number;
  openNow: boolean;
  loanAvailable: boolean;
  availabilityStatus?: string;
  bookmarked?: boolean;
};

export type GetNearbyBookAvailabilityResponse = {
  hasNext: boolean;
  nextCursor: string | null;
  items: NearbyBookAvailabilityItem[];
};

export type GetRelatedBooksParams = {
  query: string;
  cursor?: string;
  limit?: number;
};

export type GetBookDetailParams = {
  isbn: string;
};

export type BookVoteChoice = "up" | "down";

export type VoteSummary = {
  upCount: number;
  downCount: number;
  userChoice: BookVoteChoice | null;
};

export type BookDetail = {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
  publicationDate: string;
  coverImageUrl: string;
  bookmarked?: boolean;
  voteSummary?: VoteSummary;
};

export type RelatedBookItem = {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
  publicationDate: string;
  coverImageUrl: string;
  link: string | null;
  bookmarked?: boolean;
};

export type GetRelatedBooksResponse = {
  hasNext: boolean;
  nextCursor: string | null;
  items: RelatedBookItem[];
};

export type GetBookDetailResponse = BookDetail;

export type GetLibraryDetailParams = {
  libraryId: string;
};

export type LibraryOperatingHour = {
  weekday: number;
  openTime: string | null;
  closeTime: string | null;
  closed: boolean;
};

export type LibraryClosedRule = {
  ruleType: string;
  weekday: number | null;
  nthWeek: number | null;
  monthDay: number | null;
};

export type LibraryDetail = {
  libraryId: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  homepageUrl: string | null;
  tel: string | null;
  openNow: boolean;
  todayOperatingHour?: LibraryOperatingHour | null;
  weeklyOperatingHours: LibraryOperatingHour[];
  closedRules: LibraryClosedRule[];
  bookmarked?: boolean;
};

export type GetLibraryDetailResponse = LibraryDetail;

export type SearchResultBook = {
  author: string;
  bookId: string;
  coverColorFrom: string;
  coverColorTo: string;
  genre: string;
  title: string;
  coverImageUrl?: string;
  isbn?: string;
  publisher?: string;
  bookmarked?: boolean;
};

export type SearchResultLibrary = {
  isbn: string | null;
  bookTitle: string;
  distanceMeters: number;
  holdingStatus: string;
  holidayInfo: string;
  libraryId: string;
  libraryName: string;
  loanStatus: "대출 가능" | "대출 불가";
  location: string;
  operatingHours: string;
  operatingStatus: "운영중" | "운영 종료";
  bookmarked?: boolean;
};
