// src/pages/_app.tsx
import '../styles/globals.css'
import type { AppType } from 'next/app'
import { trpc } from '../utils/trpc'
import { UserProvider } from '../context/user/useUserContext'

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default trpc.withTRPC(MyApp)
