'use client';

import { useFormContext, type Control, type FieldValues } from 'react-hook-form';

/**
 * Resolve a react-hook-form Control. If a `control` is provided, it is used; otherwise
 * the control from the nearest FormProvider (via useFormContext) is returned.
 *
 * @param control Optional Control instance from useForm/useController
 * @returns The resolved Control for the form
 *
 * @example
 * const control = useFormControl(props.control);
 */
function useFormControl<TFieldValues extends FieldValues>(control?: Control<TFieldValues>) {
  const ctx = useFormContext<TFieldValues>();
  return control ?? ctx.control;
}

export { useFormControl };
