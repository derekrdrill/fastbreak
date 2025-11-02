'use client';

import { useFormContext, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  control?: Control<TFieldValues>;
  className?: string;
  required?: boolean;
}

function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  options,
  placeholder = 'Select an option',
  control,
  className,
  required,
}: FormSelectProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const formControl = control || formContext.control;

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                className={fieldState.error ? 'border-red-500 focus:ring-red-500' : ''}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormSelect;
