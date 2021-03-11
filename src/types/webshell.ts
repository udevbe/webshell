import { Client } from 'westfield-runtime-server'

export type RemoteApps = Record<string, { id: string; icon: string; title: string; url: string; client?: Client }>
