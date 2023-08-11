import { useEffect, useMemo, useState } from 'react'
import { onIdTokenChanged, User } from 'firebase/auth'
import { trpc as api } from '../../utils/trpc'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { auth } from '../../lib/firebase/firebaseClient'

export const useUser = () => {
    const router = useRouter()
    const [firebaseUser, setUser] = useState<User | null>(null)
    const [isUserLoading, setIsUserLoading] = useState(true)

    useEffect(function getUser() {
        const unsubscribe = onIdTokenChanged(auth, async (updatedUser) => {
            if (!updatedUser) {
                setUser(null)
                nookies.destroy(null, 'token')
                nookies.set(null, 'token', '', { path: '/' })
                return
            }

            const token = await updatedUser.getIdToken()
            setIsUserLoading(false)
            setUser(updatedUser)
            nookies.destroy(null, 'token')
            nookies.set(null, 'token', token, { path: '/' })
        })
        return () => unsubscribe()
    }, [])

    // force refresh token every 10 minutes
    useEffect(() => {
        const handle = setInterval(async () => {
            const updatedUser = auth.currentUser
            if (updatedUser) {
                await updatedUser.getIdToken(true)
                setUser(updatedUser)
            }
        }, 10 * 60 * 1000)
        return () => clearInterval(handle)
    }, [])

    const { data: accountData, isLoading: isProfileLoading } =
        api.user.login.useQuery(undefined, {
            enabled: !!firebaseUser,
            retry: 1,
        })

    const account = useMemo(
        function getProfile() {
            return accountData ? accountData : null
        },
        [accountData]
    )

    return {
        firebaseUser,
        setUser,
        isUserLoading,
        account,
        isProfileLoading,
    }
}

export type UseUser = ReturnType<typeof useUser>
