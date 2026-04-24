export type SearchRadiusKm = 5 | 15 | 30;

export type SearchResultBook = {
  author: string;
  bookId: string;
  coverColorFrom: string;
  coverColorTo: string;
  genre: string;
  title: string;
};

export type SearchResultLibrary = {
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
};
