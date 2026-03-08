import { env } from 'node:process'
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiEnvironment: env.NUXT_PUBLIC_API_ENVIRONMENT || 'dev',
      apiBaseUrlDev: env.NUXT_PUBLIC_API_BASE_URL_DEV || 'http://localhost:8080',
      apiBaseUrlProd: env.NUXT_PUBLIC_API_BASE_URL_PROD || 'http://localhost:8080',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['./assets/main.css'],
})
