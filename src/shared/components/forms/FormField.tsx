'use client'

import React from 'react'
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form'

// Base props all form fields will need
interface BaseFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string
  helperText?: string
  error?: string
  required?: boolean
  className?: string
}

// Form field wrapper that handles common logic for all form components
export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  helperText,
  error,
  required = false,
  className = '',
  render,
  ...rest
}: BaseFieldProps<TFieldValues, TName> & {
  render: (props: {
    field: any
    fieldState: { error?: any; invalid: boolean }
    formState: any
  }) => React.ReactElement
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState, formState }) => (
          <>
            {render({ field, fieldState, formState })}

            {/* Show error message if there is one */}
            {fieldState.error?.message && (
              <p className="mt-1 text-sm text-red-500">
                {fieldState.error.message}
              </p>
            )}

            {/* Show helper text if there's no error and helper text exists */}
            {!fieldState.error?.message && helperText && (
              <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
          </>
        )}
        {...rest}
      />
    </div>
  )
}
