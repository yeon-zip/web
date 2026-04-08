import searchResultBooks from "./searchResultBooks.json";

export type SearchResultBook = {
  author: string;
  bookId: string;
  coverColorFrom: string;
  coverColorTo: string;
  genre: string;
  title: string;
};

export async function getSearchResultBooks(): Promise<SearchResultBook[]> {
  return searchResultBooks;
}
