'use client';

import classNames from 'classnames';

export interface ButtonGroupOption<T = string> {
  label: string;
  value: T;
}

interface ButtonGroupProps<T = string> {
  className?: string;
  onChange: (value: T) => void;
  options: ButtonGroupOption<T>[];
  value: T;
}

function ButtonGroup<T = string>({ options, value, onChange, className }: ButtonGroupProps<T>) {
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
          <button
            key={index}
            type='button'
            onClick={() => onChange(option.value)}
            className={classNames(
              'cursor-pointer px-4 py-2 text-sm font-medium transition-colors',
              {
                'rounded-l-md': isFirst,
                'rounded-r-md': isLast,
                'border-l border-gray-300': !isFirst,
                'bg-purple-600 text-white': isSelected,
                'bg-white text-gray-700 hover:bg-purple-100': !isSelected,
              },
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default ButtonGroup;
