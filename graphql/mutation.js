import gql from 'graphql-tag'
import fragment from './fragment'

const setDescription = gql`
  mutation SetDescription($containerName: String!, $description: String!) {
    setDescription(containerName: $containerName, description: $description) {
      ...ContainerBasic
    }
  }
  ${fragment.container}
`

const setInterfaceConfig = gql`
  mutation setInterfaceConfig(
    $name: String!
    $dhcp: Boolean!
    $addresses: [String!]!
    $gateway: String
  ) {
    setInterfaceConfig(
      name: $name
      dhcp: $dhcp
      addresses: $addresses
      gateway: $gateway
    ) {
      ...NetworkInterfaceBasic
    }
  }
  ${fragment.networkInterface}
`

export default {
  setDescription,
  setInterfaceConfig,
}
