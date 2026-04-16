import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePosts } from "../hooks";
import { useDebounce } from "../hooks";
import PostCard from "../components/blog/PostCard";
import { Spinner, SearchBar, Pagination, EmptyState } from "../components/ui";

const CATEGORIES = ["All", "Technology", "Lifestyle", "Travel", "Food", "Health", "Business", "Education"];
const SORT_OPTIONS = [
  { label: "Latest", value: "-createdAt" },
  { label: "Most Views", value: "-views" },
  { label: "Most Liked", value: "-likes" },
  { label: "Oldest", value: "createdAt" },
];

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "-createdAt");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 500);

  const queryParams = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category !== "All" && { category }),
    sort,
    page,
    limit: 9,
  };

  const { posts, loading, pagination } = usePosts(queryParams);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category !== "All") params.category = category;
    if (sort !== "-createdAt") params.sort = sort;
    if (page > 1) params.page = page;
    setSearchParams(params);
  }, [debouncedSearch, category, sort, page]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="explore-page">
      {/* Header */}
      <div className="explore-header">
        <h1 className="explore-title">Explore Articles</h1>
        <p className="explore-subtitle">Discover stories from thousands of writers</p>
      </div>

      {/* Filters */}
      <div className="explore-filters">
        <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />

        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${category === cat ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="sort-wrapper">
          <label className="sort-label">Sort by:</label>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="results-count">
          {pagination.total} article{pagination.total !== 1 ? "s" : ""} found
          {category !== "All" && ` in ${category}`}
          {debouncedSearch && ` for "${debouncedSearch}"`}
        </p>
      )}

      {/* Posts Grid */}
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No articles found"
          message="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="posts-grid">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default ExplorePage;
