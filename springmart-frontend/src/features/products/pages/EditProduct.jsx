import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../../shared/toast";
import { getApiBaseUrl, getProductById, updateProduct } from "../api";
import ProductForm from "../components/ProductForm";
import {
    buildProductFormData,
    createEmptyProduct,
    getFriendlyProductErrorMessage,
    normalizeProductForForm,
    toProductFieldValue,
    validateProduct,
} from "../form-utils";

function EditProduct({ onProductUpdate }) {
    const { id } = useParams();
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

    useEffect(() => {
        let isMounted = true;

        async function loadProduct() {
            setLoading(true);

            try {
                const data = await getProductById(id);

                if (!isMounted) {
                    return;
                }

                setProduct(normalizeProductForForm(data));

                if (data.imageName) {
                    setImagePreview(`${getApiBaseUrl()}/api/products/image/${id}`);
                }
            } catch {
                if (isMounted) {
                    showErrorToast("Could not load product. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadProduct();

        return () => {
            isMounted = false;
        };
    }, [id]);

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

        const nextErrors = validateProduct(product);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            showErrorToast("Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            await updateProduct(id, buildProductFormData(product, image));
            showSuccessToast("Product updated");
            onProductUpdate?.();
            setTimeout(() => navigate("/products"), 1500);
        } catch (error) {
            showErrorToast(getFriendlyProductErrorMessage(error, "Could not update product. Please try again."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <ProductForm
            title="Edit Product"
            submitLabel="Save Changes"
            loadingLabel="Saving..."
            product={product}
            imagePreview={imagePreview}
            previewLabel={image ? "New image" : imagePreview ? "Current image" : undefined}
            errors={errors}
            loading={loading}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
        />
    );
}

export default EditProduct;