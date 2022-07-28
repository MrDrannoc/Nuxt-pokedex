<template>
  <v-app>

  <!-- navbar -->
    <v-app-bar
      app
      color="primary"
    >
      <v-img
        contain
        :max-height="isMobile ? 30 : 60"
        :max-width="isMobile ? 30 : 60"
        src="/pokeball.png"
      ></v-img>
      <v-toolbar-title
        class="white--text text-xs-h6"
        v-text="title"
      />
      <v-spacer />

      <v-chip
        class="ma-2"
        color="secondary"
        text-color="white"
        @click="modalTeam = true"
      >
        <v-avatar left>
          <v-icon>mdi-pokemon-go</v-icon>
        </v-avatar>
        My team
        <v-avatar
          v-if="NbrPokemon !== 0"
          right
          class="black"
        >
          {{NbrPokemon}}
        </v-avatar>
      </v-chip>
    </v-app-bar>

    <!-- body -->
    <v-main :class="isMobile ? 'pt-13' : 'my-auto'">
      <v-container class="d-flex justify-center">
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Modal -->
    <v-dialog
      v-model="modalTeam"
      transition="dialog-top-transition"
      :fullscreen="isMobile"
      scrollable
      width="600"
    >
      <v-card
        height="600"
        class="d-flex"
        color="secondary"
      >
        <v-card-title class="text-h5 white--text justify-center">
          My team
        </v-card-title>

        <v-card-text style="background-color: white; ">
          <v-container class="pa-0">
            <vue-nestable
              class="pt-6"
              v-model="myTeam"
              :max-depth="1"
            >
              <template slot-scope="{ item, index }">
                <v-list-item class="px-0">
                  <v-list-item-icon>
                    <vue-nestable-handle :item="item">
                      <v-img
                        contain
                        :src=item.img
                      ></v-img>
                    </vue-nestable-handle>
                  </v-list-item-icon>
                  <v-list-item-title class="d-flex">
                    N° {{ index+ 1 }} - {{  item.name }}
                    <v-btn
                      color="secondary"
                      small
                      @click="delInMyTeam(item)"
                      class="pa-2 ml-auto"
                    >
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-list-item-title>
                </v-list-item>
              </template>
            </vue-nestable>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="modalTeam = false"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  data () {
    return {
      title: 'Application Pokedex',
      modalTeam: false,
    }
  },

  mounted () {
    this.$store.dispatch('global/checkTeam')
  },

  computed: {
    myTeam: {
      get: function () {
        return this.$store.state.global.team
      },
      set: function (newValue) {
        this.$store.dispatch('global/moveInTeam', newValue)
      },
    },
    NbrPokemon: function () {
      return this.myTeam.length
    },
    isMobile: function () {
      const isMobile = this.$vuetify.breakpoint.mobile
      return isMobile
    }
  },
  
  methods: {
    delInMyTeam: function (item) {
      this.$store.dispatch('global/delInTeam', { team: this.myTeam, pokemon: item })
    }
  }
}
</script>
