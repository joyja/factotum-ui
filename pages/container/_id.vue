<template>
  <div>
    <v-container>
      <v-card color="blue-grey lighten-3">
        <v-card-title primary-title> Cloud Init Log </v-card-title>
        <v-expand-transition>
          <v-card
            v-if="!cloudInitOutputLog.loading && cloudInitOutputLog.show"
            rounded="0"
            style="overflow: auto; font-family: monospace; white-space: pre"
            dark
            ><v-card-text>{{ cloudInitOutputLog.text }}</v-card-text></v-card
          >
        </v-expand-transition>
        <v-expand-transition>
          <v-card-text v-if="cloudInitOutputLog.loading">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </v-card-text>
        </v-expand-transition>
        <v-card-actions>
          <v-btn block @click="toggleCloudInitOutputLog()"
            >{{ cloudInitOutputLog.show ? 'hide' : 'show' }} log</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import graphql from '~/graphql'
export default {
  data() {
    return {
      cloudInitOutputLog: {
        text: '',
        loading: false,
        show: false,
      },
    }
  },
  methods: {
    ...mapMutations(['setError']),
    async showCloudInitOutputLog() {
      this.cloudInitOutputLog.loading = true
      this.cloudInitOutputLog.show = true
      try {
        const {
          data: { getCloudInitOutputLog },
        } = await this.$apollo
          .mutate({
            mutation: graphql.mutation.getCloudInitOutputLog,
            variables: {
              containerName: this.$route.params.id,
            },
          })
          .then((result) => {
            this.cloudInitOutputLog.loading = false
            return result
          })
          .catch((error) => {
            this.cloudInitOutputLog.loading = false
            this.setError(error)
            this.cloudInitOutputLog.text =
              'The cloud init log could not be read.'
          })
        this.cloudInitOutputLog.text = getCloudInitOutputLog
      } catch (error) {
        this.setError(error)
        this.cloudInitOutputLog.text = 'The cloud init log could not be read.'
      }
    },
    hideCloudInitOutputLog() {
      this.cloudInitOutputLog.show = false
    },
    toggleCloudInitOutputLog() {
      if (this.cloudInitOutputLog.show) {
        this.hideCloudInitOutputLog()
      } else {
        this.showCloudInitOutputLog()
      }
    },
  },
}
</script>
