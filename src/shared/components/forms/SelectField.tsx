'use client'

import { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { FormField } from './FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

// Define option type for select fields
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string
  options: SelectOption[]
  placeholder?: string
  helperText?: string
  required?: boolean
  className?: string
  selectClassName?: string
  disabled?: boolean
}

export function SelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  options,
  placeholder = 'Select an option',
  helperText,
  required = false,
  className,
  selectClassName,
  disabled = false,
  ...rest
}: SelectFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      className={className}
      render={({ field, fieldState }) => (
        <Select
          defaultValue={field.value}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={`w-full ${selectClassName} ${
              fieldState.error ? 'border-red-500 focus:border-red-500' : ''
            }`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {...rest}
    />
  )
}
