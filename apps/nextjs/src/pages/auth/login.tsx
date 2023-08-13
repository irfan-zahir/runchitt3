
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FloatingInput } from '../../components/input'
import {
    ConfirmationResult,
    RecaptchaVerifier,
    getAuth,
    signInWithPhoneNumber,
} from 'firebase/auth'

import {Dialog} from "@headlessui/react"
import { useUserContext } from '../../context/user/useUserContext'

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier
    }
}
type PhoneFormHandler = SubmitHandler<{ phone?: string; countryCode?: string }>
type CodeFormHandler = SubmitHandler<{ code?: string }>

const Login = () => {
    const auth = getAuth()
    const { register, reset, handleSubmit } = useForm()

    const userCtx = useUserContext()
    const [loading , setLoading] = useState(true)

    const [confirmCode, setConfirmCode] = useState<ConfirmationResult | null>(
        null
    )

    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            'captcha-container',
            { size: 'invisible' },
            auth
        )
        return
    })

    const sendOTP: PhoneFormHandler = ({ phone, countryCode = '+6' }) => {
        const appVerifier = window.recaptchaVerifier
        if (appVerifier) {
            if (phone !== null)
                signInWithPhoneNumber(
                    auth,
                    `${countryCode}${phone}`,
                    appVerifier
                )
                    .then((confirmationResult) => {
                        setConfirmCode(confirmationResult)
                        reset()
                    })
                    .catch((e) => console.error('phone sign in: ', e))
        }
    }

    const verifyCode: CodeFormHandler = async ({ code }) =>
        confirmCode &&
        code &&
        (await confirmCode.confirm(code).catch((e) => {
            console.error('verifying OTP code: ', e)
        }))

    return (
        <>
            <Head>
                <title>Login - Runchit</title>
            </Head>
            <div className="min-h-full flex items-center">
                <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                        <div id="captcha-container"></div>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form
                            onSubmit={handleSubmit(
                                !confirmCode ? sendOTP : verifyCode
                            )}
                            className="space-y-6"
                        >
                            {!confirmCode ? (
                                <FloatingInput
                                    id="phone"
                                    type="tel"
                                    placeholder="Phone number"
                                    {...register('phone', {
                                        required: true,
                                        minLength: 10,
                                        maxLength: 11,
                                    })}
                                />
                            ) : (
                                <FloatingInput
                                    id="code"
                                    type="number"
                                    placeholder="6-digit OTP code"
                                    {...register('code', {
                                        required: true,
                                        minLength: 6,
                                        maxLength: 6,
                                    })}
                                />
                            )}

                            <div>
                                {!confirmCode && (
                                    <button className="flex mx-auto w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Sign in
                                    </button>
                                )}
                                {confirmCode && (
                                    <button className="flex mx-auto w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Verify code
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Login
