type SearchListPageProps = {
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function SearchListPage({
  searchParams,
}: SearchListPageProps) {
  const { query = "" } = await searchParams;

  return (
    <>
      <div>검색 페이지</div>
      <div>검색어: {query || "없음"}</div>
    </>
  );
}
