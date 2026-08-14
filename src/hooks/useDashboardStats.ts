import { useEffect, useState } from "react";
import DashboardService from "@/services/dashboardService";
import type { DashboardStats } from "@/types/dashboard";

export function useDashboardStats() {

  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    DashboardService
      .getDashboardStats()
      .then(setData)
      .finally(() => setLoading(false));

  }, []);

  return {
    data,
    loading
  };

}