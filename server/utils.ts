
export interface Request {
    path: string
    queries: Record<string, string>
    headers: Record<string, string>
    method: string
    url: string
    clientIP: string
}

export interface Response {
    setHeader(key: string, value: string): void
    setStatusCode(code: number): void
    send(body?: any): void
}


export interface Handler {
    (request: Request, response: Response, context: any): Promise<any>
}

const body = require('body');
const jsonBody = require('body/json');

export { body }

export function readJsonBody<T>(req: Request) {
    return new Promise<T>((resolve, reject) => {
        jsonBody(req, (err: any, json: T) => {
            if (err) {
                reject(err)
            } else {
                resolve(json)
            }
        })
    })
}

export function defineHandler(handler: Handler) {
    return (req: Request, resp: Response, context: any) => {
        handler(req, resp, context).then((result) => {
            if (result) {
                resp.setHeader('content-type', 'application/json')
                resp.send(JSON.stringify(result))
            } else {
                resp.send('')
            }
        }, (e) => {
            resp.setHeader('content-type', 'application/json')
            resp.send(JSON.stringify({ 'error': e }))
        })
    }
}