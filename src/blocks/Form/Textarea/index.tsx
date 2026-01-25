import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({ name, defaultValue, errors, label, register, required, rows = 3, width }) => {
  const placeholder = `${label ?? ''}${required ? ' *' : ''}`.trim()

  return (
    <Width width={width}>
      <TextAreaComponent
        defaultValue={defaultValue}
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-label={label || name}
        aria-required={!!required}
        {...register(name, { required: required })}
        className="!bg-white !text-black shadow-sm"
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
