"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddProvinceDTO,
  addProvinceSchema,
} from "../schema/add-province.schema";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RHFInput } from "../../common/presentation/components/input";
import { useCreateProvince } from "../createProvince/mutations/mutations";
import { cn } from "@/lib/utils";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddProvince = ({ isOpen, onClose }: DialogProps) => {
  const { mutateAsync: createProvince } = useCreateProvince();

  const methods = useForm<AddProvinceDTO>({
    resolver: zodResolver(addProvinceSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<AddProvinceDTO> = async (data) => {
    console.log("Datos del formulario:", data);
    await createProvince(data);
    onClose();
    reset();
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[460px] bg-white dark:bg-gray-900 rounded-lg shadow-xl p-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Crear Provincia
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                Completa los detalles para crear una nueva provincia.
              </DialogDescription>
            </DialogHeader>
            <Card className="bg-gray-50 dark:bg-gray-800 border-none shadow-sm rounded-lg overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <RHFInput
                    name="nombre"
                    label="Nombre"
                    placeholder="Introduce el nombre de la provincia"
                    required
                    type="text"
                    width="100%"
                  />
                </div>
              </CardContent>
            </Card>
            <DialogFooter className="flex justify-end gap-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {isSubmitting ? "Creando..." : "Crear Provincia"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};