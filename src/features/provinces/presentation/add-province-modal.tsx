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
import { Card } from "@/components/ui/card";
import { RHFInput } from "../../common/presentation/components/input";
import { useCreateProvince } from "../createProvince/mutations/mutations";

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
        <DialogContent className="sm:max-w-[460px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 mx-auto w-full"
          >
            <DialogHeader>
              <DialogTitle>Crear Provincia</DialogTitle>
              <DialogDescription>Crea una nueva provincia.</DialogDescription>
            </DialogHeader>
            <Card className="p-6 space-y-4 w-full">
              <div className="grid grid-cols-1 gap-4">
                <RHFInput
                  name="nombre"
                  label="Nombre"
                  placeholder="Introduce el nombre de la provincia"
                  required
                  type="text"
                  width="100%"
                />
              </div>
            </Card>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
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
