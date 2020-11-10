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

export default {
  setDescription,
}
