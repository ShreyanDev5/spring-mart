// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { Hero } from "../components/home";
import Products from "../components/home/Products";
import { getFeaturedProducts, searchProducts } from "../features/products/api";

function Home({ searchQuery = "", onClearSearch, resetToken = 0, imageVersion, refreshTrigger = 0 }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadToken, setReloadToken] = useState(0);
    const productsSectionRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function loadProducts(retryCount = 0) {
            setLoading(true);
            setError("");

            try {
                const nextProducts = searchQuery.trim()
                    ? await searchProducts(searchQuery)
                    : await getFeaturedProducts(12);

                if (isMounted) {
                    setProducts(nextProducts);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    // Retry on network errors or 5xx server boot errors
                    if (!err.status || err.status >= 500) {
                        setTimeout(() => {
                            if (isMounted) {
                                loadProducts(retryCount + 1);
                            }
                        }, 8000);
                    } else {
                        setError("Could not load products.");
                        setProducts([]);
                        setLoading(false);
                    }
                }
            }
        }

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, [refreshTrigger, reloadToken, searchQuery]);

    function handleReload() {
        setReloadToken((currentToken) => currentToken + 1);
    }

    useEffect(() => {
        if (!searchQuery) {
            return undefined;
        }

        const scrollTimer = setTimeout(() => {
            if (productsSectionRef.current) {
                // Offset accounting for 54px sticky navbar + 22px buffer so message is fully visible
                const navbarHeight = 54;
                const buffer = 22;
                const elementTop = productsSectionRef.current.getBoundingClientRect().top;
                const targetScrollY = elementTop + window.pageYOffset - (navbarHeight + buffer);

                window.scrollTo({
                    top: Math.max(0, targetScrollY),
                    behavior: "smooth",
                });
            }
        }, 120);

        return () => clearTimeout(scrollTimer);
    }, [searchQuery]);

    return (
        <div className="home-container">
            <Hero />
            <div ref={productsSectionRef}>
                <Products 
                    products={products} 
                    searchQuery={searchQuery}
                    onClearSearch={onClearSearch}
                    resetToken={resetToken}
                    loading={loading} 
                    error={error} 
                    imageVersion={imageVersion}
                    onProductDelete={handleReload}
                    onRetry={handleReload}
                />
            </div>
        </div>
    );
}

export default Home;
