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
  Star,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { formatImageUrl } from "../utils/formatImage";

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [images, setImages] = useState([]);
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

    const loadBadges = async () => {
      try {
        const res = await api.get("/badges");

        if (res.data?.success && Array.isArray(res.data.badges)) {
          setBadges(res.data.badges);
        }
      } catch (err) {
        console.warn("Could not fetch badges:", err);
      }
    };

    loadCategories();
    loadBadges();
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

    if (!images.length && !formData.image) {
      newErrors.image =
        "At least 1 product image is required (up to 5 images)";
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
      newErrors.shortDesc =
        "Short description must be at least 10 characters";
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
    const fileList = Array.from(e.target.files || []);
    if (!fileList.length) return;

    const remainingSlots = 5 - images.length;

    if (remainingSlots <= 0) {
      toast.error("Maximum 5 images allowed. Please remove an image first.");
      e.target.value = "";
      return;
    }

    if (fileList.length > remainingSlots) {
      toast(
        `Adding first ${remainingSlots} image(s). Maximum 5 images allowed.`,
        {
          icon: "ℹ️",
        }
      );
    }

    const filesToUpload = fileList.slice(0, remainingSlots);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    for (const file of filesToUpload) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG, PNG, WEBP, GIF and SVG images are allowed",
        }));

        toast.error(`"${file.name}" has an invalid image type`);
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must not exceed 5MB per image",
        }));

        toast.error(`"${file.name}" exceeds 5MB limit`);
        e.target.value = "";
        return;
      }
    }

    try {
      setUploadingImage(true);
      setErrors((prev) => ({ ...prev, image: "" }));
      setError("");

      let uploadedUrls = [];

      if (filesToUpload.length > 1) {
        try {
          const multiData = new FormData();

          filesToUpload.forEach((file) =>
            multiData.append("images", file)
          );

          const res = await api.post("/upload/multiple", multiData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const urls =
            res.data?.imageUrls ||
            res.data?.filePaths ||
            res.data?.urls;

          if (Array.isArray(urls) && urls.length > 0) {
            uploadedUrls = urls;
          }
        } catch (err) {
          console.warn(
            "Multi-upload fallback to individual uploads:",
            err
          );
        }
      }

      if (!uploadedUrls.length) {
        for (const file of filesToUpload) {
          const singleData = new FormData();
          singleData.append("image", file);

          const res = await api.post("/upload", singleData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const url =
            res.data?.imageUrl ||
            res.data?.filePath ||
            res.data?.url;

          if (url) {
            uploadedUrls.push(url);
          }
        }
      }

      if (uploadedUrls.length > 0) {
        const nextImages = [...images, ...uploadedUrls].slice(0, 5);

        setImages(nextImages);

        setFormData((prev) => ({
          ...prev,
          image: nextImages[0] || "",
        }));

        setUploadSuccess(true);

        toast.success(
          `${uploadedUrls.length} image${
            uploadedUrls.length > 1 ? "s" : ""
          } uploaded successfully!`
        );
      } else {
        setErrors((prev) => ({
          ...prev,
          image:
            "Image upload failed. Server did not return image URLs",
        }));

        toast.error("Image upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);

      const msg =
        err.response?.data?.message ||
        "Failed to upload image(s) to server via Multer";

      setErrors((prev) => ({
        ...prev,
        image: msg,
      }));

      setError(msg);
      toast.error(msg);
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const nextImages = images.filter(
      (_, idx) => idx !== indexToRemove
    );

    setImages(nextImages);

    setFormData((prev) => ({
      ...prev,
      image: nextImages[0] || "",
    }));

    if (nextImages.length === 0) {
      setErrors((prev) => ({
        ...prev,
        image:
          "At least 1 product image is required (up to 5 images)",
      }));

      setUploadSuccess(false);
    }
  };

  const handleSetPrimaryImage = (indexToPrimary) => {
    if (indexToPrimary === 0) return;

    const target = images[indexToPrimary];
    const rest = images.filter(
      (_, idx) => idx !== indexToPrimary
    );

    const nextImages = [target, ...rest];

    setImages(nextImages);

    setFormData((prev) => ({
      ...prev,
      image: nextImages[0] || "",
    }));

    toast.success("Main cover image updated!");
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

    const finalImages =
      images.length > 0
        ? images.slice(0, 5)
        : [formData.image.trim()].filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category,
      basePrice: basePriceNum,
      badge: formData.badge,
      inStock: Boolean(formData.inStock),
      isBucket: Boolean(formData.isBucket),
      rating: Number(formData.rating),
      reviewsCount: Number(formData.reviewsCount),
      shortDesc: formData.shortDesc.trim(),
      description: formData.description.trim(),
      image: finalImages[0] || "",
      gallery: finalImages,
      origin: formData.origin.trim(),
      storage: formData.storage.trim(),
      weightOptions,
    };

    try {
      setLoading(true);

      await api.post("/products", payload);

      toast.success(
        "Product created successfully with images! It is now live on the store."
      );

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
            borderRadius: "12px",
            border: "1px dashed #cbd5e1",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
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
              Product Images * (Up to 5 Images)
            </label>

            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: images.length > 0 ? "#1e40af" : "#64748b",
                background:
                  images.length > 0 ? "#dbeafe" : "#f1f5f9",
                padding: "3px 10px",
                borderRadius: "20px",
              }}
            >
              {images.length} / 5 Images Added
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            {images.map((imgUrl, index) => {
              const preview = formatImageUrl(imgUrl);
              const isPrimary = index === 0;

              return (
                <div
                  key={`${imgUrl}-${index}`}
                  style={{
                    position: "relative",
                    width: "115px",
                    height: "115px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: isPrimary
                      ? "2px solid #2563eb"
                      : "1.5px solid #cbd5e1",
                    background: "#ffffff",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.06)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={preview}
                    alt={`Product Preview ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/almonds.jpg";
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "5px",
                      background: isPrimary
                        ? "rgba(30, 41, 59, 0.9)"
                        : "rgba(0, 0, 0, 0.65)",
                      color: isPrimary
                        ? "#facc15"
                        : "#ffffff",
                      fontSize: "10.5px",
                      fontWeight: "700",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      lineHeight: "1.2",
                    }}
                  >
                    {isPrimary && (
                      <Star
                        size={10}
                        fill="#facc15"
                        color="#facc15"
                      />
                    )}
                    {isPrimary ? "Cover" : `#${index + 1}`}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSetPrimaryImage(index)
                        }
                        title="Set as Main Cover Image"
                        style={{
                          background:
                            "rgba(255, 255, 255, 0.92)",
                          color: "#ca8a04",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow:
                            "0 1px 4px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Star
                          size={12}
                          fill="#ca8a04"
                          color="#ca8a04"
                        />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      title="Remove image"
                      style={{
                        background:
                          "rgba(220, 38, 38, 0.88)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow:
                          "0 1px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {images.length < 5 && (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploadingImage}
                style={{
                  width: "115px",
                  height: "115px",
                  borderRadius: "10px",
                  border: "2px dashed #94a3b8",
                  background: "#f1f5f9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: uploadingImage
                    ? "not-allowed"
                    : "pointer",
                  color: "#475569",
                  fontSize: "12px",
                  fontWeight: "600",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {uploadingImage ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                      color="#2563eb"
                    />
                    <span style={{ fontSize: "11px" }}>
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <Plus size={22} color="#2563eb" />
                    <span>Add Image</span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                      }}
                    >
                      ({5 - images.length} left)
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={
                uploadingImage || images.length >= 5
              }
              style={{
                background:
                  images.length >= 5
                    ? "#94a3b8"
                    : "#172554",
                color: "#ffffff",
                border: "none",
                padding: "9px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor:
                  uploadingImage || images.length >= 5
                    ? "not-allowed"
                    : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {uploadingImage ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Uploading via Multer...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  {images.length === 0
                    ? "Choose Images from Computer (Up to 5)"
                    : `Add More Images (${
                        5 - images.length
                      } remaining)`}
                </>
              )}
            </button>

            <span
              style={{
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              Supports JPG, PNG, WEBP, GIF, SVG. Max 5MB
              per image.
            </span>
          </div>

          {uploadSuccess && images.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#16a34a",
                fontSize: "12px",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              <CheckCircle size={15} />
              {images.length} image
              {images.length > 1 ? "s" : ""} ready for this
              product. Cover image: Image #1.
            </div>
          )}

          {errors.image && (
            <div style={errorStyle}>{errors.image}</div>
          )}
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

            {errors.name && (
              <div style={errorStyle}>
                {errors.name}
              </div>
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

            {errors.brand && (
              <div style={errorStyle}>
                {errors.brand}
              </div>
            )}
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
                  <option value="nuts">
                    Premium Nuts
                  </option>
                  <option value="buckets">
                    Gift Buckets & Hampers
                  </option>
                  <option value="dates-figs">
                    Dates & Dried Figs
                  </option>
                  <option value="berries-raisins">
                    Berries & Raisins
                  </option>
                  <option value="spices-seeds">
                    Spices & Super Seeds
                  </option>
                </>
              )}
            </select>

            {errors.category && (
              <div style={errorStyle}>
                {errors.category}
              </div>
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
              <div style={errorStyle}>
                {errors.basePrice}
              </div>
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

            <select
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">No Badge</option>

              {badges.map((badge) => (
                <option
                  key={badge._id}
                  value={badge._id}
                >
                  {badge.name}
                </option>
              ))}
            </select>
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

            {errors.origin && (
              <div style={errorStyle}>
                {errors.origin}
              </div>
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
              <div style={errorStyle}>
                {errors.storage}
              </div>
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
            <div style={errorStyle}>
              {errors.shortDesc}
            </div>
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
            <div style={errorStyle}>
              {errors.description}
            </div>
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
              <div style={errorStyle}>
                {errors.weightOption1Price}
              </div>
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
              <div style={errorStyle}>
                {errors.weightOption2Price}
              </div>
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
              <div style={errorStyle}>
                {errors.weightOption3Price}
              </div>
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
            cursor:
              loading || uploadingImage
                ? "not-allowed"
                : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            opacity:
              loading || uploadingImage ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
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