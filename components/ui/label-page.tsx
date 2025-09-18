'use client'

import { HTMLAttributes, ReactNode } from 'react'

interface PageLabelProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

const PageLabel: React.FC<PageLabelProps> = ({ children, className, ...props }) => {
  return (
    <h2
      {...props}
      className={`
        flex items-center justify-center rounded-md
        text-sm font-medium transition-all
        outline-none whitespace-nowrap px-8 gap-2 bg-dark-2 text-light-1 h-10
        ${className || ''}
      `}
    >
      {children}
    </h2>
  )
}

export default PageLabel
