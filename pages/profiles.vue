<template>
  <div>
    <v-row>
      <v-col
        v-for="profile in profiles"
        :key="profile.name"
        cols="12"
        sm="12"
        md="12"
        lg="6"
        xl="6"
      >
        <v-card
          class="d-flex flex-column"
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
          <v-list
            v-if="profile.config.userUserData"
            color="blue-grey lighten-3"
            dense
          >
            <v-list-item>
              <v-list-item-content
                ><v-list-item-title
                  >User Data</v-list-item-title
                ></v-list-item-content
              >
              <v-list-item-action>
                <v-dialog width="1000px" scrollable>
                  <v-card>
                    <v-card-title>
                      {{ profile.name }} cloud-init user-data
                    </v-card-title>
                    <v-card-text style="white-space: pre">{{
                      profile.config.userUserData
                    }}</v-card-text>
                  </v-card>
                  <template #activator="{ on, attr }">
                    <v-btn
                      color="blue-grey"
                      elevation="0"
                      fab
                      small
                      dark
                      v-bind="attr"
                      v-on="on"
                      ><v-icon dark>mdi-eye</v-icon></v-btn
                    >
                  </template>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card-text v-if="profile.devices && profile.devices.length > 0">
            <v-card flat color="blue-grey lighten-4" dense>
              <v-card-title><div class="subtitle-2">Devices</div></v-card-title>
              <v-list>
                <v-list-item v-for="device in profile.devices" :key="device.id">
                  <v-list-item-avatar class="flex-grow-0 flex-shrinkt-0"
                    ><v-icon>{{
                      getDeviceIcon(device.type)
                    }}</v-icon></v-list-item-avatar
                  >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ device.id }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ device.type }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-card-text>
          <!-- <v-card-actions>
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
        </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mx-0">
      <v-dialog v-model="showCreateProfileDialog" width="1000px" scrollable>
        <v-form>
          <v-card>
            <v-card-title>Create Profile</v-card-title>
            <v-card-text
              ><v-textarea label="yaml" :rules="yamlRules"
            /></v-card-text>
            <v-card-actions class="d-flex"
              ><v-btn color="primary" class="flex-grow-1"
                ><v-icon left>mdi-plus</v-icon>create</v-btn
              ><v-btn
                color="primary"
                class="flex-grow-1"
                @click="showCreateProfileDialog = false"
                ><v-icon left>mdi-cancel</v-icon>cancel</v-btn
              ></v-card-actions
            >
          </v-card>
        </v-form>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" block v-on="on"
            ><v-icon left>mdi-plus</v-icon>Create Profile</v-btn
          >
        </template>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import yaml from 'js-yaml'
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
  data() {
    return {
      showCreateProfileDialog: false,
      yamlRules: [
        (v) => {
          return this.isYamlValid(v) || 'Must bein a valid yaml format.'
        },
      ],
    }
  },
  methods: {
    isYamlValid(text) {
      yaml.safeLoad(text)
      return true
    },
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
    getDeviceIcon(deviceType) {
      if (deviceType === 'nic') {
        return 'mdi-ethernet'
      } else if (deviceType === 'disk') {
        return 'mdi-harddisk'
      } else {
        return 'mdi-help-circle'
      }
    },
    getYaml(text) {
      return yaml.safeDump(yaml.safeLoad(text))
    },
  },
  apollo: {
    profiles: {
      query: graphql.query.profiles,
    },
  },
}
</script>
