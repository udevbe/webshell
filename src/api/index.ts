import keycloak from '../keycloak'
import { ApplicationApi, Configuration } from './application'

const configuration = new Configuration({
  basePath: '/api/v1',
  // basePath: 'http://localhost:3001',
  accessToken: () => {
    return keycloak.token ?? ''
  },
})

export const application = new ApplicationApi(configuration)
