import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Search,
  Package,
  AlertCircle,
  AlertTriangle,
  Loader2,
  X,
  Filter,
  CheckCircle2,
  Eye,
  Pencil,
  Star,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  // Confirmation Modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View Product Modal state
  const [productToView, setProductToView] = useState(null);
  const [viewSelectedImg, setViewSelectedImg] = useState("");

  // Edit Product Modal state
  const [productToEdit, setProductToEdit] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [uploadingEditImg, setUploadingEditImg] = useState(false);
  const [editImages, setEditImages] = useState([]);
  const [editFilePickerKey, setEditFilePickerKey] = useState(0);
  const [editForm, setEditForm] = useState({
    name: "",
    brand: "GOLDEN HARVEST",
    category: "",
    basePrice: 0,
    badge: "",
    inStock: true,
    isBucket: false,
    rating: 4.8,
    reviewsCount: 20,
    shortDesc: "",
    description: "",
    image: "",
    origin: "",
    storage: "",
    weightOption1Price: "",
    weightOption2Price: "",
    weightOption3Price: "",
  });

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.allSettled([
        api.get("/products"),
        api.get("/categories"),
      ]);

      if (prodRes.status === "fulfilled") {
        setProducts(prodRes.value.data || []);
      } else {
        setError(prodRes.reason?.response?.data?.message || "Failed to load products");
      }

      if (catRes.status === "fulfilled" && Array.isArray(catRes.value.data)) {
        setCategories(catRes.value.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const formatProductImage = (img) => {
    if (!img) return "/images/almonds.jpg";
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    if (img.startsWith("/uploads")) {
      return `http://localhost:5000${img}`;
    }
    return img;
  };

  const handleImageError = (e, originalPath) => {
    if (!e.target.dataset.triedServer) {
      e.target.dataset.triedServer = "true";
      const cleanPath = originalPath?.startsWith("/") ? originalPath : `/${originalPath}`;
      e.target.src = `http://localhost:5000${cleanPath}`;
    } else {
      e.target.src = "/images/almonds.jpg";
    }
  };

  // Open confirmation modal
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
  };

  // Confirm and execute delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/products/${productToDelete._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      const msg = `"${productToDelete.name}" deleted successfully.`;
      setSuccessMsg(msg);
      toast.success(msg);
      setProductToDelete(null);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete product";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // View modal handler
  const handleOpenViewModal = (product) => {
    setViewSelectedImg(product.image || product.gallery?.[0] || "");
    setProductToView(product);
  };

  // Edit modal handlers
  const handleOpenEditModal = (product) => {
    const w1 = product.weightOptions?.find((w) => w.weight === "500g")?.price;
    const w2 = product.weightOptions?.find((w) => w.weight === "750g")?.price;
    const w3 = product.weightOptions?.find((w) => w.weight === "1kg")?.price;

    const initialGallery =
      Array.isArray(product.gallery) && product.gallery.length > 0
        ? product.gallery
        : product.image
        ? [product.image]
        : ["/images/almonds.jpg"];

    setEditImages(initialGallery.slice(0, 5));

    setEditForm({
      name: product.name || "",
      brand: product.brand || "GOLDEN HARVEST",
      category: product.category || (categories[0]?.categoryId || categories[0]?.name || "nuts"),
      basePrice: product.basePrice !== undefined ? product.basePrice : 0,
      badge: product.badge || "",
      inStock: product.inStock !== false,
      isBucket: Boolean(product.isBucket),
      rating: product.rating !== undefined ? product.rating : 4.8,
      reviewsCount: product.reviewsCount !== undefined ? product.reviewsCount : 20,
      shortDesc: product.shortDesc || "",
      description: product.description || "",
      image: initialGallery[0] || product.image || "/images/almonds.jpg",
      origin: product.origin || "",
      storage: product.storage || "Airtight container in cool dry place",
      weightOption1Price: w1 !== undefined ? w1 : product.basePrice || "",
      weightOption2Price: w2 !== undefined ? w2 : Math.round((product.basePrice || 0) * 1.45) || "",
      weightOption3Price: w3 !== undefined ? w3 : Math.round((product.basePrice || 0) * 1.9) || "",
    });
    setProductToEdit(product);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditImageUpload = async (e) => {
    const fileList = Array.from(e.target.files || []);
    if (!fileList.length) return;

    const remaining = 5 - editImages.length;
    if (remaining <= 0) {
      toast.error("Maximum 5 images allowed. Please remove an image first.");
      e.target.value = "";
      return;
    }

    if (fileList.length > remaining) {
      toast(`Adding first ${remaining} image(s). Maximum 5 images allowed.`, {
        icon: "ℹ️",
      });
    }

    const filesToUpload = fileList.slice(0, remaining);

    for (const file of filesToUpload) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB limit`);
        e.target.value = "";
        return;
      }
    }

    try {
      setUploadingEditImg(true);
      let newUrls = [];

      // Try batch upload if multiple files
      if (filesToUpload.length > 1) {
        try {
          const multiData = new FormData();
          filesToUpload.forEach((f) => multiData.append("images", f));
          const res = await api.post("/upload/multiple", multiData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const urls = res.data?.imageUrls || res.data?.filePaths || res.data?.urls;
          if (Array.isArray(urls) && urls.length > 0) {
            newUrls = urls;
          }
        } catch (err) {
          console.warn("Multi upload fallback in edit:", err);
        }
      }

      if (!newUrls.length) {
        for (const file of filesToUpload) {
          const singleData = new FormData();
          singleData.append("image", file);
          const res = await api.post("/upload", singleData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const url = res.data?.imageUrl || res.data?.filePath || res.data?.url;
          if (url) newUrls.push(url);
        }
      }

      if (newUrls.length > 0) {
        const next = [...editImages, ...newUrls].slice(0, 5);
        setEditImages(next);
        setEditForm((prev) => ({ ...prev, image: next[0] || "" }));
        toast.success(`${newUrls.length} image(s) uploaded successfully!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image(s)");
    } finally {
      setUploadingEditImg(false);
      setEditFilePickerKey((k) => k + 1);
    }
  };

  const handleRemoveEditImage = (indexToRemove) => {
    const next = editImages.filter((_, idx) => idx !== indexToRemove);
    setEditImages(next);
    setEditForm((prev) => ({ ...prev, image: next[0] || "" }));
  };

  const handleSetPrimaryEditImage = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    const target = editImages[indexToPrimary];
    const rest = editImages.filter((_, idx) => idx !== indexToPrimary);
    const next = [target, ...rest];
    setEditImages(next);
    setEditForm((prev) => ({ ...prev, image: next[0] || "" }));
    toast.success("Main cover image updated!");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!productToEdit) return;

    if (!editForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!editForm.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (editForm.basePrice === "" || Number(editForm.basePrice) < 0) {
      toast.error("Valid base price is required");
      return;
    }

    const finalImages =
      editImages.length > 0
        ? editImages.slice(0, 5)
        : [editForm.image.trim()].filter(Boolean);

    if (finalImages.length === 0) {
      toast.error("At least 1 product image is required (up to 5 images)");
      return;
    }

    try {
      setIsSavingEdit(true);

      const baseP = Number(editForm.basePrice);
      const weightOptions = [
        {
          weight: "500g",
          price: Number(editForm.weightOption1Price) || baseP,
          inStock: Boolean(editForm.inStock),
        },
        {
          weight: "750g",
          price: Number(editForm.weightOption2Price) || Math.round(baseP * 1.45),
          inStock: Boolean(editForm.inStock),
        },
        {
          weight: "1kg",
          price: Number(editForm.weightOption3Price) || Math.round(baseP * 1.9),
          inStock: Boolean(editForm.inStock),
        },
      ];

      const payload = {
        name: editForm.name.trim(),
        brand: editForm.brand.trim(),
        category: editForm.category.trim(),
        basePrice: baseP,
        badge: editForm.badge.trim(),
        inStock: Boolean(editForm.inStock),
        isBucket: Boolean(editForm.isBucket),
        rating: Number(editForm.rating),
        reviewsCount: Number(editForm.reviewsCount),
        shortDesc: editForm.shortDesc.trim(),
        description: editForm.description.trim(),
        image: finalImages[0] || "",
        gallery: finalImages,
        origin: editForm.origin.trim(),
        storage: editForm.storage.trim(),
        weightOptions,
      };

      const res = await api.put(`/products/${productToEdit._id}`, payload);
      const updatedProduct = res.data;

      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
      toast.success(`"${updatedProduct.name}" updated successfully!`);
      setProductToEdit(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setIsSavingEdit(false);
    }
  };


  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.badge?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "all" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getBadgeStyle = (badge) => {
    const b = badge?.toLowerCase() || "";
    if (b.includes("best") || b.includes("seller")) {
      return { bg: "#fef3c7", text: "#b45309", border: "#fde68a" };
    }
    if (b.includes("eco") || b.includes("green") || b.includes("super")) {
      return { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" };
    }
    if (b.includes("royal") || b.includes("king") || b.includes("gift")) {
      return { bg: "#ede9fe", text: "#6d28d9", border: "#ddd6fe" };
    }
    if (b.includes("brain") || b.includes("booster") || b.includes("popular")) {
      return { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" };
    }
    return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" };
  };

  return (
    <div className="dashboard-page" style={{ paddingBottom: "60px" }}>
      {/* Top Header */}
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 className="dashboard-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Products
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                background: "#e0e7ff",
                color: "#3730a3",
                padding: "3px 10px",
                borderRadius: "20px",
              }}
            >
              {products.length} Total
            </span>
          </h1>
          <p className="dashboard-subtitle">
            Manage your store's dry fruit items, gift hampers, pricing, and live inventory
          </p>
        </div>

        <Link
          to="/products/add"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#172554",
            color: "#ffffff",
            padding: "11px 20px",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(23, 37, 84, 0.15)",
            transition: "all 0.2s ease",
          }}
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #fecaca",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertCircle size={20} color="#dc2626" />
            <span style={{ fontWeight: "500" }}>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            style={{ background: "transparent", border: "none", color: "#991b1b", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #bbf7d0",
          }}
        >
          <CheckCircle2 size={20} color="#16a34a" />
          <span style={{ fontWeight: "500" }}>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "#ffffff",
          padding: "18px 20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search Input */}
          <div
            style={{
              flex: "1 1 300px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#f8fafc",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
            }}
          >
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search products by title, category, brand, badge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                fontSize: "14px",
                color: "#0f172a",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={16} color="#64748b" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                fontSize: "14px",
                fontWeight: "500",
                color: "#1e293b",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Categories ({products.length})</option>
              {categories
                .filter((c) => (c.categoryId || c.name)?.toLowerCase() !== "all" && c.name?.toLowerCase() !== "all dry fruits")
                .map((c) => (
                  <option key={c.categoryId || c.name} value={c.categoryId || c.name}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Category Quick Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginRight: "4px" }}>
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              border: "1px solid",
              borderColor: selectedCategory === "all" ? "#2563eb" : "#e2e8f0",
              background: selectedCategory === "all" ? "#eff6ff" : "#ffffff",
              color: selectedCategory === "all" ? "#1d4ed8" : "#64748b",
              cursor: "pointer",
            }}
          >
            All ({products.length})
          </button>
          {categories
            .filter((c) => (c.categoryId || c.name)?.toLowerCase() !== "all" && c.name?.toLowerCase() !== "all dry fruits")
            .map((c) => {
              const catId = c.categoryId || c.name;
              const count = products.filter(
                (p) => p.category?.toLowerCase() === catId.toLowerCase()
              ).length;
              const isSelected = selectedCategory.toLowerCase() === catId.toLowerCase();
              return (
                <button
                  key={catId}
                  type="button"
                  onClick={() => setSelectedCategory(catId)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    border: "1px solid",
                    borderColor: isSelected ? "#2563eb" : "#e2e8f0",
                    background: isSelected ? "#eff6ff" : "#ffffff",
                    color: isSelected ? "#1d4ed8" : "#64748b",
                    cursor: "pointer",
                  }}
                >
                  {c.name} ({count})
                </button>
              );
            })}
        </div>
      </div>

      {/* Products Table Card */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th style={{ width: "80px", textAlign: "center" }}>IMAGE</th>
              <th style={{ minWidth: "260px" }}>PRODUCT DETAILS</th>
              <th style={{ width: "130px" }}>CATEGORY</th>
              <th style={{ width: "110px" }}>PRICE</th>
              <th style={{ width: "130px" }}>BADGE</th>
              <th style={{ width: "120px" }}>STOCK</th>
              <th style={{ width: "140px", textAlign: "center" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px auto", color: "#2563eb" }} />
                  <div style={{ color: "#475569", fontWeight: "600" }}>Loading products from database...</div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  <Package size={44} style={{ margin: "0 auto 12px auto", display: "block", color: "#94a3b8" }} />
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>
                    No products found
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    {search ? `No products matching "${search}"` : "Try adding a new product above"}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const badgeStyle = getBadgeStyle(product.badge);
                return (
                  <tr key={product._id}>
                    {/* Thumbnail Image */}
                    <td style={{ textAlign: "center", padding: "14px 10px" }}>
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1px solid #e2e8f0",
                          background: "#ffffff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        }}
                      >
                        <img
                          src={formatProductImage(product.image)}
                          alt={product.name}
                          onError={(e) => handleImageError(e, product.image)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    </td>

                    {/* Product Details */}
                    <td>
                      <div style={{ fontWeight: "700", fontSize: "14.5px", color: "#0f172a", marginBottom: "3px" }}>
                        {product.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
                        <span style={{ fontWeight: "600", color: "#475569" }}>{product.brand || "GOLDEN HARVEST"}</span>
                        {product.weightOptions?.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{product.weightOptions.length} size options</span>
                          </>
                        )}
                        {product.origin && (
                          <>
                            <span>•</span>
                            <span>{product.origin}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span
                        style={{
                          background: "#f1f5f9",
                          color: "#334155",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textTransform: "capitalize",
                          display: "inline-block",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>
                        ₹{Number(product.basePrice || 0).toLocaleString("en-IN")}
                      </div>
                    </td>

                    {/* Badge */}
                    <td>
                      {product.badge ? (
                        <span
                          style={{
                            background: badgeStyle.bg,
                            color: badgeStyle.text,
                            border: `1px solid ${badgeStyle.border}`,
                            padding: "4px 9px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            fontWeight: "700",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                          }}
                        >
                          {product.badge}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: product.inStock ? "#dcfce7" : "#fee2e2",
                          color: product.inStock ? "#15803d" : "#b91c1c",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: `1px solid ${product.inStock ? "#bbf7d0" : "#fecaca"}`,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: product.inStock ? "#16a34a" : "#dc2626",
                          }}
                        />
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Action - View, Edit, Delete Buttons */}
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenViewModal(product)}
                          title={`View ${product.name}`}
                          style={{
                            background: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            color: "#1d4ed8",
                            padding: "7px 8px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dbeafe";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#eff6ff";
                          }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(product)}
                          title={`Edit ${product.name}`}
                          style={{
                            background: "#fef3c7",
                            border: "1px solid #fde68a",
                            color: "#b45309",
                            padding: "7px 8px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fde68a";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fef3c7";
                          }}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(product)}
                          title={`Delete ${product.name}`}
                          style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            padding: "7px 8px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fee2e2";
                            e.currentTarget.style.borderColor = "#f87171";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fef2f2";
                            e.currentTarget.style.borderColor = "#fecaca";
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================================================
          Custom Confirmation Modal for Deleting
          ====================================================================== */}
      {productToDelete && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!isDeleting) setProductToDelete(null);
          }}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#fee2e2",
                  border: "1px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#dc2626",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>
                  Confirm Deletion
                </h3>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                  Are you sure you want to delete this product? It will be removed permanently from your database and customer landing page.
                </p>
              </div>
            </div>

            {/* Product Snapshot Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "22px",
              }}
            >
              <img
                src={formatProductImage(productToDelete.image)}
                alt={productToDelete.name}
                onError={(e) => handleImageError(e, productToDelete.image)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "1px solid #e2e8f0",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    color: "#0f172a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {productToDelete.name}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px", display: "flex", gap: "8px" }}>
                  <span style={{ textTransform: "capitalize", fontWeight: "500" }}>{productToDelete.category}</span>
                  <span>•</span>
                  <span style={{ fontWeight: "700", color: "#0f172a" }}>
                    ₹{Number(productToDelete.basePrice || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                style={{
                  background: "#dc2626",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#ffffff",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
                }}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          View Product Details Modal
          ====================================================================== */}
      {productToView && (
        <div className="modal-overlay" onClick={() => setProductToView(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "26px" }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", background: "#eff6ff", color: "#1d4ed8", padding: "3px 8px", borderRadius: "4px" }}>
                    {productToView.category}
                  </span>
                  {productToView.badge && (
                    <span style={{ fontSize: "11px", fontWeight: "700", background: "#fef3c7", color: "#b45309", padding: "3px 8px", borderRadius: "4px" }}>
                      {productToView.badge}
                    </span>
                  )}
                  {productToView.isBucket && (
                    <span style={{ fontSize: "11px", fontWeight: "700", background: "#ede9fe", color: "#6d28d9", padding: "3px 8px", borderRadius: "4px" }}>
                      Bucket Packaging
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  {productToView.name}
                </h2>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "3px" }}>
                  Brand: <strong style={{ color: "#334155" }}>{productToView.brand || "GOLDEN HARVEST"}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProductToView(null)}
                style={{ background: "#f1f5f9", border: "none", color: "#64748b", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <div
                  style={{
                    width: "170px",
                    height: "170px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={formatProductImage(viewSelectedImg || productToView.image)}
                    alt={productToView.name}
                    onError={(e) => handleImageError(e, viewSelectedImg || productToView.image)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "8px",
                      background: productToView.inStock ? "rgba(22, 163, 74, 0.9)" : "rgba(220, 38, 38, 0.9)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {productToView.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Gallery Thumbnails in View Modal */}
                {Array.isArray(productToView.gallery) && productToView.gallery.length > 1 && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap", maxWidth: "170px" }}>
                    {productToView.gallery.slice(0, 5).map((gImg, idx) => {
                      const isActive = (viewSelectedImg || productToView.image) === gImg;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setViewSelectedImg(gImg)}
                          title={`View image ${idx + 1}`}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            border: isActive ? "2px solid #2563eb" : "1px solid #cbd5e1",
                            padding: 0,
                            cursor: "pointer",
                            background: "#fff",
                          }}
                        >
                          <img
                            src={formatProductImage(gImg)}
                            alt={`Thumb ${idx + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => handleImageError(e, gImg)}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                    ₹{Number(productToView.basePrice || 0).toLocaleString("en-IN")}
                  </span>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Base Price</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#f59e0b" }}>
                  <Star size={16} fill="#f59e0b" />
                  <span style={{ fontWeight: "700" }}>{productToView.rating || 4.8}</span>
                  <span style={{ color: "#64748b" }}>({productToView.reviewsCount || 0} reviews)</span>
                </div>

                {productToView.shortDesc && (
                  <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, background: "#f8fafc", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    {productToView.shortDesc}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                  <div>
                    <span style={{ color: "#64748b", display: "block" }}>Origin</span>
                    <strong style={{ color: "#1e293b" }}>{productToView.origin || "California / Kashmir"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", display: "block" }}>Storage</span>
                    <strong style={{ color: "#1e293b" }}>{productToView.storage || "Airtight container"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Options */}
            {Array.isArray(productToView.weightOptions) && productToView.weightOptions.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>
                  Weight Tiers & Prices
                </h4>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {productToView.weightOptions.map((opt, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                      }}
                    >
                      <strong style={{ color: "#1e293b" }}>{opt.weight}</strong>
                      <span style={{ color: "#15803d", fontWeight: "700" }}>₹{Number(opt.price || 0).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {productToView.description && (
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>
                  Full Description
                </h4>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>
                  {productToView.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
              <button
                type="button"
                onClick={() => setProductToView(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = productToView;
                  setProductToView(null);
                  handleOpenEditModal(p);
                }}
                style={{
                  background: "#172554",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Pencil size={15} />
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          Edit Product Modal
          ====================================================================== */}
      {productToEdit && (
        <div className="modal-overlay" onClick={() => !isSavingEdit && setProductToEdit(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "740px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "26px" }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  Edit Product
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
                  Update details for "{productToEdit.name}"
                </p>
              </div>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={() => setProductToEdit(null)}
                style={{ background: "#f1f5f9", border: "none", color: "#64748b", padding: "8px", borderRadius: "8px", cursor: isSavingEdit ? "not-allowed" : "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Form Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                {/* Product Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  >
                    {categories
                      .filter((c) => (c.categoryId || c.name)?.toLowerCase() !== "all" && c.name?.toLowerCase() !== "all dry fruits")
                      .map((c) => (
                        <option key={c.categoryId || c.name} value={c.categoryId || c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={editForm.brand}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    name="basePrice"
                    value={editForm.basePrice}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  />
                </div>

                {/* Badge */}
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Badge Tag (optional)
                  </label>
                  <input
                    type="text"
                    name="badge"
                    placeholder="e.g. Best Seller, Organic"
                    value={editForm.badge}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  />
                </div>

                {/* Stock Status */}
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Stock Availability
                  </label>
                  <select
                    name="inStock"
                    value={editForm.inStock ? "true" : "false"}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, inStock: e.target.value === "true" }))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  >
                    <option value="true">In Stock (Available)</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                {/* Is Bucket Packaging */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px" }}>
                  <input
                    type="checkbox"
                    id="editIsBucket"
                    name="isBucket"
                    checked={editForm.isBucket}
                    onChange={handleEditChange}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="editIsBucket" style={{ fontSize: "13.5px", fontWeight: "600", color: "#334155", cursor: "pointer" }}>
                    Bucket Packaging Item
                  </label>
                </div>

                {/* Weight Tiers Pricing */}
                <div style={{ gridColumn: "1 / -1", background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
                    Weight Options Pricing (₹)
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#64748b" }}>
                        500g Tier (₹)
                      </label>
                      <input
                        type="number"
                        name="weightOption1Price"
                        value={editForm.weightOption1Price}
                        onChange={handleEditChange}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#64748b" }}>
                        750g Tier (₹)
                      </label>
                      <input
                        type="number"
                        name="weightOption2Price"
                        value={editForm.weightOption2Price}
                        onChange={handleEditChange}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#64748b" }}>
                        1kg Tier (₹)
                      </label>
                      <input
                        type="number"
                        name="weightOption3Price"
                        value={editForm.weightOption3Price}
                        onChange={handleEditChange}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Multi-Image Gallery (Up to 5 Images) */}
                <div style={{ gridColumn: "1 / -1", background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <label style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
                      <Upload size={16} />
                      Product Images * (Up to 5 Images)
                    </label>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: editImages.length > 0 ? "#1e40af" : "#64748b",
                        background: editImages.length > 0 ? "#dbeafe" : "#e2e8f0",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      {editImages.length} / 5 Images
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px", alignItems: "center" }}>
                    {editImages.map((imgUrl, idx) => {
                      const isCover = idx === 0;
                      return (
                        <div
                          key={`${imgUrl}-${idx}`}
                          style={{
                            position: "relative",
                            width: "95px",
                            height: "95px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: isCover ? "2px solid #2563eb" : "1.5px solid #cbd5e1",
                            background: "#ffffff",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={formatProductImage(imgUrl)}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => handleImageError(e, imgUrl)}
                          />

                          {/* Badge */}
                          <div
                            style={{
                              position: "absolute",
                              top: "4px",
                              left: "4px",
                              background: isCover ? "rgba(30, 41, 59, 0.9)" : "rgba(0, 0, 0, 0.65)",
                              color: isCover ? "#facc15" : "#ffffff",
                              fontSize: "10px",
                              fontWeight: "700",
                              padding: "2px 5px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              gap: "2px",
                              lineHeight: 1.1,
                            }}
                          >
                            {isCover && <Star size={9} fill="#facc15" color="#facc15" />}
                            {isCover ? "Cover" : `#${idx + 1}`}
                          </div>

                          {/* Actions */}
                          <div style={{ position: "absolute", top: "4px", right: "4px", display: "flex", gap: "3px" }}>
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryEditImage(idx)}
                                title="Set as Main Cover Image"
                                style={{
                                  background: "rgba(255, 255, 255, 0.95)",
                                  color: "#ca8a04",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "20px",
                                  height: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                }}
                              >
                                <Star size={11} fill="#ca8a04" color="#ca8a04" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveEditImage(idx)}
                              title="Remove image"
                              style={{
                                background: "rgba(220, 38, 38, 0.88)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add More Tile */}
                    {editImages.length < 5 && (
                      <label
                        style={{
                          width: "95px",
                          height: "95px",
                          borderRadius: "8px",
                          border: "2px dashed #94a3b8",
                          background: "#f1f5f9",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          cursor: uploadingEditImg ? "not-allowed" : "pointer",
                          color: "#475569",
                          fontSize: "11px",
                          fontWeight: "600",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {uploadingEditImg ? (
                          <>
                            <Loader2 size={16} className="animate-spin" color="#2563eb" />
                            <span style={{ fontSize: "10px" }}>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={18} color="#2563eb" />
                            <span>Add Image</span>
                            <span style={{ fontSize: "9.5px", color: "#64748b" }}>
                              ({5 - editImages.length} left)
                            </span>
                          </>
                        )}
                        <input
                          key={`file-picker-${editFilePickerKey}`}
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={uploadingEditImg || editImages.length >= 5}
                          onChange={handleEditImageUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <label
                      style={{
                        background: editImages.length >= 5 ? "#94a3b8" : "#172554",
                        color: "#ffffff",
                        padding: "8px 14px",
                        borderRadius: "7px",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        cursor: editImages.length >= 5 || uploadingEditImg ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {uploadingEditImg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {uploadingEditImg ? "Uploading..." : "Upload Images (Up to 5)"}
                      <input
                        key={`file-picker-btn-${editFilePickerKey}`}
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadingEditImg || editImages.length >= 5}
                        onChange={handleEditImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>

                    <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                      Max 5MB each. First image is the main store cover.
                    </span>
                  </div>
                </div>

                {/* Short Description */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDesc"
                    value={editForm.shortDesc}
                    onChange={handleEditChange}
                    placeholder="Crispy, natural almonds rich in Vitamin E..."
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                  />
                </div>

                {/* Full Description */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Full Description
                  </label>
                  <textarea
                    rows="3"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px" }}
                  />
                </div>

                {/* Origin */}
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Origin
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={editForm.origin}
                    onChange={handleEditChange}
                    placeholder="e.g. California, USA"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  />
                </div>

                {/* Storage */}
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    Storage Instructions
                  </label>
                  <input
                    type="text"
                    name="storage"
                    value={editForm.storage}
                    onChange={handleEditChange}
                    placeholder="e.g. Store in a cool dry place"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                <button
                  type="button"
                  disabled={isSavingEdit}
                  onClick={() => setProductToEdit(null)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: isSavingEdit ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  style={{
                    background: "#172554",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#ffffff",
                    cursor: isSavingEdit ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
