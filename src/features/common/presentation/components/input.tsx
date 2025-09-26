"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { ChangeEvent, CSSProperties } from "react";

type Props = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  underLabel?: string;
  required?: boolean;
  disabled?: boolean;
  width?: CSSProperties["width"];
  isNotAccountant?: boolean;
  minMax?: { min: number; max: number };
};

export function RHFInput({
  name,
  type = "text",
  label,
  placeholder,
  underLabel,
  required,
  disabled,
  width,
  isNotAccountant,
  minMax,
}: Props) {
  const { control } = useFormContext();

  const handleChange =
    (onChange: (val: any) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        isNotAccountant
          ? onChange(+event.target.value)
          : handleNumberChange(event?.target.value, onChange);
      } else {
        onChange(event?.target.value);
      }
    };

  const handleNumberChange = (value: string, onChange: any) => {
    if (!value.match(/^0\d*/)) {
      onChange(+value);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <FormField
          name={name}
          render={() => (
            <FormItem style={{ width: width ?? "100%" }}>
              {label && (
                <FormLabel>
                  {label} {required && <span className="text-red-500">*</span>}
                </FormLabel>
              )}
              <FormControl>
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  value={value ?? ""}
                  onBlur={onBlur}
                  onChange={handleChange(onChange)}
                  min={minMax?.min}
                  max={minMax?.max}
                />
              </FormControl>
              {underLabel && <FormDescription>{underLabel}</FormDescription>}
              {error && <FormMessage>{error.message}</FormMessage>}
            </FormItem>
          )}
        />
      )}
    />
  );
}
