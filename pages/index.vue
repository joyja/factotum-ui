<template>
  <v-row>
    <v-col
      v-for="(container, index) in containers"
      :key="container.name"
      cols="12"
      sm="6"
      md="4"
      lg="3"
      xl="2"
    >
      <v-card
        class="d-flex flex-column justify-space-between"
        style="height: 100%"
        color="blue-grey lighten-3"
      >
        <v-card-title>
          <v-list-item style="width: 100%">
            <v-list-item-content>
              <v-list-item-title>{{ container.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-truncate">{{
                container.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-card-actions>
          <v-dialog v-model="configs[index].showDisplay" width="600px">
            <v-form @submit.prevent="setDescription(index)">
              <v-card>
                <v-card-title>Edit {{ container.name }}</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="configs[index].description"
                    label="description"
                  />
                </v-card-text>
                <v-card-actions class="d-flex">
                  <v-btn type="submit" class="flex-grow-1">apply</v-btn>
                  <v-btn
                    class="flex-grow-1"
                    @click="configs[index].showDisplay = false"
                    >cancel</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
            <template v-slot:activator="{ on, attrs }">
              <v-btn block v-bind="attrs" v-on="on">edit</v-btn>
            </template>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import graphql from '~/graphql'
export default {
  async asyncData({ app, params }) {
    const provider = app.apolloProvider
    const client = provider.defaultClient
    let error = null
    const containers = await client
      .query({
        query: graphql.query.containers,
      })
      .then(({ data: { containers } }) => {
        return containers
      })
      .catch((e) => {
        error = e
      })
    return {
      containers,
      configs: containers.map(({ description }) => {
        return {
          description,
          showDialog: false,
        }
      }),
      error,
    }
  },
  methods: {
    async setDescription(index) {
      await this.$apollo.mutate({
        mutation: graphql.mutation.setDescription,
        variables: {
          containerName: this.containers[index].name,
          description: this.configs[index].description,
        },
      })
      await this.$apollo.queries.containers.refetch()
      this.configs = this.containers.map(({ description }) => {
        return {
          description,
          showDialog: false,
        }
      })
    },
  },
  apollo: {
    containers: {
      query: graphql.query.containers,
    },
  },
}
</script>
