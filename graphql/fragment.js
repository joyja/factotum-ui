import gql from 'graphql-tag'

const config = gql`
  fragment ConfigBasic on Config {
    securityNesting
    userUserData
  }
`

const profile = gql`
  fragment ProfileBasic on Profile {
    name
    description
    config {
      ...ConfigBasic
    }
  }
  ${config}
`

const container = gql`
  fragment ContainerBasic on Container {
    name
    status
    status_code
    architecture
    ephemeral
    stateful
    description
    created_at
    last_used_at
    location
    type
  }
`

export default {
  container,
  config,
  profile,
}
