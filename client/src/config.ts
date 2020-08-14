// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
// export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
export const apiEndpoint = 'https://ir9ji152wi.execute-api.eu-central-1.amazonaws.com/staging'
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'udagram-baer-dev.eu.auth0.com',            // Auth0 domain
  clientId: 'LVkXepEMpSUVYHQuZlbBUBOf8EypxPwJ',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
