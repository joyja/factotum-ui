<template>
  <v-row>
    <v-col v-if="containers.length < 1">
      You have no containers. Create a new one
      <nuxt-link :to="{ name: 'index' }">here</nuxt-link>!
    </v-col>
    <v-col
      v-for="(container, index) in containers"
      :key="container.name"
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
                <v-avatar
                  v-if="
                    [
                      'grafana',
                      'ignition',
                      'codesys',
                      'mosquitto',
                      'nginx',
                      'node-red',
                      'postgres',
                      'tentacle',
                    ].some((a) => a === container.application)
                  "
                  size="36px"
                  :color="
                    ['ignition', 'tentacle'].some(
                      (a) => a === container.application
                    )
                      ? 'blue-grey darken-4'
                      : 'blue-grey lighten-4'
                  "
                >
                  <v-img
                    aspect-ratio="1"
                    :lazy-src="`${container.application}_blur.png`"
                    :src="`${container.application}.png`"
                    color="blue-grey darken-4"
                  ></v-img>
                </v-avatar>
                <v-avatar v-else size="36px" color="blue-grey lighten-5">
                  <v-icon>mdi-server</v-icon>
                </v-avatar>
                <v-avatar
                  style="margin-bottom: 3px; margin-left: -7px"
                  size="7px"
                  :color="container.status === 'Running' ? 'green' : 'grey'"
                ></v-avatar>
              </v-row>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ container.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-truncate">{{
                container.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-expand-transition>
          <v-card-text v-if="container.status === 'Running'">
            <v-card color="blue-grey lighten-4" flat>
              <v-card-title primary-title
                ><span class="text-subtitle-1">networking</span></v-card-title
              >
              <v-row
                v-if="container.network.length < 1"
                class="d-flex flex-column blue-grey lighten-5"
                no-gutters
              >
                <v-progress-linear :indeterminate="true"></v-progress-linear>
                <div class="text-center">Configuring...</div>
              </v-row>
              <v-list color="blue-grey lighten-5" dense>
                <v-list-item
                  v-for="(network, networkIndex) in container.network"
                  :key="networkIndex"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ network.addresses[0].address }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ network.name
                      }}{{
                        network.host_name
                          ? ` (parent: ${network.host_name})`
                          : ''
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <v-row
              v-if="!container.cloudInitComplete"
              class="d-flex flex-column"
              no-gutters
            >
              <v-progress-linear :indeterminate="true"></v-progress-linear>
              <div class="text-center">Creating...</div>
            </v-row>
          </v-card-text>
        </v-expand-transition>
        <v-card-actions class="justify-space-between">
          <div>
            <v-dialog v-model="configs[index].showDialog" width="600px">
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
                      @click="configs[index].showDialog = false"
                      >cancel</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
              <template #activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on">edit</v-btn>
              </template>
            </v-dialog>
            <v-dialog v-model="configs[index].showDeleteDialog" width="600px">
              <v-form @submit.prevent="deleteContainer(container.name)">
                <v-card color="blue-grey lighten-3">
                  <v-card-text
                    >Are you sure you want to delete {{ container.name }}? This
                    action cannot be undone.</v-card-text
                  >
                  <v-card-actions class="d-flex">
                    <v-btn
                      color="warning"
                      type="submit"
                      class="flex-grow-1"
                      @click="configs[index].showDeleteDialog = false"
                      >delete</v-btn
                    >
                    <v-btn
                      class="flex-grow-1"
                      @click="configs[index].showDeleteDialog = false"
                      >cancel</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
              <template #activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on">delete</v-btn>
              </template>
            </v-dialog>
          </div>
          <div>
            <v-slide-x-reverse-transition>
              <v-progress-circular
                v-if="operationsInProgress[container.name]"
                indeterminate
              ></v-progress-circular>
            </v-slide-x-reverse-transition>
            <v-btn
              fab
              small
              elevation="2"
              :disabled="container.status === 'Running'"
              @click="startContainer(container.name)"
              ><v-icon>mdi-play</v-icon></v-btn
            >
            <v-btn
              fab
              small
              elevation="2"
              :disabled="container.status === 'Stopped'"
              @click="stopContainer(container.name)"
              ><v-icon>mdi-stop</v-icon></v-btn
            >
            <v-btn
              fab
              small
              elevation="2"
              :disabled="container.status === 'Stopped'"
              @click="restartContainer(container.name)"
              ><v-icon>mdi-restart</v-icon></v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import graphql from '~/graphql'
export default {
  middlware: 'auth',
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
    const operationsInProgress = {}
    containers.forEach((container) => {
      operationsInProgress[container.name] = false
    })
    return {
      containers,
      operationsInProgress,
      configs: containers.map(({ description }) => {
        return {
          description,
          showDialog: false,
          showDeleteDialog: false,
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
          showDeleteDialog: false,
        }
      })
    },
    async restartContainer(containerName) {
      this.operationsInProgress[containerName] = true
      await this.$apollo.mutate({
        mutation: graphql.mutation.restartContainer,
        variables: {
          containerName,
        },
      })
      this.operationsInProgress[containerName] = false
    },
    async startContainer(containerName) {
      this.operationsInProgress[containerName] = true
      await this.$apollo.mutate({
        mutation: graphql.mutation.startContainer,
        variables: {
          containerName,
        },
      })
      this.operationsInProgress[containerName] = false
    },
    async stopContainer(containerName) {
      this.operationsInProgress[containerName] = true
      await this.$apollo.mutate({
        mutation: graphql.mutation.stopContainer,
        variables: {
          containerName,
        },
      })
      this.operationsInProgress[containerName] = false
    },
    async deleteContainer(containerName) {
      this.operationsInProgress[containerName] = true
      await this.$apollo.mutate({
        mutation: graphql.mutation.deleteContainer,
        variables: {
          containerName,
        },
      })
      this.operationsInProgress[containerName] = false
    },
  },
  apollo: {
    containers: {
      query: graphql.query.containers,
      pollInterval: 2500,
    },
  },
}
</script>
