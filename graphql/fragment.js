import gql from 'graphql-tag'

const device = gql`
  fragment DeviceBasic on Device {
    id
    name
    type
  }
`

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
    devices {
      ...DeviceBasic
    }
  }
  ${config}
  ${device}
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
