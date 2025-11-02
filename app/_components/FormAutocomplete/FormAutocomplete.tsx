'use client';

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
}: FormAutocompleteProps<TFieldValues, TName>) {
  const formContext = useFormContext<TFieldValues>();
  const formControl = control || formContext.control;
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside =
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node);

      if (clickedOutside) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => {
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

        return (
          <FormItem className={`relative ${className || ''}`}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                ref={inputRef}
                value={displayValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder={placeholder}
                autoComplete='off'
              />
            </FormControl>
            {isOpen && filteredOptions.length > 0 && (
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
