<template>
  <div />
</template>

<script>
import graphql from '../graphql'
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newSSHKeyForm: {
        loading: false,
        valid: false,
        key: null,
        keyRules: [(v) => !!v || 'A new key entry is required.'],
      },
    }
  },
  methods: {
    emiteError(error) {
      this.$emit('error', error)
    },
    addSSHKey() {
      this.newSSHKeyForm.loading = true
      try {
        this.$apollo
          .mutate({
            mutation: graphql.mutation.addAuthorizedKey,
            variables: {
              username: this.user.username,
              key: this.newSSHKeyForm.key,
            },
          })
          .then(() => {
            this.newSSHKeyForm.key = null
            this.newSSHKeyForm.loading = false
            this.$apollo.queries.users.refetch()
          })
          .catch((error) => {
            this.emitError(error)
            this.newSSHKeyForm.loading = false
          })
      } catch (error) {
        this.emitError(error)
      }
    },
    deleteAuthorizedKey(authorizedKey) {
      this.$emit('delete', authorizedKey)
    },
  },
}
</script>
