<template>
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
        @click="selection.selected = !selection.selected"
        ><v-img
          aspect-ratio="1"
          :lazy-src="`https://res.cloudinary.com/jarautomation/image/upload/c_pad,h_200,w_200/e_blur:1000,q_1,f_auto/${selection.imageSrc}`"
          :src="`https://res.cloudinary.com/jarautomation/image/upload/c_pad,h_200,w_200,f_auto/${selection.imageSrc}`"
        ></v-img>
        <v-overlay
          style="z-index: 3"
          class="align-start"
          color="red"
          :absolute="true"
          :value="selection.selected"
        >
          <v-icon x-large>mdi-check</v-icon>
        </v-overlay>
        <v-overlay
          style="z-index: 3"
          class="align-start justify-end"
          color="transparent"
          absolute
        >
          <v-dialog max-width="800px" scrollable>
            <f-content-card :doc="docs[selection.name]" />
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"
                ><v-icon medium color="grey">mdi-information</v-icon></v-btn
              >
            </template>
          </v-dialog>
        </v-overlay>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ContentCard from '~/components/ContentCard'
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
      softwareConfiguration: [
        {
          name: 'tentacle',
          imageSrc: 'v1595057073/logos/tentacle.png',
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
}
</script>
