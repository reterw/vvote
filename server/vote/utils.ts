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

export function defineRawHandler(handler: Handler) { return handler }

export function defineHandler(handler: Handler, allow: string = "GET,POST,OPTIONS,DELETE,PUT"): Handler {
    return async (context, req) => {
        if (req.method === 'OPTIONS') {
            context.res = {
                headers: {
                    allow
                }
            }
            return
        }
        const result = await handler(context, req)
        context.res = {
            body: JSON.stringify(result),
            headers: { 'content-type': 'application/json' }
        }
    }
}