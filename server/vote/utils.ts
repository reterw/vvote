import { AzureFunction, Context, HttpRequest } from "@azure/functions"

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
    (context: Context, req: HttpRequest): Promise<any> | void;
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

export function defineRawHandler(handler: Handler) { return handler }

export function defineHandler(handler: Handler): Handler {
    return async (context, req) => {
        const result = await handler(context, req)
        context.res = {
            body: JSON.stringify(result),
            headers: { 'content-type': 'application/json' }
        }
    }
}