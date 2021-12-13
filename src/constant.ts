import { v4 } from "uuid"

export const CLIENT_ID = '100087b3bd25a77c425b'
export const CLIENT_SCERET = '6695f391a003c88418bd7a5d57c52e4137e4e2fb'
export const REDIRECT_URL = import.meta.env.VITE_HOST_URL
// export const REDIRECT_URL = 'http://localhost:3000'

export const AUTH_SERVER_URL = 'https://1543338982436672.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/test/auth/'
export const GITHUB_LOGIN_URL = 'https://github.com/login/oauth/authorize'

let deviceId = localStorage.getItem('device-id')
if (!deviceId) {
    const id = v4()
    localStorage.setItem('device-id', id)
    deviceId = id
}

export { deviceId }
