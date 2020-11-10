import gql from 'graphql-tag'
import fragment from './fragment'

const containers = gql`
  query Containers {
    containers {
      ...ContainerBasic
    }
  }
  ${fragment.container}
`

export default {
  containers,
}
