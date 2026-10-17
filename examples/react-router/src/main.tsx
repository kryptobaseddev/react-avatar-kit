import { StrictMode } from 'react'
import { Avatar, createAvatar } from 'react-avatar-kit'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <main style={{ fontFamily: 'system-ui', padding: 32 }}>
        <h1>react-avatar-kit in React Router 7</h1>
        <Avatar seed="ada@example.com" size={96} alt="Ada" />
        <Avatar config={createAvatar('router')} facialHair="goatee" />
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
