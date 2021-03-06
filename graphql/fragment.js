import gql from 'graphql-tag'

const authorizedKey = gql`
  fragment AuthorizedKeyBasic on AuthorizedKey {
    line
    key
  }
`

const user = gql`
  fragment UserBasic on User {
    id
    username
  }
`

const osUser = gql`
  fragment OSUserBasic on OSUser {
    username
    authorizedKeys {
      line
      key
    }
  }
`

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
    network {
      name
      addresses {
        family
        address
        netmask
        scope
      }
      bytes_received
      bytes_sent
      packets_received
      packets_sent
      macAddress
      host_name
      mtu
      state
      type
    }
    profiles {
      name
    }
    status_code
    architecture
    ephemeral
    stateful
    description
    created_at
    last_used_at
    location
    type
    cloudInitComplete
    application
  }
`

const networkInterfaceConfig = gql`
  fragment NetworkInterfaceConfigBasic on NetworkInterfaceConfig {
    name
    dhcp4
    addresses
    gateway4
  }
`

const networkInterface = gql`
  fragment NetworkInterfaceBasic on NetworkInterface {
    id
    name
    alias
    mtu
    state
    ipAddresses
    macAddress
  }
`

export default {
  authorizedKey,
  user,
  osUser,
  container,
  config,
  profile,
  networkInterfaceConfig,
  networkInterface,
}
