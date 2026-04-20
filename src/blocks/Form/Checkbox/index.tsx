import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxUi } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const props = register(name, { required: required })
  const { setValue } = useFormContext()

  return (
    <Width width={width}>
      <div className="flex items-start gap-2 py-2">
        <CheckboxUi
          defaultChecked={defaultValue}
          id={name}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked)
          }}
          className="mt-0.5 border-black/40 data-[state=checked]:bg-[#18CB96] data-[state=checked]:border-[#18CB96] data-[state=checked]:text-white"
        />
        <Label htmlFor={name} className="text-sm text-black/80 leading-snug cursor-pointer">
          {label}
          {required && <span className="text-[#18CB96] ml-1">*</span>}
        </Label>
      </div>
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
