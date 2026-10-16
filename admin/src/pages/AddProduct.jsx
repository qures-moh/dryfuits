
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Upload,
  CheckCircle,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    basePrice: "",
    badge: "",
    inStock: true,
    isBucket: false,
    rating: "4.8",
    reviewsCount: "25",
    shortDesc: "",
    description: "",
    image: "",
    origin: "",
    storage: "",
    weightOption1Price: "",
    weightOption2Price: "",
    weightOption3Price: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");

        if (Array.isArray(res.data) && res.data.length > 0) {
          const validCats = res.data.filter(
            (c) =>
              (c.categoryId || c.name)?.toLowerCase() !== "all" &&
              c.name?.toLowerCase() !== "all dry fruits"
          );

          setCategories(validCats);

          if (validCats.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category: validCats[0].categoryId || validCats[0]._id || "",
            }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch categories:", err);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.basePrice) {
      newErrors.basePrice = "Base price is required";
    } else if (Number.isNaN(Number(formData.basePrice))) {
      newErrors.basePrice = "Base price must be a valid number";
    } else if (Number(formData.basePrice) <= 0) {
      newErrors.basePrice = "Base price must be greater than 0";
    }

    if (!formData.image) {
      newErrors.image = "Product image is required";
    }

    if (!formData.origin.trim()) {
      newErrors.origin = "Origin is required";
    }

    if (!formData.storage.trim()) {
      newErrors.storage = "Storage information is required";
    }

    if (!formData.shortDesc.trim()) {
      newErrors.shortDesc = "Short description is required";
    } else if (formData.shortDesc.trim().length < 10) {
      newErrors.shortDesc = "Short description must be at least 10 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Detailed description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        "Detailed description must be at least 20 characters";
    }

    const weightPrices = [
      {
        field: "weightOption1Price",
        value: formData.weightOption1Price,
      },
      {
        field: "weightOption2Price",
        value: formData.weightOption2Price,
      },
      {
        field: "weightOption3Price",
        value: formData.weightOption3Price,
      },
    ];

    weightPrices.forEach(({ field, value }) => {
      if (value !== "") {
        if (Number.isNaN(Number(value))) {
          newErrors[field] = "Price must be a valid number";
        } else if (Number(value) <= 0) {
          newErrors[field] = "Price must be greater than 0";
        }
      }
    });

    if (formData.rating !== "") {
      if (
        Number.isNaN(Number(formData.rating)) ||
        Number(formData.rating) < 0 ||
        Number(formData.rating) > 5
      ) {
        newErrors.rating = "Rating must be between 0 and 5";
      }
    }

    if (formData.reviewsCount !== "") {
      if (
        Number.isNaN(Number(formData.reviewsCount)) ||
        Number(formData.reviewsCount) < 0
      ) {
        newErrors.reviewsCount = "Reviews count cannot be negative";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, WEBP, GIF and SVG images are allowed",
      }));
      toast.error("Invalid image type");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "File size must not exceed 5MB",
      }));
      toast.error("File size exceeds 5MB limit");
      e.target.value = "";
      return;
    }

    const localUrl = URL.createObjectURL(file);

    setImagePreview(localUrl);
    setSelectedFile(file);
    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
    setError("");
    setUploadSuccess(false);

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploadingImage(true);

      const res = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.imageUrl) {
        const serverImageUrl = res.data.imageUrl;

        setFormData((prev) => ({
          ...prev,
          image: serverImageUrl,
        }));

        setUploadSuccess(true);
        toast.success("Image uploaded successfully!");
      } else {
        setErrors((prev) => ({
          ...prev,
          image: "Image upload failed. Server did not return an image URL",
        }));
        toast.error("Image upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);

      const msg =
        err.response?.data?.message ||
        "Failed to upload image to server via Multer";

      setErrors((prev) => ({
        ...prev,
        image: msg,
      }));

      setError(msg);
      toast.error(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");

    setFormData((prev) => ({
      ...prev,
      image: "",
    }));

    setErrors((prev) => ({
      ...prev,
      image: "Product image is required",
    }));

    setUploadSuccess(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (uploadingImage) {
      toast.error("Please wait for the image upload to finish");
      return;
    }

    const basePriceNum = Number(formData.basePrice);

    const weightOptions = [
      {
        label: "500gm Pack",
        weight: "500gm",
        price: formData.weightOption1Price
          ? Number(formData.weightOption1Price)
          : basePriceNum,
        serves: "Regular Pack",
      },
      {
        label: "750gm Pack",
        weight: "750gm",
        price: formData.weightOption2Price
          ? Number(formData.weightOption2Price)
          : Math.round(basePriceNum * 1.45),
        serves: "Family Pack",
      },
      {
        label: "1kg Mega Pack",
        weight: "1kg",
        price: formData.weightOption3Price
          ? Number(formData.weightOption3Price)
          : Math.round(basePriceNum * 1.85),
        serves: "Bulk Saver",
      },
    ];

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category,
      basePrice: basePriceNum,
      badge: formData.badge.trim(),
      inStock: Boolean(formData.inStock),
      isBucket: Boolean(formData.isBucket),
      rating: Number(formData.rating),
      reviewsCount: Number(formData.reviewsCount),
      shortDesc: formData.shortDesc.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      gallery: [formData.image.trim()],
      origin: formData.origin.trim(),
      storage: formData.storage.trim(),
      weightOptions,
    };

    try {
      setLoading(true);

      await api.post("/products", payload);

      toast.success("Product created successfully! It is now live on the store.");

      navigate("/products");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create product";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const displayPreviewUrl =
    imagePreview.startsWith("blob:") ||
    imagePreview.startsWith("data:") ||
    imagePreview.startsWith("http")
      ? imagePreview
      : imagePreview.startsWith("/uploads")
      ? `http://localhost:5000${imagePreview}`
      : imagePreview;

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "5px",
  };

  return (
    <div className="dashboard-page">
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/products")}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <div>
          <h1 className="dashboard-title">Add New Product</h1>
          <p className="dashboard-subtitle">
            Select an image from your computer and create a new item
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          background: "#ffffff",
          padding: "28px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            marginBottom: "26px",
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "10px",
            border: "1px dashed #cbd5e1",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                fontWeight: "700",
                fontSize: "14px",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ImageIcon size={18} />
              Product Image *
            </label>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "110px",
                height: "110px",
                borderRadius: "10px",
                overflow: "hidden",
                border: "2px solid #e2e8f0",
                background: "#ffffff",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {displayPreviewUrl ? (
                <img
                  src={displayPreviewUrl}
                  alt="Product Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <ImageIcon size={35} color="#94a3b8" />
              )}

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="Remove image"
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                style={{
                  background: "#172554",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: uploadingImage ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading via Multer...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Choose Image from Computer
                  </>
                )}
              </button>

              <p
                style={{
                  margin: "4px 0",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Supports JPG, PNG, WEBP, GIF and SVG. Max 5MB.
              </p>

              {uploadSuccess && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#16a34a",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginTop: "6px",
                  }}
                >
                  <CheckCircle size={15} />
                  Image uploaded successfully
                </div>
              )}

              {selectedFile && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#334155",
                    marginTop: "4px",
                  }}
                >
                  Selected: <strong>{selectedFile.name}</strong> (
                  {(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}

              {errors.image && <div style={errorStyle}>{errors.image}</div>}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Product Name *
            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Kashmiri Jumbo Cashews"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.name && <div style={errorStyle}>{errors.name}</div>}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Brand *
            </label>

            <input
              type="text"
              name="brand"
              placeholder="GOLDEN HARVEST"
              value={formData.brand}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.brand && <div style={errorStyle}>{errors.brand}</div>}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select Category</option>

              {categories.map((c) => (
                <option
                  key={c.categoryId || c._id}
                  value={c.categoryId || c._id}
                >
                  {c.name}
                </option>
              ))}

              {categories.length === 0 && (
                <>
                  <option value="nuts">Premium Nuts</option>
                  <option value="buckets">Gift Buckets & Hampers</option>
                  <option value="dates-figs">Dates & Dried Figs</option>
                  <option value="berries-raisins">Berries & Raisins</option>
                  <option value="spices-seeds">Spices & Super Seeds</option>
                </>
              )}
            </select>

            {errors.category && (
              <div style={errorStyle}>{errors.category}</div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Base Price (₹) *
            </label>

            <input
              type="number"
              name="basePrice"
              min="0.01"
              step="0.01"
              placeholder="550"
              value={formData.basePrice}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.basePrice && (
              <div style={errorStyle}>{errors.basePrice}</div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Badge
            </label>

            <input
              type="text"
              name="badge"
              placeholder="e.g. Best Seller, Organic, New"
              value={formData.badge}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Origin *
            </label>

            <input
              type="text"
              name="origin"
              placeholder="e.g. Kashmir & California"
              value={formData.origin}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.origin && <div style={errorStyle}>{errors.origin}</div>}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Storage Information *
            </label>

            <input
              type="text"
              name="storage"
              placeholder="Airtight container in cool dry place"
              value={formData.storage}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.storage && (
              <div style={errorStyle}>{errors.storage}</div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            Short Description *
          </label>

          <input
            type="text"
            name="shortDesc"
            placeholder="A short punchy line for previews"
            value={formData.shortDesc}
            onChange={handleChange}
            style={inputStyle}
          />

          {errors.shortDesc && (
            <div style={errorStyle}>{errors.shortDesc}</div>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            Detailed Description *
          </label>

          <textarea
            name="description"
            rows="4"
            placeholder="Complete description of the dry fruit product or hamper contents..."
            value={formData.description}
            onChange={handleChange}
            style={inputStyle}
          />

          {errors.description && (
            <div style={errorStyle}>{errors.description}</div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              500gm Price
            </label>

            <input
              type="number"
              name="weightOption1Price"
              min="0.01"
              step="0.01"
              placeholder="550"
              value={formData.weightOption1Price}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.weightOption1Price && (
              <div style={errorStyle}>{errors.weightOption1Price}</div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              750gm Price
            </label>

            <input
              type="number"
              name="weightOption2Price"
              min="0.01"
              step="0.01"
              placeholder="Calculated automatically"
              value={formData.weightOption2Price}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.weightOption2Price && (
              <div style={errorStyle}>{errors.weightOption2Price}</div>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              1kg Price
            </label>

            <input
              type="number"
              name="weightOption3Price"
              min="0.01"
              step="0.01"
              placeholder="Calculated automatically"
              value={formData.weightOption3Price}
              onChange={handleChange}
              style={inputStyle}
            />

            {errors.weightOption3Price && (
              <div style={errorStyle}>{errors.weightOption3Price}</div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            <input
              type="checkbox"
              name="isBucket"
              checked={formData.isBucket}
              onChange={handleChange}
            />
            Is Gift Bucket / Hamper
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || uploadingImage}
          style={{
            background: "#172554",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "15px",
            border: "none",
            cursor: loading || uploadingImage ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            opacity: loading || uploadingImage ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving Product...
            </>
          ) : (
            <>
              <Save size={18} />
              Create Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
