import {
  createError,
  createSuccess,
  Result,
} from "../../common/domain/types/result";
import { ProvincesError, ProvincesResponse } from "../domain/interfaces";
import axios from "axios";

interface GetProvincesApiService {
  getProvinces: () => Promise<Result<ProvincesResponse, ProvincesError>>;
}

export const getProvincesApiService = (
  baseUrl: string
): GetProvincesApiService => {
  async function getProvinces(): Promise<
    Result<ProvincesResponse, ProvincesError>
  > {
    try {
      const response = await axios.get<ProvincesResponse>(
        `${baseUrl}/provinces`
      );

      return createSuccess(response.data);
    } catch (error: any) {
      if (error.response) {
        return createError({
          error: error.response.data,
          message: "Error al obtener las ofertas laborales",
        });
      } else if (error.request) {
        return createError({
          error: "Sin respuesta del servidor",
          message: "Error de conexión al servidor",
        });
      } else {
        return createError({
          error: error.message,
          message: "Error desconocido al obtener las ofertas laborales",
        });
      }
    }
  }

  return {
    getProvinces,
  };
};
