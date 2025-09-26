import { useQuery } from "@tanstack/react-query";
import { ProvincesResponse } from "../domain/interfaces";
import { getProvincesApiService } from "../infrastructure/api-service";
import { toast } from "sonner";

export const useGetProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async (): Promise<ProvincesResponse> => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const provincesService = getProvincesApiService(baseUrl);

      try {
        const result = await provincesService.getProvinces();

        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error.message);
        }
      } catch (err: any) {
        // console.error("Error al llamar a getProvinces:", err.message || err);
        toast.error((err.message || err));
        throw new Error(
          "No se pudo conectar con el backend: " + (err.message || err)
        );
      }
    },
    retry: false,
  });
};
