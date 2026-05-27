import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#2D6A4F] text-white hover:bg-[#1B4332] focus-visible:ring-[#2D6A4F] shadow-sm',
        secondary:
          'bg-[#B5860D] text-white hover:bg-[#9A7010] focus-visible:ring-[#B5860D] shadow-sm',
        accent:
          'bg-[#1B2A4A] text-white hover:bg-[#152039] focus-visible:ring-[#1B2A4A] shadow-sm',
        outline:
          'border-2 border-[#2D6A4F] text-[#2D6A4F] bg-transparent hover:bg-[#2D6A4F] hover:text-white focus-visible:ring-[#2D6A4F]',
        ghost:
          'text-[#2D6A4F] hover:bg-[#2D6A4F]/10 focus-visible:ring-[#2D6A4F]',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        link: 'text-[#2D6A4F] underline-offset-4 hover:underline p-0 h-auto',
        whatsapp:
          'bg-[#25D366] text-white hover:bg-[#20B857] focus-visible:ring-[#25D366] shadow-lg',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-md px-4 text-xs',
        lg: 'h-14 rounded-xl px-8 text-base',
        xl: 'h-16 rounded-xl px-10 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
