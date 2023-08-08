"use client";

import { SessionProvider } from 'next-auth/react'
import React from 'react'

import { ThemeProvider as NextThemesProvider, ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// type Props = {
//     children: React.ReactNode             no longer need this prop , moving to ThemeProviderProps
// }        

const queryClient = new QueryClient();

const Providers = ({children}: ThemeProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

      <SessionProvider>
        {children}
      </SessionProvider>

    </ThemeProvider>
    </QueryClientProvider>
    
  )
}

export default Providers