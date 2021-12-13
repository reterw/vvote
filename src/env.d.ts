interface ImportMetaEnv {
    readonly VITE_VOTE_URL: string
    readonly VITE_HOST_URL: string
   
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
