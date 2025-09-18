'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonSmallProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

const ButtonSmall: React.FC<ButtonSmallProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={`
        w-12 h-10 flex items-center justify-center rounded-md
        text-sm font-medium transition-all
        disabled:pointer-events-none disabled:opacity-50
        outline-none bg-primary-500 hover:bg-primary-500/70 px-1
        ${className || ''}
      `}
    >
      {children}
    </button>
  )
}

export default ButtonSmall
