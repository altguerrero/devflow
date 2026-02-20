"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";

const ThemeProvider = ({ children, ...pageProps }: ThemeProviderProps) => {
  return <NextThemeProvider {...pageProps}>{children}</NextThemeProvider>;
};

export default ThemeProvider;
