import { useProvinceState } from "@/src/features/common/presentation/hooks/useProvinceState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProvinceRequest } from "../domain/types";
import { createProvinceApiService } from "../infrastructure/api-service";
import { toast } from "sonner";

export const useCreateProvince = () => {
  const { resetData } = useProvinceState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (province: CreateProvinceRequest) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const createProvinceService = createProvinceApiService(baseUrl);

      const result = await createProvinceService.createProvince(province);

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    onSuccess: () => {
      resetData();
      toast.success("Provincia creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
    },
    onError: (error) => {
      toast.success("Error al crear la provincia");
      throw new Error(
        "Error al crear la provincia: " + (error.message || error)
      );
    },
  });
};
