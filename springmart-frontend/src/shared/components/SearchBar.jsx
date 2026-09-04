import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import styles from "../../styles/components/SearchBar.module.scss";

function SearchBar({ searchQuery = "", onSearch, onClear }) {
    const [query, setQuery] = useState(searchQuery || "");

    useEffect(() => {
        setQuery(searchQuery || "");
    }, [searchQuery]);

    function handleSubmit(event) {
        event.preventDefault();
        onSearch(query.trim());
    }

    function handleClear() {
        setQuery("");
        onClear?.();
        onSearch("");
    }

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            handleClear();
        }
    }

    return (
        <form className={styles.searchBar} onSubmit={handleSubmit} role="search">
            <FiSearch className={styles.searchIcon} />
            <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search products"
                className={styles.searchInput}
            />
            {query.length > 0 && (
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={handleClear}
                    title="Clear search"
                    aria-label="Clear search"
                >
                    <FiX />
                </button>
            )}
        </form>
    );
}

export default SearchBar;