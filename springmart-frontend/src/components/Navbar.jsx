// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../shared/components/SearchBar";
import "../styles/Navbar.css";

function Navbar({ searchQuery = "", onSearch, onClearSearch, onResetApp }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close mobile menu when a link is clicked
    const closeMenu = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Automatically close mobile menu on route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Handler for Brand / Logo click
    const handleLogoClick = (e) => {
        e.preventDefault();
        closeMenu();
        if (onResetApp) {
            onResetApp();
        }
    };

    // Handler for Home link click
    const handleHomeClick = (e) => {
        closeMenu();
        if (onResetApp) {
            onResetApp();
            e.preventDefault();
        }
    };

    return (
        <>
            <nav className={`navbar ${isOpen ? 'is-open' : ''}`}>
                <div className="navbar-content">
                    <div className="navbar-left">
                        <Link to="/" className="logo" onClick={handleLogoClick}>
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="logo-svg" style={{ marginRight: '4px', color: '#1d1d1f' }}>
                                <circle cx="9" cy="20" r="1" fill="currentColor" />
                                <circle cx="18" cy="20" r="1" fill="currentColor" />
                                <path d="M3 3h2.5l2 11h12l2.5-8H6.5" />
                            </svg>
                            <span className="brand">SpringMart</span>
                        </Link>
                    </div>

                    <div className="navbar-right">
                        <div className="desktop-nav">
                            <Link 
                                to="/" 
                                className={location.pathname === "/" ? "active" : ""}
                                onClick={handleHomeClick}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/products" 
                                className={location.pathname === "/products" ? "active" : ""}
                            >
                                Products
                            </Link>
                            <Link 
                                to="/add" 
                                className={location.pathname === "/add" ? "active" : ""}
                            >
                                Add Product
                            </Link>
                        </div>

                        {!isMobile && (
                            <div className="search-container">
                                <SearchBar 
                                    searchQuery={searchQuery} 
                                    onSearch={onSearch} 
                                    onClear={onClearSearch} 
                                />
                            </div>
                        )}

                        {/* Hamburger menu button (mobile only) */}
                        <button 
                            className={`hamburger ${isOpen ? 'is-active' : ''}`} 
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile search and navigation (only visible on mobile) */}
            {isMobile && (
                <>
                    {isOpen && (
                        <div 
                            className="mobile-backdrop" 
                            onClick={closeMenu} 
                            aria-hidden="true"
                        />
                    )}
                    <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
                    <div className="mobile-search">
                        <SearchBar 
                            searchQuery={searchQuery} 
                            onSearch={(query) => { onSearch(query); closeMenu(); }} 
                            onClear={onClearSearch} 
                        />
                    </div>
                    <div className="mobile-links">
                        <Link 
                            to="/" 
                            className={location.pathname === "/" ? "active" : ""}
                            onClick={handleHomeClick}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/products" 
                            className={location.pathname === "/products" ? "active" : ""}
                            onClick={closeMenu}
                        >
                            Products
                        </Link>
                        <Link 
                            to="/add" 
                            className={location.pathname === "/add" ? "active" : ""}
                            onClick={closeMenu}
                        >
                            Add Product
                        </Link>
                    </div>
                </div>
                </>
            )}
        </>
    );
}

export default Navbar;
