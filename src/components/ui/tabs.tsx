// Simple button-based tabs replacement
import React from "react"
import { ClassNames } from "@emotion/react"
import { isMobile } from "react-device-detect"
import { cn } from "@/lib/utils"

type TabsValue = string

interface TabsContextValue {
  value: TabsValue | undefined
  setValue: (nextValue: TabsValue) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

const useTabsContext = () => {
  return React.useContext(TabsContext)
}

// Root Tabs component - just a container
interface TabsProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children?: React.ReactNode
  className?: string
}

export const Tabs = ({
  children,
  className,
  value,
  defaultValue,
  onValueChange,
}: TabsProps) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue
  )

  const currentValue = value ?? internalValue

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [onValueChange, value]
  )

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

// TabsList component - flex container for buttons
interface TabsListProps {
  children?: React.ReactNode
  className?: string
}

export const TabsList = ({ children, className }: TabsListProps) => {
  return <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>
}
TabsList.displayName = "TabsList"

// TabsTrigger component - actual button with active state
interface TabsTriggerProps {
  value: string
  active?: boolean
  children?: React.ReactNode
  className?: string
  borderRadius?: boolean
  onClick?: () => void
}

export const TabsTrigger = ({
  value,
  active: activeProp,
  children,
  className,
  borderRadius,
  onClick,
}: TabsTriggerProps) => {
  const ctx = useTabsContext()
  const active = activeProp ?? ctx?.value === value

  return (
    <ClassNames>
      {({ css }) => {
        const baseStyles = css`
          flex: 1;
          text-align: center;
          line-height: 2rem;
          display: flex; /* dùng flex để căn giữa */
          align-items: center; /* căn giữa theo trục Y */
          justify-content: center; /* căn giữa theo trục X */
          padding: ${isMobile ? "1rem 0.8rem" : "0.6rem 0.5rem"};
          ${borderRadius
            ? `
    border-top-left-radius: ${isMobile ? "0.8rem" : "1rem"};
    border-top-right-radius: ${isMobile ? "0.8rem" : "1rem"};
  `
            : ""}
          border: none;
          outline: none;
          cursor: pointer;
          transition:
            background-color 0.2s,
            color 0.2s,
            border 0.2s;
        `

        const activeStyles = css`
          font-weight: 700;
          background-color: oklab(0.567161 -0.13079 0.0377435);
          color: white;
        `

        const inactiveStyles = css`
          font-weight: 400;
          background-color: rgba(236, 247, 241, 1);
          color: var(--text-color, #333);
        `

        return (
          <button
            onClick={() => {
              ctx?.setValue(value)
              onClick?.()
            }}
            data-state={active ? "active" : "inactive"}
            className={cn(
              baseStyles,
              active ? activeStyles : inactiveStyles,
              className
            )}
          >
            {children}
          </button>
        )
      }}
    </ClassNames>
  )
}

TabsTrigger.displayName = "TabsTrigger"

// TabsContent component
export const TabsContent = ({
  children,
  value,
  className,
}: {
  children?: React.ReactNode
  value: string
  className?: string
}) => {
  const ctx = useTabsContext()
  if (!ctx) {
    throw new Error("TabsContent must be used within <Tabs />")
  }
  if (ctx.value !== value) return null
  return <div className={className}>{children}</div>
}

export type { TabsProps }

// Explicit default export for better module resolution
export default { Tabs, TabsList, TabsTrigger, TabsContent }
