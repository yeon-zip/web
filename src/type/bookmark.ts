export type BookmarkedLibraryItem = {
  libraryId: number;
  name: string;
  address: string;
};

export type BookmarkedLibrariesResponse = {
  items: BookmarkedLibraryItem[];
};

export type BookmarkedBookItem = {
  isbn: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
};

export type BookmarkedBooksResponse = {
  items: BookmarkedBookItem[];
};
