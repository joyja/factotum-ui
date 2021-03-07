<template>
  <v-container>
    <v-card>
      <v-card-title> SSH Keys For {{ user.username }} </v-card-title>
      <v-card-text v-if="user.authorizedKeys.length > 0">
        <v-hover
          v-for="authorizedKey in user.authorizedKeys"
          :key="authorizedKey.line"
        >
          <template #default="{ hover }">
            <v-card class="mb-3" color="blue-grey lighten-4" flat>
              <v-card-text>{{ authorizedKey.key }}</v-card-text>
              <v-fade-transition>
                <v-overlay
                  v-if="hover"
                  absolute
                  class="justify-end align-start"
                  color="orange lighten-3"
                >
                  <v-btn
                    class="ma-3"
                    fab
                    small
                    color="primary"
                    elevation="0"
                    @click="
                      keyToDelete = authorizedKey
                      showDeleteDialog = true
                    "
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </v-card-text>
      <v-card-text v-else>
        {{ user.username }} doesn't have any SSH keys.
      </v-card-text>
      <v-card-text class="flex-grow-0 flex-shrink-0">
        <v-form
          ref="newSSHKeyForm"
          v-model="newSSHKeyForm.valid"
          @submit.prevent="addSSHKey()"
        >
          <v-textarea
            id="id"
            v-model="newSSHKeyForm.key"
            :rules="newSSHKeyForm.keyRules"
            name="name"
            label="New SSH Key"
          ></v-textarea>
          <v-btn
            type="submit"
            :loading="newSSHKeyForm.loading"
            color="primary"
            block
            :disabled="!newSSHKeyForm.valid"
            >add ssh key</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
    <v-dialog v-model="showDeleteDialog" scrollable max-width="500px">
      <v-form @submit.prevent="deleteAuthorizedKey()">
        <v-card color="blue-grey lighten-3">
          <v-card-text
            >Are you sure you want to delete this ssh key?
            <v-card class="my-3" flat color="blue-grey lighten-5">
              <v-card-text>
                {{ keyToDelete.key }}
              </v-card-text> </v-card
            >SSH clients using this key will lose access and this action cannot
            be undone.</v-card-text
          >
          <v-card-actions class="d-flex">
            <v-btn
              :loading="deleteLoading"
              color="warning"
              type="submit"
              class="flex-grow-1"
              >delete</v-btn
            >
            <v-btn class="flex-grow-1" @click="showDeleteDialog = false"
              >cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
import graphql from '~/graphql'
export default {
  data() {
    return {
      showDeleteDialog: false,
      deleteLoading: false,
      keyToDelete: {},
      newSSHKeyForm: {
        loading: false,
        valid: false,
        key: null,
        keyRules: [(v) => !!v || 'A new key entry is required.'],
      },
    }
  },
  computed: {
    user() {
      return this.osUsers.find((user) => {
        return this.$route.params.username === user.username
      })
    },
  },
  methods: {
    initializeDeleteDialog(authorizedKey) {
      this.keyToDelete = authorizedKey
      this.showDeleteDialog = true
    },
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
            this.$refs.newSSHKeyForm.reset()
            this.newSSHKeyForm.loading = false
            this.$apollo.queries.osUsers.refetch()
          })
          .catch((error) => {
            this.setError(error)
            this.newSSHKeyForm.loading = false
          })
      } catch (error) {
        this.setError(error)
        this.newSSHKeyForm.loading = false
      }
    },
    deleteAuthorizedKey() {
      this.deleteLoading = true
      try {
        this.$apollo
          .mutate({
            mutation: graphql.mutation.deleteAuthorizedKey,
            variables: {
              username: this.user.username,
              line: this.keyToDelete.line,
            },
          })
          .then(() => {
            this.deleteLoading = false
            this.showDeleteDialog = false
            this.$apollo.queries.osUsers.refetch()
          })
          .catch((error) => {
            this.deleteLoading = false
            this.setError(error)
          })
      } catch (error) {
        this.deleteLoading = false
        this.setError(error)
      }
    },
    ...mapMutations(['setError']),
  },
  apollo: {
    osUsers: {
      query: graphql.query.osUsers,
      pollInterval: 2500,
    },
  },
}
</script>
