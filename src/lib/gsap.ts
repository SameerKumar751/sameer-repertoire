import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
// Mobile URL-bar show/hide resizes the viewport; without this every scroll tick can trigger a full refresh (visible jumps).
ScrollTrigger.config({ ignoreMobileResize: true })
export { gsap, ScrollTrigger, useGSAP }
