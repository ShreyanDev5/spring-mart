import React, { useState, useEffect, useRef } from "react";
import { FiCheck, FiChevronDown, FiUploadCloud } from "react-icons/fi";
import styles from "../../../styles/components/AddProduct.module.scss";
import { PRODUCT_CATEGORIES } from "../form-utils";

function ProductForm({
    title,
    submitLabel,
    loadingLabel,
    product,
    imagePreview,
    errors,
    loading,
    previewLabel,
    onChange,
    onImageChange,
    onSubmit,
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`${styles.addProductContainer} ${loading ? styles.loading : ""}`}>
            <h2 className={styles.formTitle}>{title}</h2>
            <form onSubmit={onSubmit} className={styles.productForm} noValidate>
                <div className={styles.formColumns}>
                    {/* Left Column: Essential Product Data */}
                    <div className={styles.columnLeft}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Product Name</label>
                            <input
                                id="name"
                                name="name"
                                value={product.name}
                                onChange={onChange}
                                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                                required
                                className={`${styles.styledInput} ${errors.name ? styles.invalid : ""}`}
                                aria-describedby={errors.name ? "name-error" : undefined}
                            />
                            {errors.name && <span id="name-error" className={styles.validationMessage}>{errors.name}</span>}
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="brand">Brand</label>
                                <input
                                    id="brand"
                                    name="brand"
                                    value={product.brand}
                                    onChange={onChange}
                                    placeholder="e.g. Sony"
                                    required
                                    className={`${styles.styledInput} ${errors.brand ? styles.invalid : ""}`}
                                    aria-describedby={errors.brand ? "brand-error" : undefined}
                                />
                                {errors.brand && <span id="brand-error" className={styles.validationMessage}>{errors.brand}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="category">Category</label>
                                <div className={styles.customSelectWrapper} ref={dropdownRef}>
                                    <button
                                        type="button"
                                        className={`${styles.customSelectTrigger} ${isDropdownOpen ? styles.open : ""} ${errors.category ? styles.invalid : ""}`}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        aria-haspopup="listbox"
                                        aria-expanded={isDropdownOpen}
                                    >
                                        <span>{product.category || "Select Category"}</span>
                                        <FiChevronDown className={styles.arrowIcon} />
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className={styles.customSelectOptions} role="listbox">
                                            <li
                                                className={`${styles.customSelectOption} ${product.category === "" ? styles.selected : ""}`}
                                                role="option"
                                                aria-selected={product.category === ""}
                                                onClick={() => {
                                                    onChange({ target: { name: "category", value: "" } });
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                Select Category
                                            </li>
                                            {PRODUCT_CATEGORIES.map((category) => (
                                                <li
                                                    key={category}
                                                    className={`${styles.customSelectOption} ${product.category === category ? styles.selected : ""}`}
                                                    role="option"
                                                    aria-selected={product.category === category}
                                                    onClick={() => {
                                                        onChange({ target: { name: "category", value: category } });
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    {category}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {errors.category && <span id="category-error" className={styles.validationMessage}>{errors.category}</span>}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="price">Price (₹)</label>
                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={onChange}
                                    placeholder="0"
                                    required
                                    min="0"
                                    step="1"
                                    className={`${styles.styledInput} ${errors.price ? styles.invalid : ""}`}
                                    aria-describedby={errors.price ? "price-error" : undefined}
                                />
                                {errors.price && <span id="price-error" className={styles.validationMessage}>{errors.price}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    value={product.quantity}
                                    onChange={onChange}
                                    placeholder="0"
                                    min="0"
                                    className={`${styles.styledInput} ${errors.quantity ? styles.invalid : ""}`}
                                    aria-describedby={errors.quantity ? "quantity-error" : undefined}
                                />
                                {errors.quantity && <span id="quantity-error" className={styles.validationMessage}>{errors.quantity}</span>}
                            </div>
                        </div>

                        <div className={`${styles.formGroup} ${styles.lastFormGroup}`}>
                            <div className={styles.labelWithCounter}>
                                <label className={styles.fieldLabel} htmlFor="description">Description</label>
                                <span
                                    id="description-info"
                                    className={`${styles.charCount} ${product.description.length > 500 ? styles.charCountError : ""}`}
                                >
                                    {product.description.length}/500
                                </span>
                            </div>
                            <textarea
                                id="description"
                                name="description"
                                value={product.description}
                                onChange={onChange}
                                placeholder="Key product specifications and highlights..."
                                maxLength="500"
                                className={styles.styledTextarea}
                                aria-describedby="description-info"
                            />
                        </div>
                    </div>

                    {/* Right Column: Image, Attributes & Action */}
                    <div className={styles.columnRight}>
                        <div className={styles.formGroup}>
                            <label className={styles.fieldLabel} htmlFor="image">Product Image</label>
                            <div className={styles.fileUploadContainer}>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                    className={styles.hiddenFileInput}
                                    aria-describedby={errors.image ? "image-error" : "image-info"}
                                />
                                <label htmlFor="image" className={`${styles.uploadDropzone} ${errors.image ? styles.invalid : ""}`}>
                                    <div className={styles.uploadIconBadge}>
                                        <FiUploadCloud className={styles.uploadIcon} />
                                    </div>
                                    <span className={styles.uploadTitle}>Choose image or drop file</span>
                                    <span className={styles.uploadSpecs}>JPG, PNG, WebP • Max 5MB</span>
                                </label>
                            </div>
                            {errors.image ? (
                                <span id="image-error" className={styles.validationMessage}>{errors.image}</span>
                            ) : null}
                            {imagePreview && (
                                <div className={styles.previewContainer}>
                                    {previewLabel && (
                                        <div className={styles.previewLabel}>{previewLabel}</div>
                                    )}
                                    <div className={styles.imagePreviewBox}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className={styles.previewImg}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.fieldLabel} htmlFor="releaseDate">Release Date</label>
                                <input
                                    id="releaseDate"
                                    type="date"
                                    name="releaseDate"
                                    value={product.releaseDate}
                                    onChange={onChange}
                                    className={styles.styledInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.fieldLabel} htmlFor="inStock">Availability</label>
                                <button
                                    type="button"
                                    id="inStock"
                                    role="switch"
                                    aria-checked={Boolean(product.inStock)}
                                    className={`${styles.availabilityToggleCard} ${product.inStock ? styles.isInStock : styles.isOutOfStock}`}
                                    onClick={() => {
                                        onChange({
                                            target: {
                                                name: "inStock",
                                                type: "checkbox",
                                                checked: !product.inStock,
                                            },
                                        });
                                    }}
                                >
                                    <span className={styles.statusText}>
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </span>
                                    <div className={styles.toggleTrack}>
                                        <span className={styles.toggleThumb}></span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className={styles.actionSection}>
                            <p className={styles.publishNotice}>
                                Product will publish live to the catalog immediately.
                            </p>
                            <button
                                type="submit"
                                className={styles.styledButton}
                                disabled={loading}
                                aria-busy={loading}
                            >
                                {loading ? (
                                    <span>{loadingLabel}</span>
                                ) : (
                                    <>
                                        <FiCheck style={{ marginRight: "0.4rem" }} />
                                        {submitLabel}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;