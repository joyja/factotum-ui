<template>
  <v-container grid-list-xs>
    <v-layout column justify-center align-center>
      <jar-change-password />
    </v-layout>
    <v-layout column justify-center align-center>
      <v-card class="mb-3" width="500px">
        <v-card-title> Users </v-card-title>
        <v-list>
          <v-list-item v-for="user in users" :key="user.username">
            <v-list-item-content>
              <v-list-item-title>{{ user.username }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                fab
                small
                elevation="0"
                color="primary"
                @click="
                  UserToDelete = user
                  showDeleteUserDialog = true
                "
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-dialog
            v-model="createUserFields.showDialog"
            width="600px"
            scrollable
          >
            <v-form
              v-model="createUserFields.valid"
              @submit.prevent="createUser()"
            >
              <v-card>
                <v-card-title> Create User </v-card-title>
                <v-card-text>
                  <v-text-field
                    id="createUserUsername"
                    v-model="createUserFields.username"
                    name="createUserUsername"
                    label="Username"
                    :rules="createUserFields.usernameRules"
                  ></v-text-field>
                  <v-text-field
                    id="createUserPassword"
                    v-model="createUserFields.password"
                    name="createUserPassword"
                    label="Password"
                    :rules="createUserFields.passwordRules"
                    :type="createUserFields.passwordShow ? 'text' : 'password'"
                    :append-icon="
                      createUserFields.passwordShow ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    @click:append="
                      createUserFields.passwordShow = !createUserFields.passwordShow
                    "
                  ></v-text-field>
                  <v-text-field
                    id="createUserPasswordConfirm"
                    v-model="createUserFields.passwordConfirm"
                    name="createUserPasswordConfirm"
                    label="Password Confirmation"
                    :rules="osPasswordConfirmRules"
                    :type="
                      createUserFields.passwordConfirmShow ? 'text' : 'password'
                    "
                    :append-icon="
                      createUserFields.passwordConfirmShow
                        ? 'mdi-eye'
                        : 'mdi-eye-off'
                    "
                    @click:append="
                      createUserFields.passwordConfirmShow = !createUserFields.passwordConfirmShow
                    "
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    type="submit"
                    :loading="createUserFields.loading"
                    block
                    color="primary"
                    :disabled="!createUserFields.valid"
                    >create user</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
            <template #activator="{ on, attr }">
              <v-btn v-bind="attr" block color="primary" v-on="on"
                >create user</v-btn
              >
            </template>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-layout>
    <v-layout column justify-center align-center>
      <v-card width="500px">
        <v-card-title> OS Users </v-card-title>
        <v-list>
          <v-list-item v-for="user in osUsers" :key="user.username">
            <v-list-item-content>
              <v-list-item-title>{{ user.username }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                fab
                small
                elevation="0"
                color="primary"
                :to="{
                  name: 'ssh-username',
                  params: { username: user.username },
                }"
                nuxt
                ><v-icon>mdi-ssh</v-icon></v-btn
              >
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                fab
                small
                elevation="0"
                color="primary"
                @click="
                  OSUserToDelete = user
                  showDeleteOSUserDialog = true
                "
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-dialog
            v-model="createOSUserFields.showDialog"
            width="600px"
            scrollable
          >
            <v-form
              v-model="createOSUserFields.valid"
              @submit.prevent="createOSUser()"
            >
              <v-card>
                <v-card-title> Create User </v-card-title>
                <v-card-text>
                  <v-text-field
                    id="createOSUserUsername"
                    v-model="createOSUserFields.username"
                    name="createOSUserUsername"
                    label="Username"
                    :rules="createOSUserFields.usernameRules"
                  ></v-text-field>
                  <v-text-field
                    id="createOSUserPassword"
                    v-model="createOSUserFields.password"
                    name="createOSUserPassword"
                    label="Password"
                    :rules="createOSUserFields.passwordRules"
                    :type="
                      createOSUserFields.passwordShow ? 'text' : 'password'
                    "
                    :append-icon="
                      createOSUserFields.passwordShow
                        ? 'mdi-eye'
                        : 'mdi-eye-off'
                    "
                    @click:append="
                      createOSUserFields.passwordShow = !createOSUserFields.passwordShow
                    "
                  ></v-text-field>
                  <v-text-field
                    id="createOSUserPasswordConfirm"
                    v-model="createOSUserFields.passwordConfirm"
                    name="createOSUserPasswordConfirm"
                    label="Password Confirmation"
                    :rules="osPasswordConfirmRules"
                    :type="
                      createOSUserFields.passwordConfirmShow
                        ? 'text'
                        : 'password'
                    "
                    :append-icon="
                      createOSUserFields.passwordConfirmShow
                        ? 'mdi-eye'
                        : 'mdi-eye-off'
                    "
                    @click:append="
                      createOSUserFields.passwordConfirmShow = !createOSUserFields.passwordConfirmShow
                    "
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    type="submit"
                    :loading="createOSUserFields.loading"
                    block
                    color="primary"
                    :disabled="!createOSUserFields.valid"
                    >create os user</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
            <template #activator="{ on, attr }">
              <v-btn v-bind="attr" block color="primary" v-on="on"
                >create os user</v-btn
              >
            </template>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-layout>
    <v-dialog v-model="showDeleteOSUserDialog" scrollable max-width="500px">
      <v-form @submit.prevent="deleteOSUser()">
        <v-card color="blue-grey lighten-3">
          <v-card-text
            >Are you sure you want to delete {{ OSUserToDelete.username }}? All
            of the users files in their home directory will be deleted. This
            action cannot be undone.</v-card-text
          >
          <v-card-actions class="d-flex">
            <v-btn
              :loading="deleteOSUserLoading"
              color="warning"
              type="submit"
              class="flex-grow-1"
              >delete</v-btn
            >
            <v-btn class="flex-grow-1" @click="showDeleteOSUserDialog = false"
              >cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="showDeleteUserDialog" scrollable max-width="500px">
      <v-form @submit.prevent="deleteUser()">
        <v-card color="blue-grey lighten-3">
          <v-card-text
            >Are you sure you want to delete {{ UserToDelete.username }}? This
            action cannot be undone.</v-card-text
          >
          <v-card-actions class="d-flex">
            <v-btn
              :loading="deleteUserLoading"
              color="warning"
              type="submit"
              class="flex-grow-1"
              >delete</v-btn
            >
            <v-btn class="flex-grow-1" @click="showDeleteUserDialog = false"
              >cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-snackbar v-model="showError" top color="error">
      {{ error }}
    </v-snackbar>
  </v-container>
</template>

<script>
import ChangePassword from '~/components/ChangePassword'
import graphql from '~/graphql'
export default {
  components: {
    jarChangePassword: ChangePassword,
  },
  middleware: 'auth',
  transition: 'slide-y-transition',
  data() {
    return {
      selectedOSUser: {},
      showSSHDialog: false,
      showDeleteOSUserDialog: false,
      deleteOSUserLoading: false,
      showDeleteUserDialog: false,
      deleteUserLoading: false,
      error: null,
      showError: false,
      OSUserToDelete: {},
      UserToDelete: {},
      createUserFields: {
        showDialog: false,
        valid: false,
        username: null,
        usernameRules: [(v) => !!v || 'Username is required.'],
        password: null,
        passwordRules: [(v) => !!v || 'Password is required.'],
        passwordShow: false,
        passwordConfirm: null,
        passwordConfirmShow: false,
        error: null,
        loading: false,
      },
      createOSUserFields: {
        showDialog: false,
        valid: false,
        username: null,
        usernameRules: [(v) => !!v || 'Username is required.'],
        password: null,
        passwordRules: [(v) => !!v || 'Password is required.'],
        passwordShow: false,
        passwordConfirm: null,
        passwordConfirmShow: false,
        error: null,
        loading: false,
      },
    }
  },
  head() {
    return {
      title: 'Users',
    }
  },
  computed: {
    passwordConfirmRules() {
      return [
        (v) => !!v || 'Password confirmation is required',
        () =>
          this.createUserFields.password ===
            this.createUserFields.passwordConfirm ||
          `Password confirmation doesn't match password.`,
      ]
    },
    osPasswordConfirmRules() {
      return [
        (v) => !!v || 'Password confirmation is required',
        () =>
          this.createOSUserFields.password ===
            this.createOSUserFields.passwordConfirm ||
          `Password confirmation doesn't match password.`,
      ]
    },
  },
  methods: {
    createUser() {
      this.createUserFields.loading = true
      try {
        this.$apollo
          .mutate({
            mutation: graphql.mutation.createUser,
            variables: {
              username: this.createUserFields.username,
              password: this.createUserFields.password,
              passwordConfirm: this.createUserFields.passwordConfirm,
            },
          })
          .then(() => {
            this.createUserFields.showDialog = false
            this.createUserFields.loading = false
            this.$apollo.queries.users.refetch()
          })
          .catch((error) => {
            this.error = error
            this.showError = true
            this.createUserFields.loading = false
          })
      } catch (error) {
        this.error = error
        this.showError = true
      }
    },
    async createOSUser() {
      this.createOSUserFields.loading = true
      try {
        await this.$apollo
          .mutate({
            mutation: graphql.mutation.createOSUser,
            variables: {
              username: this.createOSUserFields.username,
              password: this.createOSUserFields.password,
              passwordConfirm: this.createOSUserFields.passwordConfirm,
            },
          })
          .then(() => {
            this.createOSUserFields.showDialog = false
            this.createOSUserFields.loading = false
            this.$apollo.queries.osUsers.refetch()
          })
          .catch((error) => {
            this.error = error
            this.showError = true
            this.createOSUserFields.loading = false
          })
      } catch (error) {
        this.error = error
        this.showError = true
      }
    },
    deleteUser() {
      this.deleteUserLoading = true
      try {
        this.$apollo
          .mutate({
            mutation: graphql.mutation.deleteUser,
            variables: {
              id: this.UserToDelete.id,
            },
          })
          .then(() => {
            this.showDeleteUserDialog = false
            this.deleteUserError = null
            this.deleteUserLoading = false
            this.$apollo.queries.users.refetch()
          })
          .catch((error) => {
            this.error = error
            this.showError = true
            this.deleteUserLoading = false
          })
      } catch (error) {
        this.error = error
        this.showError = true
        this.deleteUserLoading = false
      }
    },
    deleteOSUser() {
      this.deleteOSUserLoading = true
      try {
        this.$apollo
          .mutate({
            mutation: graphql.mutation.deleteOSUser,
            variables: {
              username: this.OSUserToDelete.username,
            },
          })
          .then(() => {
            this.showDeleteOSUserDialog = false
            this.deleteOSUserError = null
            this.deleteOSUserLoading = false
            this.$apollo.queries.osUsers.refetch()
          })
          .catch((error) => {
            this.error = error
            this.showError = true
            this.deleteOSUserLoading = false
          })
      } catch (error) {
        this.error = error
        this.showError = true
        this.deleteOSUserLoading = false
      }
    },
  },
  apollo: {
    users: {
      query: graphql.query.users,
      pollInterval: 2500,
    },
    osUsers: {
      query: graphql.query.osUsers,
      pollInterval: 2500,
    },
  },
}
</script>
