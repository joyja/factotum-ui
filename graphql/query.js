import gql from 'graphql-tag'
import fragment from './fragment'

const profiles = gql`
  query Profiles {
    profiles {
      ...ProfileBasic
    }
  }
  ${fragment.profile}
`

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
  profiles,
}
