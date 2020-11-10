import gql from 'graphql-tag'

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
}
