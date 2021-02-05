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

const createContainer = gql`
  mutation CreateContainer($containerName: String!, $profile: String!) {
    createContainer(containerName: $containerName, profile: $profile) {
      ...ContainerBasic
    }
  }
  ${fragment.container}
`

const deleteContainer = gql`
  mutation DeleteContainer($containerName: String!) {
    deleteContainer(containerName: $containerName) {
      ...ContainerBasic
    }
  }
  ${fragment.container}
`

const startContainer = gql`
  mutation StartContainer($containerName: String!) {
    startContainer(containerName: $containerName) {
      ...ContainerBasic
    }
  }
  ${fragment.container}
`

const stopContainer = gql`
  mutation StopContainer($containerName: String!) {
    stopContainer(containerName: $containerName) {
      ...ContainerBasic
    }
  }
  ${fragment.container}
`

const restartContainer = gql`
  mutation RetartContainer($containerName: String!) {
    restartContainer(containerName: $containerName) {
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
  createContainer,
  deleteContainer,
  startContainer,
  stopContainer,
  restartContainer,
  setInterfaceConfig,
}
