import { z } from "zod";

export const addProvinceSchema = z.object({
  nombre: z.string().min(3, "El nombre es requerido"),
});

export type AddProvinceDTO = z.infer<typeof addProvinceSchema>;
