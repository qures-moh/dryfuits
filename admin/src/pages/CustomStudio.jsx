import React, { useEffect, useRef, useState } from "react";
import {
  Gift,
  Plus,
  Trash2,
  Eye,
  Pencil,
  X,
  Upload,
  Loader2,
  Sparkles,
  Package,
  Ribbon as RibbonIcon,
  CheckCircle,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../context/ConfirmContext";
import api from "../api/axios";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const DEFAULT_CONTAINER = {
  name: "",
  price: "",
  material: "",
  capacity: "Fits 4-6 selections",
  image: "",
  badge: "Popular Choice",
};

const DEFAULT_FILLER = {
  name: "",
  price: "",
  category: "Nuts",
  image: "",
  weight: "150",
};

const DEFAULT_RIBBON = {
  name: "",
  price: "0",
  color: "#eab308",
};

const CustomStudio = () => {
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState("containers");
  const [loading, setLoading] = useState(true);

  const [containers, setContainers] = useState([]);
  const [fillers, setFillers] = useState([]);
  const [ribbons, setRibbons] = useState([]);

  const [itemToView, setItemToView] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);

  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newContainer, setNewContainer] =
    useState(DEFAULT_CONTAINER);

  const [newFiller, setNewFiller] =
    useState(DEFAULT_FILLER);

  const [newRibbon, setNewRibbon] =
    useState(DEFAULT_RIBBON);

  const [editForm, setEditForm] = useState({});

  const [containerErrors, setContainerErrors] =
    useState({});

  const [fillerErrors, setFillerErrors] =
    useState({});

  const [editErrors, setEditErrors] =
    useState({});

  const [containerPreview, setContainerPreview] =
    useState("");

  const [fillerPreview, setFillerPreview] =
    useState("");

  const [editImagePreview, setEditImagePreview] =
    useState("");

  const containerFileRef = useRef(null);
  const fillerFileRef = useRef(null);
  const editFileRef = useRef(null);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const res = await api.get("/custom-studio");

      if (res.data) {
        setContainers(res.data.containers || []);
        setFillers(res.data.fillers || []);
        setRibbons(res.data.ribbons || []);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load Custom Studio items",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const formatImage = (img) => {
    if (!img) {
      return "/images/bucket_hamper.jpg";
    }

    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:")
    ) {
      return img;
    }

    if (img.startsWith("/uploads")) {
      const baseURL = api.defaults.baseURL || "";

      const serverURL = baseURL.replace(/\/api\/?$/, "");

      return `${serverURL}${img}`;
    }

    return img;
  };

  const validateImage = (file, required = true) => {
    if (!file) {
      return required ? "Image is required" : "";
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPG, JPEG, PNG, WEBP, GIF and SVG images are allowed";
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return "Image size must be less than 5MB";
    }

    return "";
  };

  const handleUpload = async (e, type = "container") => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateImage(file);

    if (validationError) {
      if (type === "container") {
        setContainerErrors((prev) => ({
          ...prev,
          image: validationError,
        }));
      } else if (type === "filler") {
        setFillerErrors((prev) => ({
          ...prev,
          image: validationError,
        }));
      } else {
        setEditErrors((prev) => ({
          ...prev,
          image: validationError,
        }));
      }

      toast.error(validationError);

      if (
        type === "container" &&
        containerFileRef.current
      ) {
        containerFileRef.current.value = "";
      }

      if (
        type === "filler" &&
        fillerFileRef.current
      ) {
        fillerFileRef.current.value = "";
      }

      if (
        type === "edit" &&
        editFileRef.current
      ) {
        editFileRef.current.value = "";
      }

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "container") {
      setContainerPreview(previewUrl);

      setContainerErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }

    if (type === "filler") {
      setFillerPreview(previewUrl);

      setFillerErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }

    if (type === "edit") {
      setEditImagePreview(previewUrl);

      setEditErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }

    const uploadData = new FormData();

    uploadData.append("image", file);

    try {
      setUploadingImage(true);

      const res = await api.post(
        "/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data?.imageUrl) {
        if (type === "container") {
          setNewContainer((prev) => ({
            ...prev,
            image: res.data.imageUrl,
          }));

          setContainerErrors((prev) => ({
            ...prev,
            image: "",
          }));
        }

        if (type === "filler") {
          setNewFiller((prev) => ({
            ...prev,
            image: res.data.imageUrl,
          }));

          setFillerErrors((prev) => ({
            ...prev,
            image: "",
          }));
        }

        if (type === "edit") {
          setEditForm((prev) => ({
            ...prev,
            image: res.data.imageUrl,
          }));

          setEditErrors((prev) => ({
            ...prev,
            image: "",
          }));
        }

        toast.success("Image uploaded successfully!");
      } else {
        const message =
          "Image upload failed. Server did not return image path";

        if (type === "container") {
          setContainerErrors((prev) => ({
            ...prev,
            image: message,
          }));
        }

        if (type === "filler") {
          setFillerErrors((prev) => ({
            ...prev,
            image: message,
          }));
        }

        if (type === "edit") {
          setEditErrors((prev) => ({
            ...prev,
            image: message,
          }));
        }

        toast.error(message);
      }
    } catch (err) {
      console.error("Image upload error:", err);

      const message =
        err.response?.data?.message ||
        "Image upload failed. Please try again.";

      if (type === "container") {
        setContainerErrors((prev) => ({
          ...prev,
          image: message,
        }));
      }

      if (type === "filler") {
        setFillerErrors((prev) => ({
          ...prev,
          image: message,
        }));
      }

      if (type === "edit") {
        setEditErrors((prev) => ({
          ...prev,
          image: message,
        }));
      }

      toast.error(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveContainerImage = () => {
    setNewContainer((prev) => ({
      ...prev,
      image: "",
    }));

    setContainerPreview("");

    setContainerErrors((prev) => ({
      ...prev,
      image: "Container image is required",
    }));

    if (containerFileRef.current) {
      containerFileRef.current.value = "";
    }
  };

  const handleRemoveFillerImage = () => {
    setNewFiller((prev) => ({
      ...prev,
      image: "",
    }));

    setFillerPreview("");

    setFillerErrors((prev) => ({
      ...prev,
      image: "Filler image is required",
    }));

    if (fillerFileRef.current) {
      fillerFileRef.current.value = "";
    }
  };

  const handleRemoveEditImage = () => {
    setEditForm((prev) => ({
      ...prev,
      image: "",
    }));

    setEditImagePreview("");

    setEditErrors((prev) => ({
      ...prev,
      image: "Image is required",
    }));

    if (editFileRef.current) {
      editFileRef.current.value = "";
    }
  };

  const validateContainer = () => {
    const errors = {};

    if (!newContainer.name.trim()) {
      errors.name = "Container name is required";
    }

    if (
      newContainer.price === "" ||
      Number(newContainer.price) < 0
    ) {
      errors.price = "Valid price is required";
    }

    if (!newContainer.image?.trim()) {
      errors.image = "Container image is required";
    }

    setContainerErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateFiller = () => {
    const errors = {};

    if (!newFiller.name.trim()) {
      errors.name = "Filler name is required";
    }

    if (
      newFiller.price === "" ||
      Number(newFiller.price) < 0
    ) {
      errors.price = "Valid filler price is required";
    }

    if (
      newFiller.weight === "" ||
      Number(newFiller.weight) <= 0
    ) {
      errors.weight = "Valid weight is required";
    }

    if (!newFiller.category) {
      errors.category = "Category is required";
    }

    if (!newFiller.image?.trim()) {
      errors.image = "Filler image is required";
    }

    setFillerErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editForm.name?.trim()) {
      errors.name = "Item name is required";
    }

    if (
      editForm.price === "" ||
      editForm.price === undefined ||
      Number(editForm.price) < 0
    ) {
      errors.price = "Valid price is required";
    }

    if (
      itemToEdit?.type === "container" &&
      !editForm.image?.trim()
    ) {
      errors.image = "Container image is required";
    }

    if (
      itemToEdit?.type === "filler" &&
      !editForm.image?.trim()
    ) {
      errors.image = "Filler image is required";
    }

    if (
      itemToEdit?.type === "filler" &&
      (
        editForm.weight === "" ||
        editForm.weight === undefined ||
        Number(editForm.weight) <= 0
      )
    ) {
      errors.weight = "Valid weight is required";
    }

    setEditErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddContainer = async (e) => {
    e.preventDefault();

    if (!validateContainer()) {
      toast.error("Please fix the required fields");
      return;
    }

    try {
      const res = await api.post(
        "/custom-studio",
        {
          type: "container",
          ...newContainer,
          name: newContainer.name.trim(),
          material: newContainer.material.trim(),
          capacity: newContainer.capacity.trim(),
          badge: newContainer.badge.trim(),
          price: Number(newContainer.price),
        },
      );

      setContainers((prev) => [
        ...prev,
        res.data,
      ]);

      setNewContainer({
        ...DEFAULT_CONTAINER,
      });

      setContainerPreview("");
      setContainerErrors({});

      if (containerFileRef.current) {
        containerFileRef.current.value = "";
      }

      toast.success(
        "Packaging container added successfully!",
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to add container",
      );
    }
  };

  const handleAddFiller = async (e) => {
    e.preventDefault();

    if (!validateFiller()) {
      toast.error("Please fix the required fields");
      return;
    }

    try {
      const res = await api.post(
        "/custom-studio",
        {
          type: "filler",
          ...newFiller,
          name: newFiller.name.trim(),
          price: Number(newFiller.price),
          weight: Number(newFiller.weight),
          category: newFiller.category,
          image: newFiller.image,
        },
      );

      setFillers((prev) => [
        ...prev,
        res.data,
      ]);

      setNewFiller({
        ...DEFAULT_FILLER,
      });

      setFillerPreview("");
      setFillerErrors({});

      if (fillerFileRef.current) {
        fillerFileRef.current.value = "";
      }

      toast.success(
        "Dry fruit filler added successfully!",
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to add filler",
      );
    }
  };

  const handleAddRibbon = async (e) => {
    e.preventDefault();

    if (!newRibbon.name.trim()) {
      toast.error("Ribbon name is required");
      return;
    }

    if (
      newRibbon.price === "" ||
      Number(newRibbon.price) < 0
    ) {
      toast.error("Valid ribbon price is required");
      return;
    }

    if (!newRibbon.color) {
      toast.error("Ribbon color is required");
      return;
    }

    try {
      const res = await api.post(
        "/custom-studio",
        {
          type: "ribbon",
          ...newRibbon,
          name: newRibbon.name.trim(),
          price: Number(newRibbon.price),
        },
      );

      setRibbons((prev) => [
        ...prev,
        res.data,
      ]);

      setNewRibbon({
        ...DEFAULT_RIBBON,
      });

      toast.success(
        "Gift ribbon added successfully!",
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to add ribbon",
      );
    }
  };

  const handleOpenEdit = (item) => {
    setEditForm({
      ...item,
    });

    setEditErrors({});

    if (
      item.type === "container" ||
      item.type === "filler"
    ) {
      setEditImagePreview(
        item.image
          ? formatImage(item.image)
          : "",
      );
    } else {
      setEditImagePreview("");
    }

    setItemToEdit(item);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!itemToEdit) {
      return;
    }

    if (!validateEditForm()) {
      toast.error("Please fix the required fields");
      return;
    }

    try {
      setIsSavingEdit(true);

      const payload = {
        ...editForm,
        name: editForm.name.trim(),
        price: Number(editForm.price),
      };

      if (itemToEdit.type === "filler") {
        payload.weight = Number(editForm.weight);
        payload.image = editForm.image;
      }

      const res = await api.put(
        `/custom-studio/${itemToEdit._id}`,
        payload,
      );

      const updated = res.data;

      if (updated.type === "container") {
        setContainers((prev) =>
          prev.map((item) =>
            item._id === updated._id
              ? updated
              : item,
          ),
        );
      } else if (updated.type === "filler") {
        setFillers((prev) =>
          prev.map((item) =>
            item._id === updated._id
              ? updated
              : item,
          ),
        );
      } else if (updated.type === "ribbon") {
        setRibbons((prev) =>
          prev.map((item) =>
            item._id === updated._id
              ? updated
              : item,
          ),
        );
      }

      toast.success(
        `"${updated.name}" updated successfully!`,
      );

      setItemToEdit(null);
      setEditForm({});
      setEditErrors({});
      setEditImagePreview("");

      if (editFileRef.current) {
        editFileRef.current.value = "";
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update item",
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (item) => {
    const isConfirmed = await confirm({
      title: "Delete Custom Studio Item",
      message: `Are you sure you want to delete "${item.name}"? It will no longer be available in the customer Custom Studio builder.`,
      confirmText: "Yes, Delete Item",
      variant: "danger",
      iconType: "trash",
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(
        `/custom-studio/${item._id}`,
      );

      if (item.type === "container") {
        setContainers((prev) =>
          prev.filter(
            (i) => i._id !== item._id,
          ),
        );
      } else if (item.type === "filler") {
        setFillers((prev) =>
          prev.filter(
            (i) => i._id !== item._id,
          ),
        );
      } else if (item.type === "ribbon") {
        setRibbons((prev) =>
          prev.filter(
            (i) => i._id !== item._id,
          ),
        );
      }

      toast.success(
        `"${item.name}" deleted.`,
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete item",
      );
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
    boxSizing: "border-box",
  };

  const errorInputStyle = {
    ...inputStyle,
    border: "1px solid #ef4444",
    background: "#fffafa",
  };

  const errorTextStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "6px",
  };

  const uploadBoxStyle = {
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "20px",
    background: "#f8fafc",
  };

  const uploadPreviewStyle = {
    width: "138px",
    height: "138px",
    borderRadius: "12px",
    border: "1px solid #dbe3ee",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  };

  const chooseButtonStyle = {
    background: "#172554",
    color: "#ffffff",
    border: "none",
    padding: "13px 22px",
    borderRadius: "9px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: uploadingImage
      ? "not-allowed"
      : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
  };

  const currentItems =
    activeTab === "containers"
      ? containers
      : activeTab === "fillers"
        ? fillers
        : ribbons;

  return (
    <div
      className="dashboard-page"
      style={{
        paddingBottom: "60px",
      }}
    >
      <div
        className="dashboard-header"
        style={{
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            className="dashboard-title"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Gift
              size={26}
              color="#eab308"
            />
            Custom Studio Builder
          </h1>

          <p className="dashboard-subtitle">
            Manage packaging containers, dry fruit
            fillers, and gift ribbons for the
            3-step customer builder
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom:
            "1px solid #e2e8f0",
          marginBottom: "24px",
          paddingBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() =>
            setActiveTab("containers")
          }
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "1px solid",
            borderColor:
              activeTab === "containers"
                ? "#172554"
                : "#e2e8f0",
            background:
              activeTab === "containers"
                ? "#172554"
                : "#ffffff",
            color:
              activeTab === "containers"
                ? "#ffffff"
                : "#64748b",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Package size={16} />
          Step 1: Containers ({containers.length})
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("fillers")
          }
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "1px solid",
            borderColor:
              activeTab === "fillers"
                ? "#172554"
                : "#e2e8f0",
            background:
              activeTab === "fillers"
                ? "#172554"
                : "#ffffff",
            color:
              activeTab === "fillers"
                ? "#ffffff"
                : "#64748b",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Sparkles size={16} />
          Step 2: Dry Fruit Fillers ({fillers.length})
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("ribbons")
          }
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            border: "1px solid",
            borderColor:
              activeTab === "ribbons"
                ? "#172554"
                : "#e2e8f0",
            background:
              activeTab === "ribbons"
                ? "#172554"
                : "#ffffff",
            color:
              activeTab === "ribbons"
                ? "#ffffff"
                : "#64748b",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <RibbonIcon size={16} />
          Step 3: Ribbons & Tags ({ribbons.length})
        </button>
      </div>

      <div className="admin-split-layout">
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            height: "fit-content",
          }}
        >
          {activeTab === "containers" && (
            <form
              onSubmit={handleAddContainer}
            >
              <h3
                style={{
                  marginBottom: "18px",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Add Packaging Container
              </h3>

              <div
                style={{
                  marginBottom: "14px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Container Name *
                </label>

                <input
                  type="text"
                  placeholder="e.g. Royal Kashmiri Walnut Box"
                  value={newContainer.name}
                  onChange={(e) => {
                    setNewContainer(
                      (prev) => ({
                        ...prev,
                        name: e.target.value,
                      }),
                    );

                    if (
                      e.target.value.trim()
                    ) {
                      setContainerErrors(
                        (prev) => ({
                          ...prev,
                          name: "",
                        }),
                      );
                    }
                  }}
                  style={
                    containerErrors.name
                      ? errorInputStyle
                      : inputStyle
                  }
                />

                {containerErrors.name && (
                  <span
                    style={
                      errorTextStyle
                    }
                  >
                    <AlertCircle
                      size={13}
                    />
                    {containerErrors.name}
                  </span>
                )}
              </div>

              <div className="admin-form-grid-2">
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#334155",
                    }}
                  >
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="450"
                    value={
                      newContainer.price
                    }
                    onChange={(e) => {
                      setNewContainer(
                        (prev) => ({
                          ...prev,
                          price: e.target.value,
                        }),
                      );

                      if (
                        e.target.value !==
                          "" &&
                        Number(
                          e.target.value,
                        ) >= 0
                      ) {
                        setContainerErrors(
                          (prev) => ({
                            ...prev,
                            price: "",
                          }),
                        );
                      }
                    }}
                    style={
                      containerErrors.price
                        ? errorInputStyle
                        : inputStyle
                    }
                  />

                  {containerErrors.price && (
                    <span
                      style={
                        errorTextStyle
                      }
                    >
                      <AlertCircle
                        size={13}
                      />
                      {
                        containerErrors.price
                      }
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#334155",
                    }}
                  >
                    Badge Tag
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Most Popular"
                    value={
                      newContainer.badge
                    }
                    onChange={(e) =>
                      setNewContainer(
                        (prev) => ({
                          ...prev,
                          badge: e.target.value,
                        }),
                      )
                    }
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  marginBottom: "14px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Material Craftsmanship
                </label>

                <input
                  type="text"
                  placeholder="e.g. Natural Pine with Copper Hoops"
                  value={
                    newContainer.material
                  }
                  onChange={(e) =>
                    setNewContainer(
                      (prev) => ({
                        ...prev,
                        material:
                          e.target.value,
                      }),
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  marginBottom: "16px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Capacity Info
                </label>

                <input
                  type="text"
                  placeholder="e.g. Fits 4-6 dry fruit selections"
                  value={
                    newContainer.capacity
                  }
                  onChange={(e) =>
                    setNewContainer(
                      (prev) => ({
                        ...prev,
                        capacity:
                          e.target.value,
                      }),
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    marginBottom: "10px",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#0f172a",
                  }}
                >
                  <ImageIcon size={17} />
                  Container Image *
                </label>

                <div
                  style={{
                    ...uploadBoxStyle,
                    borderColor:
                      containerErrors.image
                        ? "#ef4444"
                        : "#cbd5e1",
                    background:
                      containerErrors.image
                        ? "#fffafa"
                        : "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={
                        uploadPreviewStyle
                      }
                    >
                      {containerPreview ||
                      newContainer.image ? (
                        <>
                          <img
                            src={
                              containerPreview ||
                              formatImage(
                                newContainer.image,
                              )
                            }
                            alt="Container preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit:
                                "cover",
                            }}
                          />

                          <button
                            type="button"
                            onClick={
                              handleRemoveContainerImage
                            }
                            title="Remove image"
                            style={{
                              position:
                                "absolute",
                              top: "7px",
                              right: "7px",
                              width: "28px",
                              height: "28px",
                              border: "none",
                              borderRadius:
                                "50%",
                              background:
                                "rgba(0,0,0,0.6)",
                              color:
                                "#ffffff",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              cursor:
                                "pointer",
                            }}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <ImageIcon
                          size={42}
                          color="#94a3b8"
                        />
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: "220px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          containerFileRef.current?.click()
                        }
                        disabled={
                          uploadingImage
                        }
                        style={
                          chooseButtonStyle
                        }
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload
                              size={17}
                            />
                            Choose Image from Computer
                          </>
                        )}
                      </button>

                      <input
                        ref={
                          containerFileRef
                        }
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.gif,.svg,image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={(e) =>
                          handleUpload(
                            e,
                            "container",
                          )
                        }
                        style={{
                          display: "none",
                        }}
                      />

                      <p
                        style={{
                          margin:
                            "10px 0 0",
                          fontSize: "12px",
                          color:
                            "#64748b",
                          lineHeight:
                            "1.5",
                        }}
                      >
                        Supports JPG, PNG,
                        WEBP, GIF and SVG.
                        Max 5MB.
                      </p>

                      {newContainer.image &&
                        !containerErrors.image && (
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "5px",
                              color:
                                "#16a34a",
                              fontSize:
                                "12px",
                              marginTop:
                                "7px",
                              fontWeight:
                                "600",
                            }}
                          >
                            <CheckCircle
                              size={14}
                            />
                            Image uploaded
                            successfully
                          </div>
                        )}
                    </div>
                  </div>

                  {containerErrors.image && (
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "6px",
                        color:
                          "#ef4444",
                        fontSize:
                          "12px",
                        marginTop:
                          "12px",
                        lineHeight:
                          "1.4",
                      }}
                    >
                      <AlertCircle
                        size={15}
                      />
                      {
                        containerErrors.image
                      }
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  uploadingImage
                }
                style={{
                  width: "100%",
                  background:
                    "#172554",
                  color:
                    "#ffffff",
                  padding: "11px",
                  borderRadius:
                    "8px",
                  fontWeight:
                    "600",
                  border:
                    "none",
                  cursor:
                    uploadingImage
                      ? "not-allowed"
                      : "pointer",
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  gap: "8px",
                  opacity:
                    uploadingImage
                      ? 0.6
                      : 1,
                }}
              >
                <Plus size={16} />
                Add Container
              </button>
            </form>
          )}

          {activeTab === "fillers" && (
            <form
              onSubmit={handleAddFiller}
            >
              <h3
                style={{
                  marginBottom:
                    "16px",
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#0f172a",
                }}
              >
                Add Dry Fruit Filler
              </h3>

              <div
                style={{
                  marginBottom:
                    "14px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "6px",
                    fontWeight:
                      "600",
                    fontSize:
                      "13px",
                    color:
                      "#334155",
                  }}
                >
                  Filler Name *
                </label>

                <input
                  type="text"
                  placeholder="e.g. Jumbo Roasted Cashews (150g)"
                  value={
                    newFiller.name
                  }
                  onChange={(e) => {
                    setNewFiller(
                      (prev) => ({
                        ...prev,
                        name:
                          e.target
                            .value,
                      }),
                    );

                    if (
                      e.target.value.trim()
                    ) {
                      setFillerErrors(
                        (prev) => ({
                          ...prev,
                          name: "",
                        }),
                      );
                    }
                  }}
                  style={
                    fillerErrors.name
                      ? errorInputStyle
                      : inputStyle
                  }
                />

                {fillerErrors.name && (
                  <span
                    style={
                      errorTextStyle
                    }
                  >
                    <AlertCircle
                      size={13}
                    />
                    {
                      fillerErrors.name
                    }
                  </span>
                )}
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                  marginBottom:
                    "14px",
                }}
              >
                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "6px",
                      fontWeight:
                        "600",
                      fontSize:
                        "13px",
                      color:
                        "#334155",
                    }}
                  >
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="180"
                    value={
                      newFiller.price
                    }
                    onChange={(e) => {
                      setNewFiller(
                        (prev) => ({
                          ...prev,
                          price:
                            e.target
                              .value,
                        }),
                      );

                      if (
                        e.target.value !==
                          "" &&
                        Number(
                          e.target.value,
                        ) >= 0
                      ) {
                        setFillerErrors(
                          (prev) => ({
                            ...prev,
                            price: "",
                          }),
                        );
                      }
                    }}
                    style={
                      fillerErrors.price
                        ? errorInputStyle
                        : inputStyle
                    }
                  />

                  {fillerErrors.price && (
                    <span
                      style={
                        errorTextStyle
                      }
                    >
                      <AlertCircle
                        size={13}
                      />
                      {
                        fillerErrors.price
                      }
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "6px",
                      fontWeight:
                        "600",
                      fontSize:
                        "13px",
                      color:
                        "#334155",
                    }}
                  >
                    Weight (grams) *
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="150"
                    value={
                      newFiller.weight
                    }
                    onChange={(e) => {
                      setNewFiller(
                        (prev) => ({
                          ...prev,
                          weight:
                            e.target
                              .value,
                        }),
                      );

                      if (
                        e.target.value !==
                          "" &&
                        Number(
                          e.target.value,
                        ) > 0
                      ) {
                        setFillerErrors(
                          (prev) => ({
                            ...prev,
                            weight: "",
                          }),
                        );
                      }
                    }}
                    style={
                      fillerErrors.weight
                        ? errorInputStyle
                        : inputStyle
                    }
                  />

                  {fillerErrors.weight && (
                    <span
                      style={
                        errorTextStyle
                      }
                    >
                      <AlertCircle
                        size={13}
                      />
                      {
                        fillerErrors.weight
                      }
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  marginBottom:
                    "20px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "6px",
                    fontWeight:
                      "600",
                    fontSize:
                      "13px",
                    color:
                      "#334155",
                  }}
                >
                  Category *
                </label>

                <select
                  value={
                    newFiller.category
                  }
                  onChange={(e) => {
                    setNewFiller(
                      (prev) => ({
                        ...prev,
                        category:
                          e.target
                            .value,
                      }),
                    );

                    if (
                      e.target.value
                    ) {
                      setFillerErrors(
                        (prev) => ({
                          ...prev,
                          category:
                            "",
                        }),
                      );
                    }
                  }}
                  style={
                    fillerErrors.category
                      ? errorInputStyle
                      : inputStyle
                  }
                >
                  <option value="">
                    Select Category
                  </option>
                  <option value="Nuts">
                    Nuts
                  </option>
                  <option value="Dates & Figs">
                    Dates & Figs
                  </option>
                  <option value="Berries">
                    Berries
                  </option>
                  <option value="Spices">
                    Spices
                  </option>
                  <option value="Seeds">
                    Seeds
                  </option>
                </select>

                {fillerErrors.category && (
                  <span
                    style={
                      errorTextStyle
                    }
                  >
                    <AlertCircle
                      size={13}
                    />
                    {
                      fillerErrors.category
                    }
                  </span>
                )}
              </div>

              <div
                style={{
                  marginBottom:
                    "20px",
                }}
              >
                <label
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "7px",
                    marginBottom:
                      "10px",
                    fontWeight:
                      "600",
                    fontSize:
                      "14px",
                    color:
                      "#0f172a",
                  }}
                >
                  <ImageIcon
                    size={17}
                  />
                  Filler Image *
                </label>

                <div
                  style={{
                    ...uploadBoxStyle,
                    borderColor:
                      fillerErrors.image
                        ? "#ef4444"
                        : "#cbd5e1",
                    background:
                      fillerErrors.image
                        ? "#fffafa"
                        : "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      gap: "20px",
                      alignItems:
                        "center",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div
                      style={
                        uploadPreviewStyle
                      }
                    >
                      {fillerPreview ||
                      newFiller.image ? (
                        <>
                          <img
                            src={
                              fillerPreview ||
                              formatImage(
                                newFiller.image,
                              )
                            }
                            alt="Filler preview"
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />

                          <button
                            type="button"
                            onClick={
                              handleRemoveFillerImage
                            }
                            title="Remove image"
                            style={{
                              position:
                                "absolute",
                              top: "7px",
                              right: "7px",
                              width:
                                "28px",
                              height:
                                "28px",
                              border:
                                "none",
                              borderRadius:
                                "50%",
                              background:
                                "rgba(0,0,0,0.6)",
                              color:
                                "#ffffff",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              cursor:
                                "pointer",
                            }}
                          >
                            <X
                              size={16}
                            />
                          </button>
                        </>
                      ) : (
                        <ImageIcon
                          size={42}
                          color="#94a3b8"
                        />
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth:
                          "220px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          fillerFileRef.current?.click()
                        }
                        disabled={
                          uploadingImage
                        }
                        style={
                          chooseButtonStyle
                        }
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload
                              size={17}
                            />
                            Choose Image from Computer
                          </>
                        )}
                      </button>

                      <input
                        ref={
                          fillerFileRef
                        }
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.gif,.svg,image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={(e) =>
                          handleUpload(
                            e,
                            "filler",
                          )
                        }
                        style={{
                          display:
                            "none",
                        }}
                      />

                      <p
                        style={{
                          margin:
                            "10px 0 0",
                          fontSize:
                            "12px",
                          color:
                            "#64748b",
                          lineHeight:
                            "1.5",
                        }}
                      >
                        Supports JPG, PNG,
                        WEBP, GIF and SVG.
                        Max 5MB.
                      </p>

                      {newFiller.image &&
                        !fillerErrors.image && (
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "5px",
                              color:
                                "#16a34a",
                              fontSize:
                                "12px",
                              marginTop:
                                "7px",
                              fontWeight:
                                "600",
                            }}
                          >
                            <CheckCircle
                              size={14}
                            />
                            Image uploaded
                            successfully
                          </div>
                        )}
                    </div>
                  </div>

                  {fillerErrors.image && (
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "6px",
                        color:
                          "#ef4444",
                        fontSize:
                          "12px",
                        marginTop:
                          "12px",
                        lineHeight:
                          "1.4",
                      }}
                    >
                      <AlertCircle
                        size={15}
                      />
                      {
                        fillerErrors.image
                      }
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  uploadingImage
                }
                style={{
                  width: "100%",
                  background:
                    "#172554",
                  color:
                    "#ffffff",
                  padding:
                    "10px",
                  borderRadius:
                    "8px",
                  fontWeight:
                    "600",
                  border:
                    "none",
                  cursor:
                    uploadingImage
                      ? "not-allowed"
                      : "pointer",
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  gap: "8px",
                  opacity:
                    uploadingImage
                      ? 0.6
                      : 1,
                }}
              >
                <Plus size={16} />
                Add Filler
              </button>
            </form>
          )}

          {activeTab === "ribbons" && (
            <form
              onSubmit={handleAddRibbon}
            >
              <h3
                style={{
                  marginBottom:
                    "16px",
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#0f172a",
                }}
              >
                Add Ribbon & Tag
              </h3>

              <div
                style={{
                  marginBottom:
                    "14px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "6px",
                    fontWeight:
                      "600",
                    fontSize:
                      "13px",
                    color:
                      "#334155",
                  }}
                >
                  Ribbon Style Name *
                </label>

                <input
                  type="text"
                  placeholder="e.g. Royal Crimson Silk"
                  value={
                    newRibbon.name
                  }
                  onChange={(e) =>
                    setNewRibbon(
                      (prev) => ({
                        ...prev,
                        name:
                          e.target
                            .value,
                      }),
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                  marginBottom:
                    "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "6px",
                      fontWeight:
                        "600",
                      fontSize:
                        "13px",
                      color:
                        "#334155",
                    }}
                  >
                    Extra Cost (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={
                      newRibbon.price
                    }
                    onChange={(e) =>
                      setNewRibbon(
                        (prev) => ({
                          ...prev,
                          price:
                            e.target
                              .value,
                        }),
                      )
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "6px",
                      fontWeight:
                        "600",
                      fontSize:
                        "13px",
                      color:
                        "#334155",
                    }}
                  >
                    Accent Color
                  </label>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "8px",
                      alignItems:
                        "center",
                    }}
                  >
                    <input
                      type="color"
                      value={
                        newRibbon.color
                      }
                      onChange={(e) =>
                        setNewRibbon(
                          (prev) => ({
                            ...prev,
                            color:
                              e.target
                                .value,
                          }),
                        )
                      }
                      style={{
                        width:
                          "42px",
                        height:
                          "42px",
                        borderRadius:
                          "8px",
                        border:
                          "none",
                        cursor:
                          "pointer",
                        padding:
                          "2px",
                      }}
                    />

                    <input
                      type="text"
                      value={
                        newRibbon.color
                      }
                      onChange={(e) =>
                        setNewRibbon(
                          (prev) => ({
                            ...prev,
                            color:
                              e.target
                                .value,
                          }),
                        )
                      }
                      style={{
                        ...inputStyle,
                        flex: 1,
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background:
                    "#172554",
                  color:
                    "#ffffff",
                  padding:
                    "10px",
                  borderRadius:
                    "8px",
                  fontWeight:
                    "600",
                  border:
                    "none",
                  cursor:
                    "pointer",
                  display:
                    "flex",
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                  gap: "8px",
                }}
              >
                <Plus size={16} />
                Add Ribbon
              </button>
            </form>
          )}
        </div>

        <div className="recent-orders-card">
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th
                    style={{
                      width: "70px",
                      textAlign:
                        "center",
                    }}
                  >
                    {activeTab ===
                      "ribbons"
                      ? "COLOR"
                      : "IMAGE"}
                  </th>

                  <th>
                    NAME & DETAILS
                  </th>

                  <th
                    style={{
                      width: "100px",
                    }}
                  >
                    PRICE
                  </th>

                  <th
                    style={{
                      width: "120px",
                      textAlign:
                        "center",
                    }}
                  >
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "40px",
                      }}
                    >
                      <Loader2
                        size={28}
                        className="animate-spin"
                        style={{
                          margin:
                            "0 auto 10px auto",
                          color:
                            "#2563eb",
                        }}
                      />

                      Loading items...
                    </td>
                  </tr>
                ) : currentItems.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "40px",
                        color:
                          "#64748b",
                      }}
                    >
                      No items found
                    </td>
                  </tr>
                ) : (
                  currentItems.map(
                    (item) => (
                      <tr
                        key={
                          item._id
                        }
                      >
                        <td
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "12px 8px",
                          }}
                        >
                          {item.type ===
                            "container" && (
                            <div
                              style={{
                                width:
                                  "48px",
                                height:
                                  "48px",
                                borderRadius:
                                  "8px",
                                overflow:
                                  "hidden",
                                border:
                                  "1px solid #e2e8f0",
                                margin:
                                  "0 auto",
                              }}
                            >
                              <img
                                src={formatImage(
                                  item.image,
                                )}
                                alt={
                                  item.name
                                }
                                style={{
                                  width:
                                    "100%",
                                  height:
                                    "100%",
                                  objectFit:
                                    "cover",
                                }}
                              />
                            </div>
                          )}

                          {item.type ===
                            "filler" && (
                            <div
                              style={{
                                width:
                                  "48px",
                                height:
                                  "48px",
                                borderRadius:
                                  "8px",
                                overflow:
                                  "hidden",
                                border:
                                  "1px solid #e2e8f0",
                                margin:
                                  "0 auto",
                                background:
                                  "#f8fafc",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                              }}
                            >
                              {item.image ? (
                                <img
                                  src={formatImage(
                                    item.image,
                                  )}
                                  alt={
                                    item.name
                                  }
                                  style={{
                                    width:
                                      "100%",
                                    height:
                                      "100%",
                                    objectFit:
                                      "cover",
                                  }}
                                />
                              ) : (
                                <ImageIcon
                                  size={
                                    22
                                  }
                                  color="#94a3b8"
                                />
                              )}
                            </div>
                          )}

                          {item.type ===
                            "ribbon" && (
                            <span
                              style={{
                                display:
                                  "inline-block",
                                width:
                                  "24px",
                                height:
                                  "24px",
                                borderRadius:
                                  "50%",
                                background:
                                  item.color,
                                border:
                                  "2px solid #e2e8f0",
                              }}
                            />
                          )}
                        </td>

                        <td>
                          <strong
                            style={{
                              fontSize:
                                "14px",
                              color:
                                "#1e293b",
                              display:
                                "block",
                            }}
                          >
                            {item.name}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#64748b",
                              marginTop:
                                "3px",
                              display:
                                "flex",
                              gap:
                                "8px",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            {item.type ===
                              "container" && (
                              <>
                                <span>
                                  {
                                    item.capacity
                                  }
                                </span>

                                {item.badge && (
                                  <span>
                                    •{" "}
                                    <strong
                                      style={{
                                        color:
                                          "#d97706",
                                      }}
                                    >
                                      {
                                        item.badge
                                      }
                                    </strong>
                                  </span>
                                )}
                              </>
                            )}

                            {item.type ===
                              "filler" && (
                              <>
                                <span>
                                  Category:{" "}
                                  {
                                    item.category
                                  }
                                </span>

                                <span>
                                  •
                                </span>

                                <span>
                                  Weight:{" "}
                                  {
                                    item.weight
                                  }
                                  g
                                </span>
                              </>
                            )}

                            {item.type ===
                              "ribbon" && (
                              <span>
                                Color:{" "}
                                <code>
                                  {
                                    item.color
                                  }
                                </code>
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <strong
                            style={{
                              color:
                                "#0f172a",
                              fontSize:
                                "14px",
                            }}
                          >
                            {item.price >
                            0
                              ? `₹${item.price}`
                              : "Free"}
                          </strong>
                        </td>

                        <td
                          style={{
                            textAlign:
                              "center",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: "6px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setItemToView(
                                  item,
                                )
                              }
                              title="View Details"
                              style={{
                                background:
                                  "#eff6ff",
                                border:
                                  "1px solid #bfdbfe",
                                color:
                                  "#1d4ed8",
                                padding:
                                  "6px 8px",
                                borderRadius:
                                  "6px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              <Eye
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenEdit(
                                  item,
                                )
                              }
                              title="Edit Item"
                              style={{
                                background:
                                  "#fef3c7",
                                border:
                                  "1px solid #fde68a",
                                color:
                                  "#b45309",
                                padding:
                                  "6px 8px",
                                borderRadius:
                                  "6px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              <Pencil
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item,
                                )
                              }
                              title="Delete Item"
                              style={{
                                background:
                                  "#fee2e2",
                                border:
                                  "1px solid #fecaca",
                                color:
                                  "#dc2626",
                                padding:
                                  "6px 8px",
                                borderRadius:
                                  "6px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              <Trash2
                                size={14}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {itemToView && (
        <div
          className="modal-overlay"
          onClick={() =>
            setItemToView(null)
          }
        >
          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              maxWidth:
                "480px",
              width:
                "100%",
              padding:
                "24px",
            }}
          >
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                marginBottom:
                  "16px",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width:
                      "40px",
                    height:
                      "40px",
                    borderRadius:
                      "10px",
                    background:
                      "#fef3c7",
                    color:
                      "#b45309",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <Gift
                    size={20}
                  />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize:
                        "16px",
                      fontWeight:
                        "700",
                      color:
                        "#0f172a",
                      margin:
                        0,
                    }}
                  >
                    {
                      itemToView.name
                    }
                  </h3>

                  <span
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#64748b",
                      textTransform:
                        "capitalize",
                    }}
                  >
                    Custom Studio{" "}
                    {
                      itemToView.type
                    }
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setItemToView(
                    null,
                  )
                }
                style={{
                  background:
                    "#f1f5f9",
                  border:
                    "none",
                  color:
                    "#64748b",
                  padding:
                    "6px",
                  borderRadius:
                    "6px",
                  cursor:
                    "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                background:
                  "#f8fafc",
                borderRadius:
                  "10px",
                padding:
                  "16px",
                border:
                  "1px solid #e2e8f0",
                marginBottom:
                  "20px",
              }}
            >
              {itemToView.type ===
                "container" && (
                <div
                  style={{
                    display:
                      "flex",
                    gap: "16px",
                    alignItems:
                      "center",
                    marginBottom:
                      "14px",
                  }}
                >
                  <img
                    src={formatImage(
                      itemToView.image,
                    )}
                    alt={
                      itemToView.name
                    }
                    style={{
                      width:
                        "90px",
                      height:
                        "90px",
                      objectFit:
                        "cover",
                      borderRadius:
                        "8px",
                      border:
                        "1px solid #e2e8f0",
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontSize:
                          "20px",
                        fontWeight:
                          "800",
                        color:
                          "#0f172a",
                      }}
                    >
                      ₹
                      {
                        itemToView.price
                      }
                    </div>

                    <div
                      style={{
                        fontSize:
                          "13px",
                        color:
                          "#475569",
                        marginTop:
                          "4px",
                      }}
                    >
                      {
                        itemToView.material
                      }
                    </div>

                    <div
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#64748b",
                        marginTop:
                          "2px",
                      }}
                    >
                      {
                        itemToView.capacity
                      }
                    </div>
                  </div>
                </div>
              )}

              {itemToView.type ===
                "filler" && (
                <div>
                  <div
                    style={{
                      display:
                        "flex",
                      gap: "16px",
                      alignItems:
                        "center",
                      marginBottom:
                        "14px",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "90px",
                        height:
                          "90px",
                        borderRadius:
                          "10px",
                        overflow:
                          "hidden",
                        border:
                          "1px solid #e2e8f0",
                        background:
                          "#ffffff",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        flexShrink:
                          0,
                      }}
                    >
                      {itemToView.image ? (
                        <img
                          src={formatImage(
                            itemToView.image,
                          )}
                          alt={
                            itemToView.name
                          }
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                          }}
                        />
                      ) : (
                        <ImageIcon
                          size={
                            30
                          }
                          color="#94a3b8"
                        />
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize:
                            "20px",
                          fontWeight:
                            "800",
                          color:
                            "#0f172a",
                        }}
                      >
                        ₹
                        {
                          itemToView.price
                        }
                      </div>

                      <span
                        style={{
                          fontSize:
                            "12px",
                          color:
                            "#64748b",
                        }}
                      >
                        Portion:{" "}
                        {
                          itemToView.weight
                        }
                        g
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#475569",
                    }}
                  >
                    Category:{" "}
                    <strong>
                      {
                        itemToView.category
                      }
                    </strong>
                  </div>
                </div>
              )}

              {itemToView.type ===
                "ribbon" && (
                <div>
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    <span
                      style={{
                        width:
                          "32px",
                        height:
                          "32px",
                        borderRadius:
                          "50%",
                        background:
                          itemToView.color,
                        border:
                          "2px solid #cbd5e1",
                      }}
                    />

                    <div>
                      <div
                        style={{
                          fontSize:
                            "18px",
                          fontWeight:
                            "800",
                          color:
                            "#0f172a",
                        }}
                      >
                        {itemToView.price >
                        0
                          ? `₹${itemToView.price} extra`
                          : "Free Included"}
                      </div>

                      <span
                        style={{
                          fontSize:
                            "12px",
                          color:
                            "#64748b",
                        }}
                      >
                        Hex Color:{" "}
                        <code>
                          {
                            itemToView.color
                          }
                        </code>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setItemToView(
                    null,
                  )
                }
                style={{
                  background:
                    "#f1f5f9",
                  border:
                    "none",
                  padding:
                    "8px 16px",
                  borderRadius:
                    "8px",
                  fontSize:
                    "13.5px",
                  fontWeight:
                    "600",
                  color:
                    "#475569",
                  cursor:
                    "pointer",
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const item =
                    itemToView;

                  setItemToView(
                    null,
                  );

                  handleOpenEdit(
                    item,
                  );
                }}
                style={{
                  background:
                    "#172554",
                  border:
                    "none",
                  padding:
                    "8px 18px",
                  borderRadius:
                    "8px",
                  fontSize:
                    "13.5px",
                  fontWeight:
                    "600",
                  color:
                    "#ffffff",
                  cursor:
                    "pointer",
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "6px",
                }}
              >
                <Pencil
                  size={14}
                />
                Edit Item
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToEdit && (
        <div
          className="modal-overlay"
          onClick={() =>
            !isSavingEdit &&
            setItemToEdit(null)
          }
        >
          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              maxWidth:
                "560px",
              width:
                "100%",
              padding:
                "24px",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
            }}
          >
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "18px",
                borderBottom:
                  "1px solid #f1f5f9",
                paddingBottom:
                  "12px",
              }}
            >
              <h3
                style={{
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#0f172a",
                  margin: 0,
                }}
              >
                Edit{" "}
                {itemToEdit.type ===
                "container"
                  ? "Packaging Container"
                  : itemToEdit.type ===
                      "filler"
                    ? "Dry Fruit Filler"
                    : "Gift Ribbon"}
              </h3>

              <button
                type="button"
                disabled={
                  isSavingEdit
                }
                onClick={() =>
                  setItemToEdit(
                    null,
                  )
                }
                style={{
                  background:
                    "#f1f5f9",
                  border:
                    "none",
                  color:
                    "#64748b",
                  padding:
                    "6px",
                  borderRadius:
                    "6px",
                  cursor:
                    isSavingEdit
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={
                handleSaveEdit
              }
            >
              <div
                style={{
                  marginBottom:
                    "14px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "6px",
                    fontWeight:
                      "600",
                    fontSize:
                      "13px",
                    color:
                      "#334155",
                  }}
                >
                  Name *
                </label>

                <input
                  type="text"
                  value={
                    editForm.name ||
                    ""
                  }
                  onChange={(e) => {
                    setEditForm(
                      (prev) => ({
                        ...prev,
                        name:
                          e.target
                            .value,
                      }),
                    );

                    if (
                      e.target.value.trim()
                    ) {
                      setEditErrors(
                        (prev) => ({
                          ...prev,
                          name: "",
                        }),
                      );
                    }
                  }}
                  style={
                    editErrors.name
                      ? errorInputStyle
                      : inputStyle
                  }
                />

                {editErrors.name && (
                  <span
                    style={
                      errorTextStyle
                    }
                  >
                    <AlertCircle
                      size={13}
                    />
                    {
                      editErrors.name
                    }
                  </span>
                )}
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                  marginBottom:
                    "14px",
                }}
              >
                <div>
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "6px",
                      fontWeight:
                        "600",
                      fontSize:
                        "13px",
                      color:
                        "#334155",
                    }}
                  >
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      editForm.price !==
                      undefined
                        ? editForm.price
                        : ""
                    }
                    onChange={(e) => {
                      setEditForm(
                        (prev) => ({
                          ...prev,
                          price:
                            e.target
                              .value,
                        }),
                      );

                      if (
                        e.target.value !==
                          "" &&
                        Number(
                          e.target.value,
                        ) >= 0
                      ) {
                        setEditErrors(
                          (prev) => ({
                            ...prev,
                            price: "",
                          }),
                        );
                      }
                    }}
                    style={
                      editErrors.price
                        ? errorInputStyle
                        : inputStyle
                    }
                  />

                  {editErrors.price && (
                    <span
                      style={
                        errorTextStyle
                      }
                    >
                      <AlertCircle
                        size={13}
                      />
                      {
                        editErrors.price
                      }
                    </span>
                  )}
                </div>

                {itemToEdit.type ===
                  "container" && (
                  <div>
                    <label
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "6px",
                        fontWeight:
                          "600",
                        fontSize:
                          "13px",
                        color:
                          "#334155",
                      }}
                    >
                      Badge
                    </label>

                    <input
                      type="text"
                      value={
                        editForm.badge ||
                        ""
                      }
                      onChange={(e) =>
                        setEditForm(
                          (prev) => ({
                            ...prev,
                            badge:
                              e.target
                                .value,
                          }),
                        )
                      }
                      style={
                        inputStyle
                      }
                    />
                  </div>
                )}

                {itemToEdit.type ===
                  "filler" && (
                  <div>
                    <label
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "6px",
                        fontWeight:
                          "600",
                        fontSize:
                          "13px",
                        color:
                          "#334155",
                      }}
                    >
                      Weight (g) *
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={
                        editForm.weight ??
                        ""
                      }
                      onChange={(e) => {
                        setEditForm(
                          (prev) => ({
                            ...prev,
                            weight:
                              e.target
                                .value,
                          }),
                        );

                        if (
                          e.target.value !==
                            "" &&
                          Number(
                            e.target.value,
                          ) > 0
                        ) {
                          setEditErrors(
                            (prev) => ({
                              ...prev,
                              weight:
                                "",
                            }),
                          );
                        }
                      }}
                      style={
                        editErrors.weight
                          ? errorInputStyle
                          : inputStyle
                      }
                    />

                    {editErrors.weight && (
                      <span
                        style={
                          errorTextStyle
                        }
                      >
                        <AlertCircle
                          size={13}
                        />
                        {
                          editErrors.weight
                        }
                      </span>
                    )}
                  </div>
                )}

                {itemToEdit.type ===
                  "ribbon" && (
                  <div>
                    <label
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "6px",
                        fontWeight:
                          "600",
                        fontSize:
                          "13px",
                        color:
                          "#334155",
                      }}
                    >
                      Color
                    </label>

                    <input
                      type="color"
                      value={
                        editForm.color ||
                        "#eab308"
                      }
                      onChange={(e) =>
                        setEditForm(
                          (prev) => ({
                            ...prev,
                            color:
                              e.target
                                .value,
                          }),
                        )
                      }
                      style={{
                        width:
                          "100%",
                        height:
                          "42px",
                        borderRadius:
                          "8px",
                        border:
                          "none",
                        cursor:
                          "pointer",
                      }}
                    />
                  </div>
                )}
              </div>

              {itemToEdit.type ===
                "container" && (
                <>
                  <div
                    style={{
                      marginBottom:
                        "14px",
                    }}
                  >
                    <label
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "6px",
                        fontWeight:
                          "600",
                        fontSize:
                          "13px",
                        color:
                          "#334155",
                      }}
                    >
                      Material Craftsmanship
                    </label>

                    <input
                      type="text"
                      value={
                        editForm.material ||
                        ""
                      }
                      onChange={(e) =>
                        setEditForm(
                          (prev) => ({
                            ...prev,
                            material:
                              e.target
                                .value,
                          }),
                        )
                      }
                      style={
                        inputStyle
                      }
                    />
                  </div>

                  <div
                    style={{
                      marginBottom:
                        "16px",
                    }}
                  >
                    <label
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "6px",
                        fontWeight:
                          "600",
                        fontSize:
                          "13px",
                        color:
                          "#334155",
                      }}
                    >
                      Capacity Info
                    </label>

                    <input
                      type="text"
                      value={
                        editForm.capacity ||
                        ""
                      }
                      onChange={(e) =>
                        setEditForm(
                          (prev) => ({
                            ...prev,
                            capacity:
                              e.target
                                .value,
                          }),
                        )
                      }
                      style={
                        inputStyle
                      }
                    />
                  </div>
                </>
              )}

              {itemToEdit.type ===
                "filler" && (
                <div
                  style={{
                    marginBottom:
                      "16px",
                  }}
                >
                  <label
                    style={{
                      display:
                        "block",
                      marginBottom:
                        "6px",
                      fontWeight:
                        "600",
                      fontSize:
                        "13px",
                      color:
                        "#334155",
                    }}
                  >
                    Category *
                  </label>

                  <select
                    value={
                      editForm.category ||
                      ""
                    }
                    onChange={(e) =>
                      setEditForm(
                        (prev) => ({
                          ...prev,
                          category:
                            e.target
                              .value,
                        }),
                      )
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option value="Nuts">
                      Nuts
                    </option>

                    <option value="Dates & Figs">
                      Dates & Figs
                    </option>

                    <option value="Berries">
                      Berries
                    </option>

                    <option value="Spices">
                      Spices
                    </option>

                    <option value="Seeds">
                      Seeds
                    </option>
                  </select>
                </div>
              )}

              {(itemToEdit.type ===
                "container" ||
                itemToEdit.type ===
                  "filler") && (
                <div
                  style={{
                    marginBottom:
                      "18px",
                  }}
                >
                  <label
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "7px",
                      marginBottom:
                        "10px",
                      fontWeight:
                        "600",
                      fontSize:
                        "14px",
                      color:
                        "#0f172a",
                    }}
                  >
                    <ImageIcon
                      size={17}
                    />
                    {itemToEdit.type ===
                    "filler"
                      ? "Filler Image *"
                      : "Container Image *"}
                  </label>

                  <div
                    style={{
                      ...uploadBoxStyle,
                      borderColor:
                        editErrors.image
                          ? "#ef4444"
                          : "#cbd5e1",
                      background:
                        editErrors.image
                          ? "#fffafa"
                          : "#f8fafc",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "20px",
                        alignItems:
                          "center",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div
                        style={
                          uploadPreviewStyle
                        }
                      >
                        {editImagePreview ||
                        editForm.image ? (
                          <>
                            <img
                              src={
                                editImagePreview ||
                                formatImage(
                                  editForm.image,
                                )
                              }
                              alt="Image preview"
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                              }}
                            />

                            <button
                              type="button"
                              onClick={
                                handleRemoveEditImage
                              }
                              title="Remove image"
                              style={{
                                position:
                                  "absolute",
                                top: "7px",
                                right: "7px",
                                width:
                                  "28px",
                                height:
                                  "28px",
                                border:
                                  "none",
                                borderRadius:
                                  "50%",
                                background:
                                  "rgba(0,0,0,0.6)",
                                color:
                                  "#ffffff",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                cursor:
                                  "pointer",
                              }}
                            >
                              <X
                                size={
                                  16
                                }
                              />
                            </button>
                          </>
                        ) : (
                          <ImageIcon
                            size={42}
                            color="#94a3b8"
                          />
                        )}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          minWidth:
                            "220px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            editFileRef.current?.click()
                          }
                          disabled={
                            uploadingImage
                          }
                          style={
                            chooseButtonStyle
                          }
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2
                                size={
                                  17
                                }
                                className="animate-spin"
                              />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload
                                size={
                                  17
                                }
                              />
                              Choose Image from Computer
                            </>
                          )}
                        </button>

                        <input
                          ref={
                            editFileRef
                          }
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.gif,.svg,image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                          onChange={(e) =>
                            handleUpload(
                              e,
                              "edit",
                            )
                          }
                          style={{
                            display:
                              "none",
                          }}
                        />

                        <p
                          style={{
                            margin:
                              "10px 0 0",
                            fontSize:
                              "12px",
                            color:
                              "#64748b",
                            lineHeight:
                              "1.5",
                          }}
                        >
                          Supports JPG, PNG,
                          WEBP, GIF and SVG.
                          Max 5MB.
                        </p>

                        {editForm.image &&
                          !editErrors.image && (
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "5px",
                                color:
                                  "#16a34a",
                                fontSize:
                                  "12px",
                                marginTop:
                                  "7px",
                                fontWeight:
                                  "600",
                              }}
                            >
                              <CheckCircle
                                size={
                                  14
                                }
                              />
                              Image uploaded
                              successfully
                            </div>
                          )}
                      </div>
                    </div>

                    {editErrors.image && (
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "6px",
                          color:
                            "#ef4444",
                          fontSize:
                            "12px",
                          marginTop:
                            "12px",
                          lineHeight:
                            "1.4",
                        }}
                      >
                        <AlertCircle
                          size={
                            15
                          }
                        />
                        {
                          editErrors.image
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  disabled={
                    isSavingEdit
                  }
                  onClick={() =>
                    setItemToEdit(
                      null,
                    )
                  }
                  style={{
                    background:
                      "#ffffff",
                    border:
                      "1px solid #cbd5e1",
                    padding:
                      "9px 16px",
                    borderRadius:
                      "8px",
                    fontSize:
                      "13.5px",
                    fontWeight:
                      "600",
                    color:
                      "#475569",
                    cursor:
                      isSavingEdit
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSavingEdit ||
                    uploadingImage
                  }
                  style={{
                    background:
                      "#172554",
                    border:
                      "none",
                    padding:
                      "9px 20px",
                    borderRadius:
                      "8px",
                    fontSize:
                      "13.5px",
                    fontWeight:
                      "600",
                    color:
                      "#ffffff",
                    cursor:
                      isSavingEdit ||
                      uploadingImage
                        ? "not-allowed"
                        : "pointer",
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: "6px",
                    opacity:
                      isSavingEdit ||
                      uploadingImage
                        ? 0.6
                        : 1,
                  }}
                >
                  {isSavingEdit && (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  )}

                  {isSavingEdit
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomStudio;