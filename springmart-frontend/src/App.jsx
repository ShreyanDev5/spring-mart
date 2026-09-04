// src/App.jsx

import React, { Suspense, lazy, useCallback, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/components/Toast.module.scss";

// Lazy-loaded routes for code-splitting (reduces initial bundle)
const AddProduct = lazy(() => import("./features/products/pages/AddProduct"));
const EditProduct = lazy(() => import("./features/products/pages/EditProduct"));
const ProductList = lazy(() => import("./features/products/pages/ProductList"));

function App() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTarget, setSearchTarget] = useState("home"); // 'home' or 'products'
    const [imageVersion, setImageVersion] = useState(Date.now());
    const [productRefreshTrigger, setProductRefreshTrigger] = useState(0);
    const [resetToken, setResetToken] = useState(0);

    // We need to use useNavigate, so wrap the Routes in a component with access to hooks
    const AppRoutes = () => {
        const navigate = useNavigate();
        const location = useLocation();

        const updateImageVersion = () => {
            setImageVersion(Date.now());
        };

        const refreshProducts = useCallback(() => {
            setProductRefreshTrigger(prev => prev + 1);
            updateImageVersion();
        }, []);

        const handleSearch = (query, target = null) => {
            // Determine current page
            const currentPath = location.pathname;
            let page = target;
            if (!page) {
                if (currentPath === "/products") {
                    page = "products";
                } else {
                    page = "home";
                }
            }
            setSearchQuery(query);
            setSearchTarget(page);
            // Only navigate if not already on the correct page
            if (page === "products" && currentPath !== "/products") {
                navigate("/products");
            } else if (page === "home" && currentPath !== "/") {
                navigate("/");
            }
        };

        const handleClearSearch = () => {
            setSearchQuery("");
        };

        const handleResetApp = () => {
            setSearchQuery("");
            setSearchTarget("home");
            setResetToken(prev => prev + 1);
            if (location.pathname !== "/") {
                navigate("/");
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };

        return (
            <div className="app-shell">
                <Navbar 
                    searchQuery={searchQuery}
                    onSearch={handleSearch} 
                    onClearSearch={handleClearSearch}
                    onResetApp={handleResetApp}
                />
                <main className="app-main">
                    <Suspense fallback={null}>
                        <Routes>
                            <Route 
                                path="/" 
                                element={
                                    <Home 
                                        searchQuery={searchTarget === "home" ? searchQuery : ""} 
                                        onClearSearch={handleClearSearch}
                                        resetToken={resetToken}
                                        imageVersion={imageVersion} 
                                        refreshTrigger={productRefreshTrigger} 
                                    />
                                } 
                            />
                            <Route path="/add" element={<AddProduct onProductUpdate={refreshProducts} />} />
                            <Route path="/edit/:id" element={<EditProduct onProductUpdate={refreshProducts} />} />
                            <Route 
                                path="/products" 
                                element={
                                    <ProductList 
                                        searchQuery={searchTarget === "products" ? searchQuery : ""} 
                                        onClearSearch={handleClearSearch}
                                        imageVersion={imageVersion} 
                                        refreshTrigger={productRefreshTrigger} 
                                    />
                                } 
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        );
    };

    return (
        <Router>
            <AppRoutes />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Router>
    );
}

export default App;
