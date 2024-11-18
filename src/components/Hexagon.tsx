import * as React from 'react'

interface HexagonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  color?: string
  onClick?: () => void
  className?: string
}

export const Hexagon = React.forwardRef<HTMLDivElement, HexagonProps>(
  ({ children, color, onClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`hexagon ${color ? `color-${color}` : ''} ${className || ''}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Hexagon.displayName = 'Hexagon'
