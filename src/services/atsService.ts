import api from "@/lib/api";
import type { ATSResponse } from "@/types/ats";

const ATSService = {

  async analyzeResume(
    resume: File,
    jobDescription: string
  ): Promise<ATSResponse> {

    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    const response = await api.post<ATSResponse>(
      "/ats/analyze",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

};

export default ATSService;