// firebaseClient.ts

// import firebase from 'firebase/compat/app'
// import 'firebase/compat/auth'
// import 'firebase/compat/firestore'

// if (typeof window !== 'undefined' && !firebase.apps.length) {
//     firebase.initializeApp({
//         apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
//         authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//         projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//         storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//         messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//         appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
//     })
//     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
// }

// export { firebase as firebaseClient }

import { clientEnv } from '../../env/schema.mjs'

import { getAuth, browserSessionPersistence } from 'firebase/auth'
import { FirebaseOptions, initializeApp } from 'firebase/app'

const firebaseClientConfig: FirebaseOptions = {
    apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseClientConfig)
export const auth = getAuth(app)
auth.setPersistence(browserSessionPersistence)
