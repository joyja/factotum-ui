<template>
  <v-row class="pb-5" justify="center">
    <v-card
      :class="'flex-grow-0 flex-shrink-1 ' + addClasses"
      :color="transparent ? 'transparent' : color"
      light
      flat="flat"
      :elevation="elevation"
      :style="basis ? `flex-basis:${basis}` : null"
    >
      <v-responsive :aspect-ratio="aspectRatio">
        <v-img
          :max-width="basis || null"
          :src="src"
          :lazy-src="lazySrc"
          :alt="alt"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="black"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-responsive>
    </v-card>
  </v-row>
</template>

<script>
export default {
  props: {
    src: {
      required: true,
      type: String,
    },
    lazySrc: {
      required: false,
      type: [String, null],
      default: null,
    },
    alt: {
      required: true,
      type: String,
    },
    flat: {
      required: false,
      type: Boolean,
      default: false,
    },
    transparent: {
      required: false,
      type: Boolean,
      default: false,
    },
    color: {
      required: false,
      type: String,
      default: 'white',
    },
    addClasses: {
      required: false,
      type: String,
      default: '',
    },
    aspectRatio: {
      required: false,
      type: [Number, String, null],
      default: null,
    },
    elevation: {
      required: false,
      type: [Number, String, null],
      default: 0,
    },
    basis: {
      required: false,
      type: [Number, String, null],
      default: 0,
    },
  },
}
</script>
