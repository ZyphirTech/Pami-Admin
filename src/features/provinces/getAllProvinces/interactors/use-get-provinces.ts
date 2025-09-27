import { useQuery } from "@tanstack/react-query";
import { ProvincesResponse } from "../domain/interfaces";
import { getProvincesApiService } from "../infrastructure/api-service";
import { toast } from "sonner";

interface ProvinceQueryParams {
  pageSize: number;
  direction: "0" | "1";
  cursor: string | null;
}

export const useGetProvinces = ({ pageSize, direction, cursor = null }: ProvinceQueryParams) => {
  return useQuery({
    queryKey: ["provinces", pageSize, direction, cursor],
    queryFn: async (): Promise<ProvincesResponse> => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const provincesService = getProvincesApiService(baseUrl);

      try {
        const result = await provincesService.getProvinces(pageSize.toString(), direction, cursor);

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
