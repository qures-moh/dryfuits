
import React, { useEffect, useState, useRef } from "react";
import {
  Save,
  AlertCircle,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { formatImageUrl } from "../utils/formatImage";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const logoFileInputRef = useRef(null);

  const [settings, setSettings] = useState({
    brandName: "Golden Harvest",
    brandTagline: "Dry Fruits • Gift Buckets",
    logoUrl: "/images/logo.svg",
    phoneNumber: "+91 91795 98991",
    whatsappNumber: "919179598991",
    email: "care@goldenharvestdryfruits.com",
    announcementText:
      "FESTIVE HARVEST: Direct Farm-Fresh Dry Fruits & Handcrafted Wooden Buckets",
    announcementDelivery:
      "Free Nitrogen-Sealed Express Delivery over Rs. 999",
    heroBadgeText: "THE ART OF THOUGHTFUL GIFTING",
    heroTitle: "Nature's Finest,\nThoughtfully Selected.",
    heroDescription:
      "Discover carefully selected dry fruits and thoughtful gift buckets for everyday enjoyment and special moments.",
    heroImage: "/images/hero.jpg",
    collectionTitle: "Goodness Worth Sharing",
    collectionSubtitle: "THE COLLECTION",
    collectionDescription:
      "Explore our selection of dry fruits and thoughtfully presented gift buckets for everyday moments and special occasions.",
    bucketBannerTitle: "A Gift Made Personal",
    bucketBannerDescription:
      "Create a gift bucket with your preferred selections and make your next occasion more meaningful.",
    footerDescription:
      "Thoughtfully selected dry fruits and gift buckets for everyday enjoyment and special moments.",
    footerBottomText: "Goodness to enjoy. Gifts to remember.",
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/settings");

        if (res.data) {
          setSettings((prev) => ({
            ...prev,
            ...res.data,
            logoUrl:
              res.data.logoUrl ||
              prev.logoUrl ||
              "/images/logo.svg",
          }));
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Failed to load settings";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
    setSuccess("");
  };

  const validateSettings = () => {
    const errors = {};

    const brandName = settings.brandName?.trim() || "";
    const brandTagline = settings.brandTagline?.trim() || "";
    const phoneNumber = settings.phoneNumber?.trim() || "";
    const whatsappNumber =
      settings.whatsappNumber?.trim() || "";
    const email = settings.email?.trim() || "";
    const announcementText =
      settings.announcementText?.trim() || "";
    const announcementDelivery =
      settings.announcementDelivery?.trim() || "";
    const heroBadgeText =
      settings.heroBadgeText?.trim() || "";
    const heroTitle = settings.heroTitle?.trim() || "";
    const heroDescription =
      settings.heroDescription?.trim() || "";

    if (!brandName) {
      errors.brandName = "Brand name is required.";
    } else if (brandName.length < 2) {
      errors.brandName =
        "Brand name must be at least 2 characters.";
    } else if (brandName.length > 50) {
      errors.brandName =
        "Brand name cannot exceed 50 characters.";
    }

    if (!brandTagline) {
      errors.brandTagline = "Brand tagline is required.";
    } else if (brandTagline.length < 3) {
      errors.brandTagline =
        "Brand tagline must be at least 3 characters.";
    } else if (brandTagline.length > 100) {
      errors.brandTagline =
        "Brand tagline cannot exceed 100 characters.";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(phoneNumber)) {
      errors.phoneNumber =
        "Enter a valid phone number.";
    }

    if (!whatsappNumber) {
      errors.whatsappNumber =
        "WhatsApp number is required.";
    } else if (!/^[0-9]{10,15}$/.test(whatsappNumber)) {
      errors.whatsappNumber =
        "WhatsApp number must contain 10 to 15 digits.";
    }

    if (!email) {
      errors.email = "Support email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
      errors.email =
        "Enter a valid email address.";
    }

    if (!announcementText) {
      errors.announcementText =
        "Announcement text is required.";
    } else if (announcementText.length < 5) {
      errors.announcementText =
        "Announcement text must be at least 5 characters.";
    } else if (announcementText.length > 250) {
      errors.announcementText =
        "Announcement text cannot exceed 250 characters.";
    }

    if (!announcementDelivery) {
      errors.announcementDelivery =
        "Announcement delivery text is required.";
    } else if (announcementDelivery.length < 5) {
      errors.announcementDelivery =
        "Announcement delivery text must be at least 5 characters.";
    } else if (announcementDelivery.length > 150) {
      errors.announcementDelivery =
        "Announcement delivery text cannot exceed 150 characters.";
    }

    if (!heroBadgeText) {
      errors.heroBadgeText =
        "Hero badge text is required.";
    } else if (heroBadgeText.length < 3) {
      errors.heroBadgeText =
        "Hero badge text must be at least 3 characters.";
    } else if (heroBadgeText.length > 100) {
      errors.heroBadgeText =
        "Hero badge text cannot exceed 100 characters.";
    }

    if (!heroTitle) {
      errors.heroTitle = "Hero title is required.";
    } else if (heroTitle.length < 5) {
      errors.heroTitle =
        "Hero title must be at least 5 characters.";
    } else if (heroTitle.length > 150) {
      errors.heroTitle =
        "Hero title cannot exceed 150 characters.";
    }

    if (!heroDescription) {
      errors.heroDescription =
        "Hero description is required.";
    } else if (heroDescription.length < 20) {
      errors.heroDescription =
        "Hero description must be at least 20 characters.";
    } else if (heroDescription.length > 500) {
      errors.heroDescription =
        "Hero description cannot exceed 500 characters.";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/svg+xml",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only PNG, JPG, SVG, and WEBP images are allowed."
      );

      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size must be less than 5MB");

      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = "";
      }

      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploadingLogo(true);

      const res = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.imageUrl) {
        const serverLogoUrl = res.data.imageUrl;

        setSettings((prev) => ({
          ...prev,
          logoUrl: serverLogoUrl,
        }));

        toast.success(
          "Logo uploaded! Click 'Save Settings' to apply it site-wide."
        );
      }
    } catch (err) {
      console.error("Logo upload failed:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to upload logo image"
      );
    } finally {
      setUploadingLogo(false);

      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = "";
      }
    }
  };

  const handleResetLogo = () => {
    setSettings((prev) => ({
      ...prev,
      logoUrl: "/images/logo.svg",
    }));

    toast.success(
      "Reset logo to default SVG logo. Remember to save settings."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const isValid = validateSettings();

    if (!isValid) {
      toast.error(
        "Please fix the validation errors before saving."
      );
      return;
    }

    try {
      setSaving(true);

      const cleanedSettings = {
        ...settings,
        brandName: settings.brandName.trim(),
        brandTagline: settings.brandTagline.trim(),
        phoneNumber: settings.phoneNumber.trim(),
        whatsappNumber:
          settings.whatsappNumber.trim(),
        email: settings.email.trim(),
        announcementText:
          settings.announcementText.trim(),
        announcementDelivery:
          settings.announcementDelivery.trim(),
        heroBadgeText:
          settings.heroBadgeText.trim(),
        heroTitle: settings.heroTitle.trim(),
        heroDescription:
          settings.heroDescription.trim(),
      };

      const res = await api.put(
        "/settings",
        cleanedSettings
      );

      setSettings((prev) => ({
        ...prev,
        ...res.data,
      }));

      const successMsg =
        "Settings updated successfully! The storefront and admin will now reflect these updates.";

      setSuccess(successMsg);
      toast.success(successMsg);

      window.dispatchEvent(
        new CustomEvent("settingsUpdated", {
          detail: res.data,
        })
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to save settings";

      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: validationErrors[field]
      ? "1px solid #dc2626"
      : "1px solid #cbd5e1",
  });

  const errorStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "5px",
    marginBottom: 0,
  };

  if (loading) {
    return (
      <div
        className="dashboard-page"
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <p>Loading site settings...</p>
      </div>
    );
  }

  const resolvedLogoUrl = formatImageUrl(
    settings.logoUrl || "/images/logo.svg"
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Site Settings &amp; Content
          </h1>

          <p className="dashboard-subtitle">
            Customize your brand logo, hero titles,
            announcement bar, contact info, and branding
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

      {success && (
        <div
          style={{
            background: "#dcfce7",
            color: "#15803d",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          padding: "28px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          maxWidth: "800px",
        }}
      >
        <h3
          style={{
            marginBottom: "16px",
            color: "#0f172a",
            fontSize: "16px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ImageIcon size={18} color="#172554" />
          Brand Logo &amp; Identity
        </h3>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "12px",
                background: "#0f172a",
                border: "2px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "8px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                flexShrink: 0,
              }}
            >
              {resolvedLogoUrl ? (
                <img
                  src={resolvedLogoUrl}
                  alt="Store Logo Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <span
                  style={{
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  GH
                </span>
              )}
            </div>

            <div
              style={{
                flex: 1,
                minWidth: "220px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                Storefront &amp; Admin Brand Logo
              </div>

              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0 0 12px 0",
                  lineHeight: 1.4,
                }}
              >
                This logo is dynamically rendered on the
                storefront navigation bar, sticky mobile
                bar, footer, and the admin panel.
                Recommended: PNG or SVG with transparent
                background (under 5MB).
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  style={{ display: "none" }}
                />

                <button
                  type="button"
                  disabled={uploadingLogo}
                  onClick={() =>
                    logoFileInputRef.current?.click()
                  }
                  style={{
                    background: "#172554",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: uploadingLogo
                      ? "not-allowed"
                      : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {uploadingLogo ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                      Uploading Logo...
                    </>
                  ) : (
                    <>
                      <Upload size={15} />
                      Upload Logo Image
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetLogo}
                  style={{
                    background: "#ffffff",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  title="Reset to default logo"
                >
                  <RotateCcw size={14} />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3
          style={{
            marginBottom: "16px",
            color: "#0f172a",
            fontSize: "16px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "8px",
          }}
        >
          Branding &amp; Contact Details
        </h3>

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
              Brand Name
            </label>

            <input
              type="text"
              name="brandName"
              value={settings.brandName || ""}
              onChange={handleChange}
              maxLength={50}
              style={inputStyle("brandName")}
            />

            {validationErrors.brandName && (
              <p style={errorStyle}>
                {validationErrors.brandName}
              </p>
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
              Brand Tagline
            </label>

            <input
              type="text"
              name="brandTagline"
              value={settings.brandTagline || ""}
              onChange={handleChange}
              maxLength={100}
              style={inputStyle("brandTagline")}
            />

            {validationErrors.brandTagline && (
              <p style={errorStyle}>
                {validationErrors.brandTagline}
              </p>
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
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={settings.phoneNumber || ""}
              onChange={handleChange}
              maxLength={15}
              style={inputStyle("phoneNumber")}
            />

            {validationErrors.phoneNumber && (
              <p style={errorStyle}>
                {validationErrors.phoneNumber}
              </p>
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
              WhatsApp Number
            </label>

            <input
              type="text"
              name="whatsappNumber"
              value={settings.whatsappNumber || ""}
              onChange={handleChange}
              maxLength={15}
              style={inputStyle("whatsappNumber")}
            />

            {validationErrors.whatsappNumber && (
              <p style={errorStyle}>
                {validationErrors.whatsappNumber}
              </p>
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
              Support Email
            </label>

            <input
              type="email"
              name="email"
              value={settings.email || ""}
              onChange={handleChange}
              maxLength={100}
              style={inputStyle("email")}
            />

            {validationErrors.email && (
              <p style={errorStyle}>
                {validationErrors.email}
              </p>
            )}
          </div>
        </div>

        <h3
          style={{
            marginTop: "30px",
            marginBottom: "16px",
            color: "#0f172a",
            fontSize: "16px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "8px",
          }}
        >
          Top Announcement Bar
        </h3>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            Announcement Bar Text
          </label>

          <input
            type="text"
            name="announcementText"
            value={settings.announcementText || ""}
            onChange={handleChange}
            maxLength={250}
            style={inputStyle("announcementText")}
          />

          {validationErrors.announcementText && (
            <p style={errorStyle}>
              {validationErrors.announcementText}
            </p>
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
            Announcement Delivery Text
          </label>

          <input
            type="text"
            name="announcementDelivery"
            value={settings.announcementDelivery || ""}
            onChange={handleChange}
            maxLength={150}
            style={inputStyle(
              "announcementDelivery"
            )}
          />

          {validationErrors.announcementDelivery && (
            <p style={errorStyle}>
              {validationErrors.announcementDelivery}
            </p>
          )}
        </div>

        <h3
          style={{
            marginTop: "30px",
            marginBottom: "16px",
            color: "#0f172a",
            fontSize: "16px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "8px",
          }}
        >
          Hero Section
        </h3>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            Hero Badge
          </label>

          <input
            type="text"
            name="heroBadgeText"
            value={settings.heroBadgeText || ""}
            onChange={handleChange}
            maxLength={100}
            style={inputStyle("heroBadgeText")}
          />

          {validationErrors.heroBadgeText && (
            <p style={errorStyle}>
              {validationErrors.heroBadgeText}
            </p>
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
            Hero Title (Use newline for second line)
          </label>

          <textarea
            name="heroTitle"
            rows="2"
            value={settings.heroTitle || ""}
            onChange={handleChange}
            maxLength={150}
            style={inputStyle("heroTitle")}
          />

          {validationErrors.heroTitle && (
            <p style={errorStyle}>
              {validationErrors.heroTitle}
            </p>
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
            Hero Description
          </label>

          <textarea
            name="heroDescription"
            rows="3"
            value={settings.heroDescription || ""}
            onChange={handleChange}
            maxLength={500}
            style={inputStyle(
              "heroDescription"
            )}
          />

          {validationErrors.heroDescription && (
            <p style={errorStyle}>
              {validationErrors.heroDescription}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: "10px",
            background: "#172554",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "15px",
            border: "none",
            cursor: saving
              ? "not-allowed"
              : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {saving ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          {saving
            ? "Saving Changes..."
            : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
