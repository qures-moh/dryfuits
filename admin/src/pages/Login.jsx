import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, LogIn, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginAdmin } from "../redux/slices/authSlice";
import api from "../api/axios";
import { formatImageUrl } from "../utils/formatImage";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [siteSettings, setSiteSettings] = useState({
    brandName: "Golden Harvest",
    logoUrl: "/images/logo.svg",
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSiteSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data && isMounted) {
          setSiteSettings((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    fetchSiteSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      await dispatch(
        loginAdmin({
          email: formData.email.trim(),
          password: formData.password,
        })
      ).unwrap();

      toast.success("Welcome back! Logged in successfully.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(typeof err === "string" ? err : err?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Top Logo / Icon Box */}
        <div className="admin-login-logo-box">
          {!imgError && siteSettings.logoUrl ? (
            <img
              src={formatImageUrl(siteSettings.logoUrl)}
              alt="Logo"
              onError={() => setImgError(true)}
            />
          ) : (
            <LogIn size={24} color="#5b42f3" />
          )}
        </div>

        {/* Title & Subtitle */}
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-subtitle">
          Sign in to your {siteSettings.brandName || "Shoply"} admin account
        </p>

        {error && (
          <div className="admin-login-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="admin-form-group">
            <label htmlFor="email">Email address</label>

            <div className="admin-input-wrapper">
              <span className="admin-input-icon">
                <Mail size={18} />
              </span>

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@gmail.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>

            <div className="admin-input-wrapper">
              <span className="admin-input-icon">
                <Lock size={18} />
              </span>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Admin Login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;