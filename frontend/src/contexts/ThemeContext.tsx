// src/contexts/ThemeContext.tsx
import React, { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface ThemeContextType {
  toggleTheme: () => void;
  mode: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: "light",
});

const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark";
    if (saved) setMode(saved);
  }, []);

  // Toggle theme
 const toggleTheme = () => {
  const newMode = mode === "light" ? "dark" : "light";
  console.log("Toggling theme:", newMode); // 🔥 check this
  setMode(newMode);
  localStorage.setItem("theme", newMode);
};
  // Define MUI theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: { default: "#f9f9f9", paper: "#fff" },
              }
            : {
                background: { default: "#121212", paper: "#1e1e1e" },
              }),
        },
        shape: { borderRadius: 12 },
        typography: { fontFamily: "Inter, sans-serif" },
      }),
    [mode]
  );

 return (
  <ThemeContext.Provider value={{ toggleTheme, mode }}>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </ThemeContext.Provider>
);

};

export default ThemeContextProvider;
