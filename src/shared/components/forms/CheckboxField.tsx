'use client'

import { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { FormField } from './FormField'
import { Checkbox } from '@/shared/components/ui/checkbox'

interface CheckboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string
  checkboxLabel: string
  helperText?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export function CheckboxField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  checkboxLabel,
  helperText,
  required = false,
  className,
  disabled = false,
  ...rest
}: CheckboxFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      className={className}
      render={({ field, fieldState }) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled || fieldState.invalid}
            className={
              fieldState.error ? 'border-red-500 focus:ring-red-500' : ''
            }
          />
          <label
            htmlFor={name}
            className={`text-sm ${
              disabled ? 'text-gray-400' : 'text-gray-700'
            } ${fieldState.error ? 'text-red-500' : ''}`}
          >
            {checkboxLabel}
          </label>
        </div>
      )}
      {...rest}
    />
  )
}
