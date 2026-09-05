export const PRODUCT_CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home",
    "Books",
    "Groceries",
    "Beauty",
    "Toys",
    "Sports",
    "Automotive",
    "Health",
    "Smart Home",
    "Audio & Accessories",
    "Office Supplies",
    "Fitness & Outdoors",
    "Pet Supplies",
    "Garden & Outdoor",
];

export function createEmptyProduct() {
    return {
        name: "",
        price: "",
        description: "",
        category: "",
        quantity: "",
        brand: "",
        inStock: true,
        releaseDate: "",
    };
}

export function toBoolean(value) {
    if (value === undefined || value === null) {
        return true;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }

    return Boolean(value);
}

export function formatDateForInput(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function normalizeProductForForm(product = {}) {
    return {
        name: product.name || "",
        price: product.price ?? "",
        description: product.description || "",
        category: product.category || "",
        quantity: product.quantity ?? "",
        brand: product.brand || "",
        inStock: toBoolean(product.inStock),
        releaseDate: formatDateForInput(product.releaseDate),
    };
}

export function buildProductFormData(product, image) {
    const formData = new FormData();

    formData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    if (image) {
        formData.append("imageFile", image);
    }

    return formData;
}

export function validateProduct(product, { requireImage = false } = {}) {
    const errors = {};

    if (!product.name.trim()) {
        errors.name = "Product name is required";
    }

    if (!product.price || product.price <= 0) {
        errors.price = "Price must be greater than 0";
    }

    if (!product.category) {
        errors.category = "Category is required";
    }

    if (!product.brand.trim()) {
        errors.brand = "Brand is required";
    }

    if (product.quantity !== "" && product.quantity < 0) {
        errors.quantity = "Quantity cannot be negative";
    }

    if (requireImage) {
        errors.image = "Product image is required";
    }

    return errors;
}

export function toProductFieldValue(name, value, type, checked) {
    if (type === "checkbox") {
        return checked;
    }

    if (name === "price" || name === "quantity") {
        return value === "" ? "" : parseInt(value, 10);
    }

    return value;
}

export function getFriendlyProductErrorMessage(error, fallbackMessage) {
    const rawMessage = error?.payload?.message || error?.message || fallbackMessage;

    if (rawMessage.includes("Failed to fetch")) {
        return "Could not reach server. Check your connection or try a smaller image.";
    }

    if (rawMessage.includes("Cannot deserialize value of type `java.lang.Integer`")) {
        return "Please enter a whole number without decimals.";
    }

    return rawMessage;
}