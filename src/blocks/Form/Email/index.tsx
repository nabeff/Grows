import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const placeholder = `${label ?? ''}${required ? ' *' : ''}`.trim()

  return (
    <Width width={width}>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        placeholder={placeholder}
        aria-label={label || name}
        aria-required={!!required}
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required })}
        className="!bg-white !text-black shadow-sm"
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
