import { createOptionalAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type {
  GetRelatedBooksParams,
  GetRelatedBooksResponse,
  SearchResultBook,
} from "@/type/search";

type GetRelatedBooksOptions = {
  endpoint?: string;
};

const BOOK_CARD_GRADIENTS = [
  ["#2f6dff", "#8fb5ff"],
  ["#0f8d77", "#8ce6d4"],
  ["#444ce7", "#a2b2ff"],
  ["#f97316", "#fdba74"],
  ["#0f172a", "#64748b"],
  ["#0b7285", "#66d9e8"],
] as const;

function mapRelatedBookToSearchResultBook(
  book: GetRelatedBooksResponse["items"][number],
  index: number,
): SearchResultBook {
  const [coverColorFrom, coverColorTo] =
    BOOK_CARD_GRADIENTS[index % BOOK_CARD_GRADIENTS.length];

  return {
    author: book.author,
    bookId: book.isbn,
    coverColorFrom,
    coverColorTo,
    genre: book.publisher || "도서",
    title: book.title,
    coverImageUrl: book.coverImageUrl,
    isbn: book.isbn,
    bookmarked: book.bookmarked,
    publisher: book.publisher,
  };
}

export async function getRelatedBooks(
  { query, cursor, limit = 10 }: GetRelatedBooksParams,
  options?: GetRelatedBooksOptions,
): Promise<SearchResultBook[]> {
  const endpoint =
    options?.endpoint ?? buildPolarisApiUrl("/api/v1/books/search");

  const data = await httpClient.get<GetRelatedBooksResponse>(endpoint, {
    headers: createOptionalAuthHeaders(),
    params: {
      query,
      cursor,
      limit,
    },
  });

  return data.items.map(mapRelatedBookToSearchResultBook);
}
