'use client'

import React, { JSX } from 'react'
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
  UseFormProps,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { TextField } from './TextField'
import { SelectField, SelectOption } from './SelectField'
import { CheckboxField } from './CheckboxField'

// Define the schema type that maps to form fields
export type FormFieldSchema = {
  name: string
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'select'
    | 'checkbox'
  label: string
  placeholder?: string
  helperText?: string
  required?: boolean
  options?: SelectOption[] // For select fields
  checkboxLabel?: string // For checkbox fields
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
  disabled?: boolean
  autoComplete?: string
  maxLength?: number
  validation?: z.ZodTypeAny // Allow custom zod validation
}

interface FormGeneratorProps<T extends FieldValues> {
  // Form schema used to generate fields
  schema: FormFieldSchema[]
  // Zod schema for validation (optional)
  validationSchema?: z.ZodType<any, any>
  // Default values for the form
  defaultValues?: UseFormProps<T>['defaultValues']
  // Handler for form submission
  onSubmit: SubmitHandler<T>
  // Custom submit button text
  submitText?: string
  // Optional cancel button and handler
  cancelText?: string
  onCancel?: () => void
  // Loading state
  isLoading?: boolean
  // Additional form props
  className?: string
  // Form component that wraps everything (default: form)
  formComponent?:
    | React.ComponentType<React.ComponentPropsWithoutRef<'form'>>
    | keyof JSX.IntrinsicElements
}

/**
 * A dynamic form generator that creates forms based on a schema
 */
export function FormGenerator<T extends FieldValues>({
  schema,
  validationSchema,
  defaultValues,
  onSubmit,
  submitText = 'Submit',
  cancelText,
  onCancel,
  isLoading = false,
  className = '',
  formComponent: FormComponent = 'form',
}: FormGeneratorProps<T>) {
  // Initialize react-hook-form with zod resolver if validation schema is provided
  const methods = useForm<T>({
    defaultValues,
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
  })

  // Form submission handler
  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <FormProvider {...methods}>
      <FormComponent
        className={`space-y-6 ${className}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="space-y-4">
          {schema.map((field) => {
            const key = `form-field-${field.name}`

            switch (field.type) {
              case 'text':
              case 'email':
              case 'password':
              case 'tel':
              case 'url':
              case 'number':
                return (
                  <TextField
                    key={key}
                    control={methods.control}
                    name={field.name as any}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    helperText={field.helperText}
                    required={field.required}
                    icon={field.icon}
                    iconPosition={field.iconPosition}
                    // disabled={field.disabled || isLoading}
                    autoComplete={field.autoComplete}
                    maxLength={field.maxLength}
                  />
                )
              case 'select':
                return (
                  <SelectField
                    key={key}
                    control={methods.control}
                    name={field.name as any}
                    label={field.label}
                    options={field.options || []}
                    placeholder={field.placeholder}
                    helperText={field.helperText}
                    required={field.required}
                    disabled={field.disabled || isLoading}
                  />
                )
              case 'checkbox':
                return (
                  <CheckboxField
                    key={key}
                    control={methods.control}
                    name={field.name as any}
                    label={field.label}
                    checkboxLabel={field.checkboxLabel || field.label}
                    helperText={field.helperText}
                    required={field.required}
                    disabled={field.disabled || isLoading}
                  />
                )
              default:
                return null
            }
          })}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-2">
          {cancelText && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : submitText}
          </Button>
        </div>
      </FormComponent>
    </FormProvider>
  )
}
