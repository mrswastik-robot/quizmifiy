"use client";

import { SessionProvider } from 'next-auth/react'
import React from 'react'

import { ThemeProvider as NextThemesProvider, ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types"

// type Props = {
//     children: React.ReactNode             no longer need this prop , moving to ThemeProviderProps
// }                                   

const Providers = ({children}: ThemeProviderProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

      <SessionProvider>
        {children}
      </SessionProvider>

    </ThemeProvider>
    
  )
}

export default Providers