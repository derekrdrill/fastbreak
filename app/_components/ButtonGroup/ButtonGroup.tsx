'use client';

import classNames from 'classnames';
import { Button } from '@/components/ui/button';

export interface ButtonGroupOption<T = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface ButtonGroupProps<T = string> {
  className?: string;
  onChange: (value: T) => void;
  options: ButtonGroupOption<T>[];
  value: T;
  disabled?: boolean;
}

function ButtonGroup<T = string>({
  options,
  value,
  onChange,
  className,
  disabled,
}: ButtonGroupProps<T>) {
  return (
    <div
      className={classNames(
        'inline-flex rounded-md border border-gray-300 bg-white shadow-sm',
        className,
      )}
    >
      {options.map((option, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const isSelected = value === option.value;

        return (
          <Button
            key={index}
            className={classNames('rounded-none border-0', {
              'rounded-l-md': isFirst,
              'rounded-r-md': isLast,
              'border-l border-gray-300': !isFirst,
              'bg-purple-600 text-white hover:bg-purple-700': isSelected,
              'bg-white text-gray-700 hover:bg-purple-100': !isSelected,
            })}
            onClick={() => onChange(option.value)}
            size='sm'
            type='button'
            variant={isSelected ? 'default' : 'outline'}
            disabled={disabled}
          >
            {option.icon}
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export default ButtonGroup;
