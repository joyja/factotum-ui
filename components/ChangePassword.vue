<template>
  <v-card class="mb-3" width="500px">
    <v-form
      ref="changePasswordForm"
      v-model="valid"
      class="m-3"
      @submit.prevent="changePassword"
    >
      <v-card-text>
        <v-text-field
          id="password"
          v-model="password"
          :type="passwordShow ? 'text' : 'password'"
          :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          name="password"
          label="Password"
          :rules="passwordRules"
          @click:append="passwordShow = !passwordShow"
        ></v-text-field>
        <v-text-field
          id="passwordConfirm"
          v-model="passwordConfirm"
          :type="passwordConfirmShow ? 'text' : 'password'"
          :append-icon="passwordConfirmShow ? 'mdi-eye' : 'mdi-eye-off'"
          name="passwordConfirm"
          label="Password Confirm"
          :rules="passwordConfirmRules"
          @click:append="passwordConfirmShow = !passwordConfirmShow"
        ></v-text-field>
        <v-alert
          transition="scale-transition"
          type="error"
          :value="error !== null"
          width="100%"
          >{{
            error ? error.message.replace('GraphQL error: ', '') : null
          }}</v-alert
        >
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" block color="primary" :disabled="!valid"
          >Change Password</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex'
import graphql from '~/graphql'
export default {
  data() {
    return {
      valid: false,
      password: ``,
      passwordRules: [(v) => !!v || 'Password is required'],
      passwordShow: false,
      passwordConfirm: ``,
      passwordConfirmShow: false,
      error: null,
    }
  },
  computed: {
    passwordConfirmRules() {
      return [
        (v) => !!v || 'Password confirmation is required',
        () =>
          this.password === this.passwordConfirm ||
          `Password confirmation doesn't match password.`,
      ]
    },
  },
  methods: {
    async changePassword() {
      try {
        const {
          data: {
            changePassword: { user, token },
          },
        } = await this.$apollo
          .mutate({
            mutation: graphql.mutation.changePassword,
            variables: {
              newPassword: this.password,
              newPasswordConfirm: this.passwordConfirm,
            },
          })
          .catch((error) => {
            this.$apolloHelpers.onLogout()
            throw error
          })
        this.error = null
        this.$apolloHelpers.onLogin(token)
        this.setState({ key: 'user', value: user })
        this.$router.push({ name: 'index' })
      } catch (error) {
        this.error = error
      }
    },
    ...mapMutations(['setState']),
  },
}
</script>
