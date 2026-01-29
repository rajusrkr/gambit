import { createAuthClient } from "better-auth/react"

export const userAuthClient = createAuthClient({
    baseURL: "http://localhost:3333/api/user/auth"
})


export const adminAuthClient = createAuthClient({
    baseURL: "http://localhost:3333/api/admin/auth"
})

