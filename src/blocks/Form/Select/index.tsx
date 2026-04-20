import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, options, required, width, defaultValue }) => {
  const placeholder = `${label ?? ''}${required ? ' *' : ''}`.trim()

  return (
    <Width width={width}>
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)

          return (
            <SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger
                id={name}
                className={`w-full !h-[56px] !bg-white !text-black text-sm border-0 border-b rounded-none px-2 py-0 shadow-none outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 data-[placeholder]:!text-muted-foreground data-[placeholder]:!font-normal ${
                  errors[name]
                    ? '!border-red-500 hover:!border-red-500 focus:!border-red-500'
                    : 'border-[#18CB96]/30 hover:border-[#18CB96] focus:border-[#18CB96]'
                }`}
                aria-label={label || name}
                aria-required={!!required}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="!bg-white !text-black border border-black/10 shadow-md">
                {options.map(({ label, value }) => {
                  return (
                    <SelectItem
                      key={value}
                      value={value}
                      className="!text-black focus:!bg-[#18CB96] focus:!text-white data-[highlighted]:!bg-[#18CB96] data-[highlighted]:!text-white cursor-pointer"
                    >
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </SelectComponent>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
