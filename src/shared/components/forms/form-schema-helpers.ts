import { z } from 'zod'
import type { FormFieldSchema } from './FormGenerator'

/**
 * Generates a Zod validation schema from a form field schema array
 * This provides a convenient way to create validation rules based on form definitions
 */
export function generateValidationSchema(
  formSchema: FormFieldSchema[]
): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {}

  formSchema.forEach((field) => {
    // If the field has custom validation, use that
    if (field.validation) {
      shape[field.name] = field.validation
      return
    }

    // Otherwise, create validation based on field type and attributes
    let fieldValidator: z.ZodTypeAny

    switch (field.type) {
      case 'email':
        fieldValidator = z.string().email('Please enter a valid email address')
        break
      case 'number':
        fieldValidator = z.coerce
          .number()
          .min(0, 'Value must be a positive number')
        break
      case 'tel':
        fieldValidator = z
          .string()
          .regex(
            /^(\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
            'Please enter a valid phone number'
          )
        break
      case 'url':
        fieldValidator = z.string().url('Please enter a valid URL')
        break
      case 'checkbox':
        fieldValidator = z.boolean()
        break
      case 'select':
        // For select fields, ensure the value is one of the allowed options
        if (field.options && field.options.length > 0) {
          const allowedValues = field.options.map((option) => option.value)
          fieldValidator = z.enum([...(allowedValues as [string, ...string[]])])
        } else {
          fieldValidator = z.string()
        }
        break
      default:
        fieldValidator = z.string()
    }

    // Add required validation if field is marked as required
    if (field.required) {
      fieldValidator = fieldValidator.refine(
        (val) => {
          // For strings, check if not empty
          if (typeof val === 'string') {
            return val.trim().length > 0
          }
          // For other types, just check if value exists
          return val !== undefined && val !== null
        },
        {
          message: `${field.label} is required`,
        }
      )
    } else {
      // If not required, make it optional
      fieldValidator = fieldValidator.optional()
    }

    shape[field.name] = fieldValidator
  })

  return z.object(shape)
}

/**
 * Helper for creating a form field schema with proper types
 */
export function createFormField<T extends FormFieldSchema['type']>(
  field: Extract<FormFieldSchema, { type: T }>
): FormFieldSchema {
  return field
}

/**
 * Helper to create a form schema array with typed validation
 */
export function createFormSchema(fields: FormFieldSchema[]): FormFieldSchema[] {
  return fields
}
