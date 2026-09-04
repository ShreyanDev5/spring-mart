import React, { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import ProductCard from "../../features/products/components/ProductCard";
import SkeletonCard from "../../features/products/components/SkeletonCard";
import LoadingMessage from "../../shared/components/LoadingMessage";
import styles from "../../styles/components/home/Products.module.scss";

const Products = React.forwardRef(({ 
  products, 
  searchQuery = "", 
  onClearSearch, 
  resetToken = 0, 
  loading, 
  error, 
  imageVersion, 
  onProductDelete, 
  onRetry 
}, ref) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Reset selected category to "All" whenever the app state is reset (e.g. clicking logo)
  useEffect(() => {
    setSelectedCategory("All");
  }, [resetToken]);

  // If a search query is active and "All" is selected, omit any categories that contain no matching items
  const categories = useMemo(() => {
    if (!products || products.length === 0) return ["All"];
    const unique = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ["All", ...unique];
  }, [products]);

  // Filter products by the currently selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  return (
    <section ref={ref} className={styles.productsSection}>
      {/* Active Search Banner - only shown when searching */}
      {Boolean(searchQuery.trim()) && !loading && !error && filteredProducts.length > 0 && (
        <div className={styles.activeSearchBar}>
          <div className={styles.activeSearchText}>
            <span>Showing results for <strong>"{searchQuery}"</strong></span>
            {selectedCategory !== "All" && (
              <span> in <strong>{selectedCategory}</strong></span>
            )}
            <span className={styles.resultCount}>
              ({filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"})
            </span>
          </div>
          <div className={styles.activeSearchActions}>
            {selectedCategory !== "All" && products.length > filteredProducts.length && (
              <button 
                type="button" 
                className={styles.secondaryActionBtn}
                onClick={() => setSelectedCategory("All")}
              >
                View in All Categories ({products.length})
              </button>
            )}
            <button 
              type="button" 
              className={styles.clearSearchBtn}
              onClick={onClearSearch}
              title="Clear search"
            >
              Clear search <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Category filters only appear upon active search on the Home page */}
      {Boolean(searchQuery.trim()) && !loading && !error && categories.length > 1 && (
        <div className={styles.categoryFilters} role="tablist" aria-label="Filter search results by category">
          {categories.map((category) => {
            const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterPill} ${isActive ? styles.activePill : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.productGrid}>
        {loading ? (
          <>
            <div className={styles.loadingWrapper}>
              <div className={styles.loadingContainer}>
                <LoadingMessage 
                  message={searchQuery ? `Searching for "${searchQuery}"...` : "Waking up backend server..."} 
                  subtitle={searchQuery ? "Filtering catalog items..." : "Render free tier spins down when idle • First load takes 60–120s"}
                  onRetry={onRetry}
                />
              </div>
            </div>
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </>
        ) : error ? (
          <div className={styles.errorState}>
            <p>Failed to load products. Please try again.</p>
            {onRetry && (
              <button className={styles.retryButton} onClick={onRetry}>
                Retry
              </button>
            )}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            {searchQuery ? (
              products.length > 0 ? (
                <>
                  <h3>No "{searchQuery}" found in {selectedCategory}</h3>
                  <p>We found {products.length} matching product{products.length === 1 ? "" : "s"} in other categories.</p>
                  <div className={styles.emptyStateActions}>
                    <button 
                      type="button" 
                      className={styles.primaryActionBtn} 
                      onClick={() => setSelectedCategory("All")}
                    >
                      View in All Categories ({products.length})
                    </button>
                    <button 
                      type="button" 
                      className={styles.outlineActionBtn} 
                      onClick={onClearSearch}
                    >
                      Clear search
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>No products found for "{searchQuery}"</h3>
                  <p>We couldn't find any products in our catalog matching your search across all categories.</p>
                  <div className={styles.emptyStateActions}>
                    <button 
                      type="button" 
                      className={styles.primaryActionBtn} 
                      onClick={onClearSearch}
                    >
                      Clear search & view all products
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <h3>No products in "{selectedCategory}"</h3>
                <p>There are no products listed in this category at this time.</p>
                {selectedCategory !== "All" && (
                  <div className={styles.emptyStateActions}>
                    <button 
                      type="button" 
                      className={styles.primaryActionBtn} 
                      onClick={() => setSelectedCategory("All")}
                    >
                      Show All Categories
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              imageVersion={imageVersion}
              onProductDelete={onProductDelete}
            />
          ))
        )}
      </div>
    </section>
  );
});

export default Products;
