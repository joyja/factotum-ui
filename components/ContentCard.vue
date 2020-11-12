<template>
  <v-card color="grey lighten-3">
    <v-card-title v-if="showTitle" class="text-oswald text-uppercase">{{
      doc.title
    }}</v-card-title>
    <v-card-subtitle v-if="showTitle" class="text-basic">{{
      doc.description
    }}</v-card-subtitle>
    <v-card-text class="text-basic">
      <nuxt-content :document="doc" />
    </v-card-text>
  </v-card>
</template>

<script>
import format from 'date-fns/format'

export default {
  props: {
    doc: {
      type: Object,
      required: true,
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    createdAt() {
      return this.doc.created
    },
    updatedAt() {
      return format(Date.parse(this.doc.updatedAt), 'MMMM d, yyyy')
    },
  },
}
</script>

<style scoped>
* >>> a {
  color: #e53935 !important;
}

* >>> a:hover {
  color: #b71c1c !important;
}
</style>
