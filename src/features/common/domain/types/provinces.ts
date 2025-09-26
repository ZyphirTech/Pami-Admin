import { Municipio } from "./municipio";

export interface Province {
  id: string;
  name: string;
  municipios: Municipio[];
}

