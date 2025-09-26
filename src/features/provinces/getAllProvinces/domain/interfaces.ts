import { Province } from "../../../common/domain/types/provinces";

export interface ProvincesResponse {
  items: Province[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
}

export interface ProvincesError {
  error: string;
  message: string;
}
