'use client';

import { useFormContext, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import classNames from 'classnames';
import type { ComponentProps, ReactNode } from 'react';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ComponentProps<typeof Input>, 'name'> {
  name: TName;
  label: string;
  control?: Control<TFieldValues>;
  className?: string;
  endIcon?: ReactNode;
  required?: boolean;
}

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  control,
  className,
  endIcon,
  required,
  ...props
}: FormInputProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const hasControl = Boolean(control);
  const formControl = hasControl ? control : formContext.control;

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);
        const hasEndIcon = Boolean(endIcon);

        return (
          <FormItem className={className}>
            <FormLabel required={required}>{label}</FormLabel>
            <FormControl>
              <div className='relative'>
                <Input
                  {...field}
                  {...props}
                  className={classNames(className, {
                    'border-red-500 focus-visible:ring-red-500': hasError,
                    'pr-10': hasEndIcon,
                  })}
                />
                {hasEndIcon && (
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center'>
                    {endIcon}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormInput;
