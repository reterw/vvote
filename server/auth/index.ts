import { defineHandler } from "../vote/utils";
import axios from 'axios'
export const CLIENT_SCERET = '6695f391a003c88418bd7a5d57c52e4137e4e2fb'
export const CLIENT_ID = '100087b3bd25a77c425b'
export const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'

export const auth = defineHandler(async (context, req) => {
    const authRes = await axios(`${GITHUB_ACCESS_TOKEN_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SCERET}&code=${req.query.code}&state=${req.query.state}`, {
        headers: {
            Accept: 'application/json'
        }
    })
    const token = authRes.data.access_token

    const userResp = await axios(`https://api.github.com/user`, { headers: { Authorization: `token ${token}` }})

    return { userId: userResp.data.login, avatarUrl: userResp.data.avatar_url, accessToken: token }
}, "GET")
