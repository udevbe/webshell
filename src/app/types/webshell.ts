import { Client } from 'westfield-runtime-server'

export type RemoteApp = { id: string; icon: string; title: string; url: string; client?: Client }
