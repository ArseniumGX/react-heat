import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthProvider = {
    children: ReactNode
}

type User = {
    id: string,
    name: string,
    avatar_url: string,
    login: string
}

type AuthContextData = {
    user: User | null,
    signInUrl: string,
    signOut: () => void
}

type AuthResponse = {
    token: string,
    user: {
        id: string,
        name: string,
        avatar_url: string,
        login: string
    }
}


export const AuthContext = createContext({} as AuthContextData)
 
export function AuthProvider(props: AuthProvider){
    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=0b0f0e22ff11143f7e32`

    const signIn = async(githubCode: string) => {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        })

        const { token, user } = response.data

        localStorage.setItem('@dowhile:token', token)

        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)
    }

    const signOut = () => {
        setUser(null)
        localStorage.removeItem("@dowhile:token")
    }

    useEffect(() => {
        const token = localStorage.getItem("@dowhile:token")
        
        if(token){
            api.defaults.headers.common.authorization = `Bearer ${token}`
            api.get<User>('profile').then(response => setUser(response.data))
        }
    }, [])

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')

        if(hasGithubCode){
            const [urlWithoutCode, codeGithub] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode)

            signIn(codeGithub)
        }
    }, [])

    return(
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}