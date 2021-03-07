<template>
  <div>
    <v-container>
      <v-card dark>
        <v-card-title primary-title> Cloud Init Log </v-card-title>
        <v-card-text
          style="overflow: auto; font-family: monospace; white-space: pre"
          >{{ cloudInitOutputLog }}</v-card-text
        >
      </v-card>
    </v-container>
  </div>
</template>

<script>
import graphql from '~/graphql'
export default {
  data() {
    return {
      cloudInitOutputLog: '',
    }
  },
  async mounted() {
    const {
      data: { getCloudInitOutputLog },
    } = await this.$apollo.mutate({
      mutation: graphql.mutation.getCloudInitOutputLog,
      variables: {
        containerName: this.$route.params.id,
      },
    })
    this.cloudInitOutputLog = getCloudInitOutputLog
  },
}
</script>
