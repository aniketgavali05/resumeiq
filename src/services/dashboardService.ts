import api from "@/lib/api";
import type { DashboardStats } from "@/types/dashboard";

class DashboardService {

  async getDashboardStats(): Promise<DashboardStats> {

    const response = await api.get<DashboardStats>(
      "/dashboard/stats"
    );

    return response.data;
  }

}

export default new DashboardService();