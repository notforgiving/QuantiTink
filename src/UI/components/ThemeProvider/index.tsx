import React, { FC, ReactNode, useEffect } from "react";
import { useTheme } from "api/features/user/useUser";

interface IThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<IThemeProviderProps> = ({children}) => {
  const theme = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme ?? 'light');
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
