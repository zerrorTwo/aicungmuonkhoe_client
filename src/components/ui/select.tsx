// Wrapper for Ant Design Select to maintain Radix UI-like API
import { Select as AntSelect } from "antd"
import type { SelectProps as AntSelectProps } from "antd"
import React from "react"

interface OptionType {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

// Main Select component that accepts both Radix-style and Ant Design props
interface SelectProps extends Omit<AntSelectProps, "onChange" | "options"> {
  value?: string
  onValueChange?: (value: string) => void
  onChange?: (value: string) => void
  children?: React.ReactNode
  options?: OptionType[]
}

// Helper to extract options from children
const extractOptionsFromChildren = (
  children: React.ReactNode
): OptionType[] => {
  const options: OptionType[] = []

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as {
        value?: string
        disabled?: boolean
        children?: React.ReactNode
      }
      if (childProps.value !== undefined) {
        options.push({
          value: childProps.value,
          label: childProps.children,
          disabled: childProps.disabled,
        })
      }
    }
  })

  return options
}

export const Select = ({
  value,
  onValueChange,
  onChange,
  children,
  options: propOptions,
  ...props
}: SelectProps) => {
  const handleChange = (val: string) => {
    if (onValueChange) onValueChange(val)
    if (onChange) onChange(val)
  }

  // Extract options from children if no options prop provided
  const options = propOptions || extractOptionsFromChildren(children)

  return <AntSelect value={value} onChange={handleChange} options={options} {...props} />
}

// These are just pass-through components for compatibility
export const SelectTrigger = ({
  children,
}: {
  children?: React.ReactNode
  className?: string
}) => <>{children}</>
export const SelectValue: React.FC<{ placeholder?: string }> = () => null // Ant Design handles this internally
export const SelectContent = ({
  children,
}: {
  children?: React.ReactNode
  className?: string
}) => <>{children}</>

// SelectItem is now just a marker component for extracting options
export const SelectItem = ({
  children,
}: {
  value: string
  disabled?: boolean
  children?: React.ReactNode
}) => <>{children}</>

export type { SelectProps }
