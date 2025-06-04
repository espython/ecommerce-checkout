'use client'

import { forwardRef } from 'react'
import { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { FormField } from './FormField'
import { Input } from '@/shared/components/ui/input'

interface TextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  helperText?: string
  required?: boolean
  className?: string
  inputClassName?: string
  autoComplete?: string
  disabled?: boolean
  maxLength?: number
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
}

export function TextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  helperText,
  required = false,
  className,
  inputClassName,
  autoComplete,
  disabled = false,
  maxLength,
  icon,
  iconPosition = 'start',
  ...rest
}: TextFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      helperText={helperText}
      required={required}
      className={className}
      render={({ field, fieldState }) => (
        <div
          className={`relative ${iconPosition === 'start' && icon ? 'has-icon-start' : iconPosition === 'end' && icon ? 'has-icon-end' : ''}`}
        >
          {icon && iconPosition === 'start' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}

          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            maxLength={maxLength}
            disabled={disabled || fieldState.invalid}
            className={`${inputClassName} ${fieldState.error ? 'border-red-500 focus:border-red-500' : ''} 
                       ${iconPosition === 'start' && icon ? 'pl-10' : ''} 
                       ${iconPosition === 'end' && icon ? 'pr-10' : ''}`}
            {...field}
            value={field.value ?? ''}
          />

          {icon && iconPosition === 'end' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
        </div>
      )}
      {...rest}
    />
  )
}
