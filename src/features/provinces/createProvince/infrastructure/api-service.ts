import {
  createError,
  createSuccess,
  Result,
} from "@/src/features/common/domain/types/result";
import { CreateProvinceError, CreateProvinceRequest } from "../domain/types";
import axios from "axios";

interface CreateJobOfferApiService {
  createProvince: (
    jobOffer: CreateProvinceRequest
  ) => Promise<Result<CreateProvinceRequest, CreateProvinceError>>;
}

export const createProvinceApiService = (
  baseUrl: string
): CreateJobOfferApiService => {
  async function createProvince(
    province: CreateProvinceRequest
  ): Promise<Result<CreateProvinceRequest, CreateProvinceError>> {
    try {
      const response = await axios.post(`${baseUrl}/provinces`, province, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return createSuccess(response.data);
    } catch (error: any) {
      console.log(error);

      if (error.response) {
        return createError({
          error: error.response.data || error.response.statusText,
          message: "Error al crear la oferta laboral",
        });
      } else if (error.request) {
        return createError({
          error: "No hubo respuesta del servidor",
          message: "Error al crear la oferta laboral",
        });
      } else {
        return createError({
          error: error.message,
          message: "Error al crear la oferta laboral",
        });
      }
    }
  }

  return {
    createProvince,
  };
};
