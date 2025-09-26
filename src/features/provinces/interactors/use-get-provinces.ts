import { useQuery } from "@tanstack/react-query";
import { ProvincesResponse } from "../domain/interfaces";
import { getProvincesApiService } from "../infrastructure/api-service";

export const useGetProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async (): Promise<ProvincesResponse> => {
      const provincesService = getProvincesApiService(
        process.env.NEXT_PUBLIC_API_URL || ""
      );

      const result = await provincesService.getProvinces();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
  });
};
