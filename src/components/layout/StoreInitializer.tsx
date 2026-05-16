"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams } from "next/navigation";

export default function StoreInitializer() {
  const { fetchStoreConfig, storeConfig } = useCartStore();
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted, fetchStoreConfig, searchParams, storeConfig]);

  useEffect(() => {
    if (!isMounted) return;

    // 3. Apply Theme Color to CSS Variables
    if (storeConfig?.themeColor) {
      document.documentElement.style.setProperty("--primary", storeConfig.themeColor);
      document.documentElement.style.setProperty("--primary-soft", `${storeConfig.themeColor}1a`); // 10% opacity
    }
  }, [isMounted, storeConfig]);

  return null;
}
