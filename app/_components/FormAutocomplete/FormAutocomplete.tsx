'use client';

import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { useFormContext, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface SelectOption {
  label: string;
  value: string;
}

interface FormAutocompleteProps<
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

function FormAutocomplete<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  options,
  placeholder = 'Select or type',
  control,
  className,
  required,
}: FormAutocompleteProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const hasControl = Boolean(control);
  const formControl = hasControl ? control : formContext.control;
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const hasDropdown = Boolean(dropdownRef.current);
      const clickedInDropdown = hasDropdown && dropdownRef.current.contains(event.target as Node);
      const hasInput = Boolean(inputRef.current);
      const clickedInInput = hasInput && inputRef.current.contains(event.target as Node);
      const clickedOutside = hasDropdown && hasInput && !clickedInDropdown && !clickedInInput;

      if (clickedOutside) {
        setIsOpen(false);
      }
    };

    const shouldListen = isOpen;
    if (shouldListen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => {
        const getOptionLabel = (value: string) => {
          return options.find(opt => opt.value === value)?.label || value;
        };

        const displayValue = searchValue || (field.value ? getOptionLabel(field.value) : '');
        const filteredOptions = options.filter(option =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()),
        );

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setSearchValue(value);
          field.onChange(value);
          setIsOpen(true);
        };

        const handleOptionSelect = (option: SelectOption) => {
          field.onChange(option.value);
          setSearchValue(option.label);
          setIsOpen(false);
        };

        const handleInputFocus = () => {
          if (!searchValue && field.value) {
            setSearchValue(getOptionLabel(field.value));
          }
          setIsOpen(true);
        };

        const hasLabel = Boolean(label);
        const hasError = Boolean(fieldState.error);

        const hasFilteredOptions = filteredOptions.length > 0;
        const shouldShowDropdown = isOpen && hasFilteredOptions;

        return (
          <FormItem className={classNames('relative', className)}>
            {hasLabel && <FormLabel required={required}>{label}</FormLabel>}
            <FormControl>
              <Input
                ref={inputRef}
                value={displayValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder={placeholder}
                autoComplete='off'
                className={classNames({
                  'border-red-500 focus-visible:ring-red-500': hasError,
                })}
              />
            </FormControl>
            {shouldShowDropdown && (
              <div
                ref={dropdownRef}
                className='absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-md max-h-60 overflow-auto'
              >
                {filteredOptions.map(option => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleOptionSelect(option)}
                    className='w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer'
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormAutocomplete;
