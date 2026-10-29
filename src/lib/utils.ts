import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
/** shadcn-style class helper (required by registry components). */
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
