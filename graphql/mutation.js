import gql from 'graphql-tag'
import fragment from './fragment'

const login = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        ...UserBasic
      }
    }
  }
  ${fragment.user}
`

const changePassword = gql`
  mutation ChangePassword($newPassword: String!, $newPasswordConfirm: String!) {
    changePassword(
      newPassword: $newPassword
      newPasswordConfirm: $newPasswordConfirm
    ) {
      ...UserBasic
    }
  }
  ${fragment.user}
`

const createUser = gql`
  mutation CreateUser(
    $username: String!
    $password: String!
    $passwordConfirm: String!
  ) {
    createUser(
      username: $username
      password: $password
      passwordConfirm: $passwordConfirm
    ) {
      ...UserBasic
    }
  }
  ${fragment.user}
`

const deleteUser = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      username
    }
  }
`

const createOSUser = gql`
  mutation CreateOSUser(
    $username: String!
    $password: String!
    $passwordConfirm: String!
  ) {
    createOSUser(
      username: $username
      password: $password
      passwordConfirm: $passwordConfirm
    ) {
      ...OSUserBasic
    }
  }
  ${fragment.osUser}
`

const deleteOSUser = gql`
  mutation DeleteOSUser($username: String!) {
    deleteOSUser(username: $username) {
      username
    }
  }
`

const addAuthorizedKey = gql`
  mutation AddAuthorizedKey($username: String!, $key: String!) {
    addAuthorizedKey(username: $username, key: $key) {
      line
      key
    }
  }
`

const deleteAuthorizedKey = gql`
  mutation DeleteAuthorizedKey($username: String!, $line: Int!) {
    deleteAuthorizedKey(username: $username, line: $line) {
      line
      key
    }
  }
`

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
  mutation RestartContainer($containerName: String!) {
    restartContainer(containerName: $containerName) {
      ...ContainerBasic
    }
  }
  ${fragment.container}
`

const getCloudInitOutputLog = gql`
  mutation GetCloudInitOutputLog($containerName: String!) {
    getCloudInitOutputLog(containerName: $containerName)
  }
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
  login,
  changePassword,
  setDescription,
  createUser,
  deleteUser,
  createOSUser,
  deleteOSUser,
  addAuthorizedKey,
  deleteAuthorizedKey,
  createContainer,
  deleteContainer,
  startContainer,
  stopContainer,
  restartContainer,
  getCloudInitOutputLog,
  setInterfaceConfig,
}
