import {
  InMemoryCache,
  // IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
// import fragmentTypes from '~/fragmentTypes.json'
// const fragmentMatcher = new IntrospectionFragmentMatcher({
//   introspectionQueryResultData: fragmentTypes,
// })

export default function (context) {
  let config = {}
  if (process.client) {
    config = {
      httpPrefix: process.env.factotumClientSecure ? 'https' : 'http',
      wsPrefix: process.env.factotumClientSecure ? 'wss' : 'ws',
      hostname: process.env.factotumClientHost || window.location.hostname,
      port: process.env.factotumClientPort || window.location.port,
      url: process.env.factotumClientUrl || '/api/',
    }
  } else {
    config = {
      httpPrefix: process.env.factotumServerSecure ? 'https' : 'http',
      wsPrefix: process.env.factotumServerSecure ? 'wss' : 'ws',
      hostname: process.env.factotumServerHost || 'localhost',
      port: process.env.factotumServerPort || 4000,
      url: process.env.factotumServerUrl || '/',
    }
  }
  const portString = config.port ? `:${config.port}` : ``
  return {
    httpEndpoint: `${config.httpPrefix}://${config.hostname}${portString}${config.url}`,
    wsEndpoint: `${config.wsPrefix}://${config.hostname}${portString}${config.url}`,
    cache: new InMemoryCache({
      // fragmentMatcher
    }),
  }
}
