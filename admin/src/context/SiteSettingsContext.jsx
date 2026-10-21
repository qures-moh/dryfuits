import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const SiteSettingsContext = createContext({
  siteSettings: {
    brandName: "Golden Harvest",
    brandTagline: "Admin Panel",
    logoUrl: "/images/logo.svg",
    email: "admin@goldenharvest.com",
  },
  loading: true,
  refreshSettings: () => {},
});

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    brandName: "Golden Harvest",
    brandTagline: "Admin Panel",
    logoUrl: "/images/logo.svg",
    email: "admin@goldenharvest.com",
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get("/settings");
      if (res.data) {
        setSiteSettings((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
    } catch (e) {
      console.error("Error fetching site settings:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setSiteSettings((prev) => ({
          ...prev,
          ...e.detail,
        }));
      } else {
        fetchSettings();
      }
    };

    window.addEventListener("settingsUpdated", handleUpdate);
    return () => {
      window.removeEventListener("settingsUpdated", handleUpdate);
    };
  }, [fetchSettings]);

  return (
    <SiteSettingsContext.Provider
      value={{ siteSettings, setSiteSettings, loading, refreshSettings: fetchSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
