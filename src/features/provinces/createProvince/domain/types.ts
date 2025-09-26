import { Result } from "@/src/features/common/domain/types/result";

export interface CreateProvinceRequest {
  nombre: string;
}

export type CreateProvinceResponse = Result<
  CreateProvinceRequest,
  CreateProvinceError
>;

export type CreateProvinceError = {
  error: string;
  message: string;
};
