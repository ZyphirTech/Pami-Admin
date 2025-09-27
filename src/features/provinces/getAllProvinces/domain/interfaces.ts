import { Province } from "../../../common/domain/types/provinces";

export interface ProvincesResponse {
  items: Province[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalRecords: number;
}

export interface ProvincesError {
  error: string;
  message: string;
}
