import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../../shared/toast";
import { createProduct } from "../api";
import ProductForm from "../components/ProductForm";
import {
    buildProductFormData,
    createEmptyProduct,
    getFriendlyProductErrorMessage,
    toProductFieldValue,
    validateProduct,
} from "../form-utils";

function AddProduct({ onProductUpdate }) {
    const navigate = useNavigate();
    const [product, setProduct] = useState(createEmptyProduct);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => () => {
        if (imagePreview?.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
    }, [imagePreview]);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setProduct((currentProduct) => ({
            ...currentProduct,
            [name]: toProductFieldValue(name, value, type, checked),
        }));

        if (errors[name]) {
            setErrors((currentErrors) => ({
                ...currentErrors,
                [name]: undefined,
            }));
        }
    }

    function handleImageChange(event) {
        const file = event.target.files?.[0];
        const inputElement = event.target;

        if (!file) {
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showErrorToast("Image must be under 5MB.");
            inputElement.value = "";
            setImage(null);
            setImagePreview(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            showErrorToast("Please upload an image (JPG, PNG, WebP).");
            inputElement.value = "";
            setImage(null);
            setImagePreview(null);
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            if (img.width > 1920 || img.height > 1080) {
                showErrorToast("Image must be 1920x1080 or smaller.");
                setErrors((currentErrors) => ({
                    ...currentErrors,
                    image: "Image must be 1920x1080 or smaller.",
                }));
                setImage(null);
                setImagePreview(null);
                inputElement.value = "";
                URL.revokeObjectURL(objectUrl);
            } else {
                if (imagePreview?.startsWith("blob:")) {
                    URL.revokeObjectURL(imagePreview);
                }
                setImage(file);
                setImagePreview(objectUrl);
                setErrors((currentErrors) => ({
                    ...currentErrors,
                    image: undefined,
                }));
            }
        };

        img.onerror = () => {
            showErrorToast("Could not read image. Please try another.");
            setImage(null);
            setImagePreview(null);
            inputElement.value = "";
            URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const nextErrors = validateProduct(product, {
            requireImage: !image,
        });
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            showErrorToast("Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await createProduct(buildProductFormData(product, image));

            if (response.status === 201) {
                showSuccessToast("Product added.");
                onProductUpdate?.();

                if (imagePreview?.startsWith("blob:")) {
                    URL.revokeObjectURL(imagePreview);
                }

                setProduct(createEmptyProduct());
                setImage(null);
                setImagePreview(null);
                setErrors({});
                setTimeout(() => navigate("/products"), 2000);
            }
        } catch (error) {
            showErrorToast(getFriendlyProductErrorMessage(error, "Could not add product. Please try again."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <ProductForm
            title="Add Product"
            submitLabel="Add Product"
            loadingLabel="Adding..."
            product={product}
            imagePreview={imagePreview}
            errors={errors}
            loading={loading}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
        />
    );
}

export default AddProduct;