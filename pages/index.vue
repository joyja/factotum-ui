<template>
  <div>
    <v-row>
      <v-col
        v-for="(selection, i) in softwareConfiguration"
        :key="i"
        :offset-sm="5"
        :offset-md="[0, 4].includes(i) ? 5 : 0"
        :offset-xl="[0, 4].includes(i) ? 5 : 0"
        :offset="[0, 4].includes(i) ? 4 : 0"
        sm="2"
        md="2"
        xl="2"
        cols="4"
      >
        <v-card
          :class="selection.class"
          :color="selection.color"
          @click="
            showCreateDialog = true
            createDialog.application = 'tentacle'
          "
          ><v-img
            aspect-ratio="1"
            :lazy-src="`${selection.imageLazySrc}`"
            :src="`${selection.imageSrc}`"
          ></v-img>
          <v-overlay
            style="z-index: 3"
            class="align-start justify-end"
            color="transparent"
            absolute
          >
            <v-dialog max-width="800px" scrollable>
              <f-content-card :doc="docs[selection.name]" />
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on"
                  ><v-icon medium color="grey">mdi-information</v-icon></v-btn
                >
              </template>
            </v-dialog>
          </v-overlay>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="containersCreating.length > 0">
      <v-col
        v-for="container in containersCreating"
        :key="container.name"
        cols="12"
      >
        <div class="grey--text text-center">
          <div class="pb-3">Creating container {{ container.name }}</div>
          <v-progress-linear
            light
            color="orange"
            indeterminate
          ></v-progress-linear>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="showCreateDialog" max-width="500px">
      <v-form v-model="createDialog.valid" @submit.prevent="createContainer">
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-text-field
              id="containerName"
              v-model="createDialog.containerName"
              name="containerName"
              label="Container Name"
              :rules="createDialog.containerNameRules"
            ></v-text-field>
            <v-btn
              :loading="createDialog.loading"
              block
              type="submit"
              :disabled="!createDialog.valid"
              >Create {{ createDialog.application }}</v-btn
            >
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import ContentCard from '~/components/ContentCard'
import graphql from '~/graphql'
export default {
  components: {
    fContentCard: ContentCard,
  },
  async asyncData({ $content, params }) {
    const docs = {}
    const contentFiles = ['tentacle']
    for (const file of contentFiles) {
      docs[file] = await $content(`${file}`)
        .fetch()
        .catch((error) => {
          throw error
        })
    }
    return {
      docs,
    }
  },

  data() {
    return {
      showCreateDialog: false,
      createDialog: {
        valid: false,
        application: null,
        containerName: '',
        containerNameRules: [(v) => !!v || 'Container name is required.'],
        loading: false,
      },
      softwareConfiguration: [
        {
          name: 'tentacle',
          imageSrc: 'tentacle.png',
          imageLazySrc: 'tentacle_blur.png',
          selected: false,
          color: 'blue-grey darken-4',
          class: 'pa-2',
        },
        // {
        //   name: 'node-red',
        //   imageSrc: 'v1595057580/logos/Node-red-icon.png',
        //   selected: false,
        // },
        // {
        //   name: 'grafana',
        //   imageSrc: 'v1595058072/logos/1920px-Grafana_logo.svg.png',
        //   selected: false,
        //   class: 'pa-2',
        // },
        // {
        //   name: 'ignition-edge',
        //   imageSrc: 'v1595058521/logos/IgnitionEdgeLogo_2x.png',
        //   selected: false,
        //   color: 'blue-grey darken-2',
        //   class: 'pa-2',
        // },
        // {
        //   name: 'ignition',
        //   imageSrc: 'v1595112960/logos/ignitionLogo_2x.png',
        //   color: 'blue-grey darken-2',
        //   selected: false,
        //   class: 'pa-2',
        // },
        // {
        //   name: 'mosquitto',
        //   imageSrc: 'v1595122011/logos/mosquitto-text-side-28.png',
        //   selected: false,
        //   class: 'pl-2 pb-1 pt-1',
        // },
        // {
        //   name: 'postgresql',
        //   imageSrc: 'v1595115531/logos/postgresql.png',
        //   selected: false,
        //   class: 'pa-2',
        // },
        // {
        //   name: 'influxdb',
        //   imageSrc: 'v1595120189/logos/influxdata.png',
        //   selected: false,
        //   class: 'pa-2',
        // },
      ],
    }
  },
  computed: {
    containersCreating() {
      return this.containers.filter((container) => !container.cloudInitComplete)
    },
  },
  methods: {
    async createContainer() {
      this.createDialog.loading = true
      await this.$apollo.mutate({
        mutation: graphql.mutation.createContainer,
        variables: {
          containerName: this.createDialog.containerName,
          profile: this.createDialog.application,
        },
      })
      this.createDialog.loading = false
      this.showCreateDialog = false
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
