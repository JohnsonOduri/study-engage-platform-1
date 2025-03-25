
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import './index.css'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import path from 'path'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light">
    <App />
  </ThemeProvider>
);
