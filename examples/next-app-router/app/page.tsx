import { Avatar, createAvatar } from 'react-avatar-kit'

export default function Page() {
  const config = createAvatar('next-server-component')
  return (
    <main style={{ fontFamily: 'system-ui', padding: 32 }}>
      <h1>react-avatar-kit in a React Server Component</h1>
      <Avatar seed="ada@example.com" size={96} alt="Ada" />
      <Avatar config={config} shape="rounded" facialHair="beard" earring="hoop" />
    </main>
  )
}
