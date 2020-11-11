<template>
  <v-row>
    <v-col
      v-for="(profile, index) in profiles"
      :key="profile.name"
      cols="12"
      sm="12"
      md="6"
      lg="4"
      xl="3"
    >
      <v-card
        class="d-flex flex-column justify-space-between"
        style="height: 100%"
        color="blue-grey lighten-3"
      >
        <v-card-title>
          <v-list-item style="width: 100%" dense>
            <v-list-item-avatar horizontal rounded="0">
              <v-row align="end" no-gutters>
                <v-avatar size="36px" color="blue-grey lighten-5"
                  ><v-icon>mdi-file-document</v-icon></v-avatar
                >
              </v-row>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ profile.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-truncate">{{
                profile.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-card-actions>
          <v-dialog v-model="configs[index].showDisplay" width="600px">
            <v-form @submit.prevent="setDescription(index)">
              <v-card>
                <v-card-title>Edit {{ profile.name }}</v-card-title>
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
    const profiles = await client
      .query({
        query: graphql.query.profiles,
      })
      .then(({ data: { profiles } }) => {
        return profiles
      })
      .catch((e) => {
        error = e
      })
    return {
      profiles,
      configs: profiles.map(({ description }) => {
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
    profiles: {
      query: graphql.query.profiles,
    },
  },
}
</script>
