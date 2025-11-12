import {
    createAuthClient
} from "better-auth/react";

const baseURL = import.meta.env.VITE_API_URL;   

export const authClient = createAuthClient({
    baseURL: baseURL,

})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;