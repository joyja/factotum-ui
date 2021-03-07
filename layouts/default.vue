<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      dark
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar style="z-index: 10" :clipped-left="clipped" fixed app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <div class="ma-1 d-flex align-center">
        <jar-logo :height="50" />
        <div style="height: 50px" class="d-flex flex-column justify-end pb-1">
          <jar-logo-text />
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-menu v-if="user" offset-y>
        <template #activator="{ on }">
          <v-btn slot="activator" text v-on="on">
            <v-icon left>mdi-account</v-icon>
            {{ user.username }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app dark>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-snackbar v-model="showErrorSnack" top color="error">
      {{ error }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import jarLogo from '~/components/Logo'
import jarLogoText from '~/components/LogoText'
export default {
  components: {
    jarLogo,
    jarLogoText,
  },
  data() {
    return {
      showErrorSnack: false,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Applications',
          to: '/',
        },
        {
          icon: 'mdi-apps-box',
          title: 'Containers',
          to: '/containers',
        },
        {
          icon: 'mdi-file-document',
          title: 'Profiles',
          to: '/profiles',
        },
        {
          icon: 'mdi-engine',
          title: 'Operations',
          // to: '/inspire',
        },
        {
          icon: 'mdi-network',
          title: 'Networking',
          to: '/network',
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Users',
          to: '/users',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Squid',
    }
  },
  computed: {
    ...mapState(['showError', 'error', 'user']),
  },
  watch: {
    showError(value) {
      if (value) {
        this.showErrorSnack = true
      }
    },
    showErrorSnack(value) {
      if (!value) {
        this.setState({ key: 'showError', value: false })
      }
    },
  },
  methods: {
    logout() {
      this.$apolloHelpers.onLogout()
      this.setState({ key: 'user', value: null })
      this.$router.push({ name: 'login' })
    },
    ...mapMutations(['setState']),
  },
}
</script>
