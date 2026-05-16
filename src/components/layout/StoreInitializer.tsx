"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams } from "next/navigation";

export default function StoreInitializer() {
  const { fetchStoreConfig, storeConfig } = useCartStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Detect Slug from Subdomain or Query Param
    const host = window.location.hostname;
    const subdomain = host.split(".")[0];
    const storeQuery = searchParams.get("store");

    let slug = "default";

    if (storeQuery) {
      slug = storeQuery;
    } else if (
      subdomain && 
      subdomain !== "localhost" && 
      subdomain !== "127" && 
      !subdomain.includes("orderpro")
    ) {
      slug = subdomain;
    }

    // 2. Only Fetch if slug has changed or config is missing
    if (!storeConfig || storeConfig.slug !== slug) {
      fetchStoreConfig(slug);
    }
  }, [fetchStoreConfig, searchParams, storeConfig]);

  useEffect(() => {
    // 3. Apply Theme Color to CSS Variables
    if (storeConfig?.themeColor) {
      document.documentElement.style.setProperty("--primary", storeConfig.themeColor);
      
      // Calculate a secondary color (slightly lighter or darker)
      // For now, just set a fixed secondary based on primary
      document.documentElement.style.setProperty("--primary-soft", `${storeConfig.themeColor}1a`); // 10% opacity
    }
  }, [storeConfig]);

  return null;
}
