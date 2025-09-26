import { Result } from "../../common/domain/types/result";
import { ProvincesError, ProvincesResponse } from "../domain/interfaces";


interface GetProvincesApiService {
  getProvinces: () => Promise<Result<ProvincesResponse, ProvincesError>>;
}

const getProvincesApiService = (baseUrl: string): GetProvincesApiService => {
  async function getProvinces(): Promise<Result<ProvincesResponse, ProvincesError>> {
    
  }

  return {
    getProvinces,
  };
}