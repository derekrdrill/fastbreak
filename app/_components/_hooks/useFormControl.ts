'use client';

import { useFormContext, type Control, type FieldValues } from 'react-hook-form';

export function useFormControl<TFieldValues extends FieldValues>(control?: Control<TFieldValues>) {
  const ctx = useFormContext<TFieldValues>();
  return control ?? ctx.control;
}
