import './bootstrap'
import '../css/app.css'

import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'

import PolarisProvider from '@/providers/PolarisProvider'
import QueryProvider from '@/providers/QueryProvider'
import { initI18n } from '@/utils/i18nUtils'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el)

    initI18n().then(() => {
      root.render(
        <PolarisProvider>
          <QueryProvider>
            ,
            <App {...props} />
          </QueryProvider>
          ,
        </PolarisProvider>,
      )
    })
  },
  progress: {
    color: '#4B5563',
  },
})
