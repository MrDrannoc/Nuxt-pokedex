<template>
  <div>
    <v-card
      width="900"
      color="secondary"
      v-if="!isMobile"
    >

      <!-- for desktop -->
      <v-card-title>
        <div class="white--text">
          Pokemon list
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          background-color="white"
          color="accent"
          v-model="search"
          append-icon="mdi-magnify"
          label="Find a pokemon in this list"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="pokemonList"
        item-key="name"
        class="elevation-1"
        :search="search"
        :loading="isLoaded"
        :options.sync="pagination"
        @page-count="pagination.pageCount = $event"
        loading-text="Loading... gotta catch ’em all :)"
        :items-per-page="pagination.itemsPerPage"
        :server-items-length="pagination.count"
      >
        <template v-slot:item.img="{ item }">
          <div class="d-flex justify-center">
            <v-img
              contain
              height=100
              width=100
              :src=item.img
            ></v-img>

          </div>
        </template>
        <template v-slot:item.name="{ item }">
          <v-card-text class="d-flex justify-center text-md-body-1">
            {{item.name}}
          </v-card-text>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            class="ma-2"
            color="secondary"
            @click="viewPokemon(item.id)"
          >
            <v-icon
              large
              class="mr-2"
            >
              mdi-eye
            </v-icon>
            Look
          </v-btn>
          <v-btn
            class="ma-2"
            color="secondary"
            @click="addInMyTeam(item)"
          >
            <v-icon
              large
              class="mr-2"
            >
              mdi-plus-circle
            </v-icon>
            add in team
          </v-btn>
        </template>

      </v-data-table>
    </v-card>

    <!-- for mobile -->
    <v-data-iterator
      v-else
      :items="pokemonList"
      :items-per-page.sync="pagination.itemsPerPage"
      :server-items-length="pagination.count"
      :options.sync="pagination"
    >

      <template v-slot:header>
        <v-toolbar
          dark
          color="blue darken-3"
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-card
          v-for="item in props.items"
          :key="item.name"
          cols="12"
          class="my-3"
        >
          <v-img
            contain
            :src="item.img"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.3)"
            height="100px"
          >
            <v-card-title v-text="item.name"></v-card-title>
          </v-img>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              @click="viewPokemon(item.id)"
            >
              <v-icon>
                mdi-eye
              </v-icon>
            </v-btn>
            <v-btn
              color="secondary"
              @click="addInMyTeam(item)"
            >
              <v-icon>
                mdi-plus-circle
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-data-iterator>

    <v-overlay :value="isLoaded">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PokedexPage',

  data () {
    return {
      isLoaded: false,
      search: '',
      pokemonList: [],
      pagination: {
        pageCount: 0,
        itemsPerPage: 10,
        page: 1,
        count: 0
      }
    }
  },

  mounted () {
    if (this.pokemonList.length === 0) {
      this.catchThemAll()
    }
  },

  computed: {
    headers: function () {
      return [
        {
          value: 'img',
          text: 'Sprite',
          align: 'center',
          sortable: false
        },
        {
          value: 'name',
          text: 'Name of pokemon',
          align: 'center',
          sortable: false
        },
        {
          value: 'actions',
          text: 'Actions',
          align: 'center',
          sortable: false
        }
      ]
    },
    isMobile: function () {
      const isMobile = this.$vuetify.breakpoint.mobile
      return isMobile
    }
  },

  methods: {
    catchThemAll: function () {
      this.isLoaded = true

      const url = `https://pokeapi.co/api/v2/pokemon/?offset=${(this.pagination.itemsPerPage * this.pagination.page) - this.pagination.itemsPerPage}&limit=${this.pagination.itemsPerPage}`
      this.$axios.get(url)
        .then((res) => {
          const pokemons = res.data.results
          const promises = []
          for (let i = 0; i < pokemons.length; i++) {
            promises.push(this.$axios.get(pokemons[i].url))
          }
          const result = []
          axios.all(promises)
            .then(axios.spread((...args) => {
              for (let i = 0; i < args.length; i++) {
                pokemons[i].id = args[i].data.id
                pokemons[i].img = args[i].data.sprites.front_default
                result.push(pokemons[i])
              }
              this.pokemonList = result
              this.isLoaded = false
            }))
          this.pagination.count = res.data.count
          this.pagination.next = res.data.next
          this.pagination.previous = res.data.previous
        })
    },
    viewPokemon: function (id) {
      this.$router.push({ path: `/pokemons/${id}` })
    },
    addInMyTeam: function (item) {
      const pokemon = {}
      pokemon.id = item.id
      pokemon.name = item.name
      pokemon.img = item.img
      this.$store.dispatch('global/addInTeam', pokemon)
    },
    searchPokemon: function () {
      this.pokemonList = this.pokemonList.filter((el) => el.name.includes(this.search))
    }
  },

  watch: {
    'pagination.page': {
      handler () {
        this.catchThemAll()
      },
    },
    'pagination.itemsPerPage': {
      handler () {
        this.catchThemAll()
      }
    },
    search: function () {
      if (this.search.length >= 3) {
        this.searchPokemon()
      }
      if (this.search.length == 0) {
        this.catchThemAll()
      }
    }
  },
}
</script>
