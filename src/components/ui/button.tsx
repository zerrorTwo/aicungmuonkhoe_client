// Re-export Ant Design Button as custom Button for compatibility
import { Button as AntButton } from "antd"
import type { ButtonProps as AntButtonProps } from "antd"
import { cn } from "@/lib/utils"

export interface ButtonProps extends Omit<AntButtonProps, "type" | "variant"> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
  asChild?: boolean
  type?: "button" | "submit" | "reset"
}

export const Button = ({
  variant = "default",
  className,
  type,
  htmlType,
  ...props
}: ButtonProps) => {
  // Use Tailwind for colors (AntD primary has its own blue theme).
  // Keep AntD type minimal and override visuals via Tailwind classes.
  const typeMap = {
    default: "default",
    destructive: "default",
    outline: "default",
    secondary: "default",
    ghost: "text",
    link: "link",
  } as const

  const variantClassMap = {
    default: "!bg-emerald-600 !text-white hover:!bg-emerald-700 ",
    destructive:
      "!bg-red-600 !text-white hover:!bg-red-700 hover:!border-red-700",
    outline: "!bg-transparent !text-emerald-600 hover:!bg-emerald-50",
    secondary: "!bg-slate-100 !text-slate-900 hover:!bg-slate-200",
    ghost:
      "bg-transparent border-transparent text-slate-700 hover:bg-slate-100",
    link: "bg-transparent border-transparent text-emerald-600 hover:text-emerald-700",
  } as const

  const antType: AntButtonProps["type"] = typeMap[variant] || "default"

  return (
    <AntButton
      type={antType}
      htmlType={htmlType ?? type}
      className={cn(
        "disabled:!cursor-not-allowed disabled:!opacity-50",
        variantClassMap[variant],
        className
      )}
      {...props}
    />
  )
}

export { AntButton }
