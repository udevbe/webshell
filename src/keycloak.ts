import Keycloak, { KeycloakInstance, KeycloakProfile } from 'keycloak-js'

const keycloak: KeycloakInstance =
  process.env.NODE_ENV === 'development'
    ? {
        authenticated: true,
        async init() {
          this.onReady?.(true)
          return true
        },
        async loadUserProfile(): Promise<KeycloakProfile> {
          return {
            username: 'Development User',
          }
        },
        async logout() {
          return true
        },
      }
    : // Setup Keycloak instance as needed
      // Pass initialization options as required or leave blank to load from 'keycloak.json'
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Keycloak()

export default keycloak
