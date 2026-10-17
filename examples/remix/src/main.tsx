import { StrictMode } from 'react'
import { Avatar, createAvatar } from 'react-avatar-kit'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

// Remix's route-module pattern now lives in React Router 7 framework mode.
// This is the same loader + default export shape, mounted with a browser router.
const router = createBrowserRouter([
  {
    path: '/',
    loader: () => ({ config: createAvatar('remix-example') }),
    element: (
      <main style={{ fontFamily: 'system-ui', padding: 32 }}>
        <h1>react-avatar-kit · Remix-style route</h1>
        <Avatar seed="ada@example.com" size={96} alt="Ada" />
        <Avatar config={createAvatar('remix')} facialHair="moustache" palette="earth" />
      </main>
    ),
  },
])

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element')
createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
