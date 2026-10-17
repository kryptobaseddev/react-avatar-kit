import { StrictMode } from 'react'
import { Avatar, createAvatar } from 'react-avatar-kit'
import { createRoot } from 'react-dom/client'

const config = createAvatar('vite-example')

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element')
createRoot(container).render(
  <StrictMode>
    <main style={{ fontFamily: 'system-ui', padding: 32 }}>
      <h1>react-avatar-kit in Vite</h1>
      <Avatar seed="ada@example.com" size={96} alt="Ada" />
      <Avatar config={config} facialHair="stubble" headphones="over-ear" />
    </main>
  </StrictMode>,
)
