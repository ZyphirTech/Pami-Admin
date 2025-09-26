import { Municipio } from "./municipio";

export interface Province {
  id: string;
  nombre: string;
  municipios: Municipio[];
}
