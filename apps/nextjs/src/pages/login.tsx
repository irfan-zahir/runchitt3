import React, { useState } from 'react'
import Link from 'next/link'
import { auth } from '../lib/firebase/firebaseClient'
import { NextPage } from 'next'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'

const Login: NextPage = () => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    return (
        <div>
            <Link href="/">
                <a>Go back to home page</a>
            </Link>
            <br />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={'Email'}
            />
            <input
                type={'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder={'Password'}
            />
            <button
                onClick={async () => {
                    await createUserWithEmailAndPassword(auth, email, pass)
                    window.location.href = '/'
                }}
            >
                Create account
            </button>
            <button
                onClick={async () => {
                    await signInWithEmailAndPassword(auth, email, pass)
                    window.location.href = '/'
                }}
            >
                Log in
            </button>
        </div>
    )
}

export default Login
