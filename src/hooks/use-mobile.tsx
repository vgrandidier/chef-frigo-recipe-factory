
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to check if device is mobile based on width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listeners for resize and orientation change
    window.addEventListener("resize", checkIfMobile)
    window.addEventListener("orientationchange", checkIfMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
      window.removeEventListener("orientationchange", checkIfMobile)
    }
  }, [])

  return !!isMobile
}
