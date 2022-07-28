
<template>
  <div>

    <v-card
      v-if="!isLoaded"
      class="mx-auto my-auto"
    >

      <v-carousel
        height="300"
        cycle
        interval=3000
      >
        <v-carousel-item
          v-for="(item,i) in imgCarousel"
          :key="i"
          reverse-transition="fade-transition"
          transition="fade-transition"
        >
          <v-sheet
            :color="pokemonColor"
            height="100%"
            tile
          >
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-img
                :src="item.src"
                contain
                max-height="300"
                max-width="300"
              >
              </v-img>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>

      <v-card-title>
        <div class="text-h4 text-center font-weight-black">
          {{ pokemon.name }}
        </div>
      </v-card-title>

      <v-card-text>
        <v-row
          align="center"
          class="mx-0"
        >
          <div>Description:</div>
          <div>{{ description }}</div>
        </v-row>

        <v-row
          align="center"
          class="mx-0"
        >
          <v-col cols="4">
            <v-text-field
              :color="pokemonColor"
              label="Number"
              readonly
              v-model="pokemon.id"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :color="pokemonColor"
              label="Experience"
              readonly
              v-model="pokemon.base_experience"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :color="pokemonColor"
              label="Capture rate"
              readonly
              v-model="species.capture_rate"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row
          align="center"
          class="mx-0"
        >
          <v-col cols="6">
            <v-text-field
              :color="pokemonColor"
              label="Height"
              readonly
              v-model="pokemon.height"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :color="pokemonColor"
              label="Weight"
              readonly
              v-model="pokemon.weight"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-checkbox
              :color="pokemonColor"
              v-model="pokemon.is_baby"
              readonly
              label="baby"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-checkbox
              :color="pokemonColor"
              v-model="pokemon.is_legendary"
              readonly
              label="legendary"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-checkbox
              :color="pokemonColor"
              v-model="pokemon.is_mythical"
              readonly
              label="mythical"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="secondary"
          @click="returnHome"
        >
          Return in pokedex
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :color="ifWhite"
          text
          outlined
          @click="addInMyTeam"
        >
          Add in my team
        </v-btn>
      </v-card-actions>

    </v-card>

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
  name: 'PokemonPage',
  data: () => ({
    isLoaded: false,
    pokemon: {},
    species: {},
    pokemonColor: 'black'
  }),

  created () {
    const id = Number(this.$route.params.id)
    this.catchOnePokemon(id)
  },

  computed: {
    description: function () {
      return this.species.flavor_text_entries[0].flavor_text
    },
    imgCarousel: function () {
      const data = this.pokemon.sprites
      const result = []
      for (const property in data) {
        if (typeof data[property] != 'object') {
          let obj = {}
          obj.name = property
          obj.src = data[property]
          result.push(obj)
        }
      }
      result.unshift({ name: 'default', src: this.pokemon.img });
      return result
    },
    ifWhite: function () {
      if (this.pokemonColor === "white") {
        return this.pokemonColor === "black"
      } else {
        return this.pokemonColor
      }
    },
    fullscreen: function () {
      const isFullscreen = this.$vuetify.breakpoint.mobile
      return isFullscreen
    }
  },

  methods: {
    catchOnePokemon: function (id) {
      this.isLoaded = true
      const promises = [`https://pokeapi.co/api/v2/pokemon/${id}`, `https://pokeapi.co/api/v2/pokemon-species/${id}/`]
      axios.all(promises.map((promise) => axios.get(promise))).then(
        axios.spread(({ data: pokemon }, { data: species }) => {
          pokemon.img = pokemon.sprites.front_default

          this.pokemon = pokemon
          this.species = species
          this.pokemonColor = species.color.name
          this.isLoaded = false
        })
      )
    },
    returnHome: function () {
      this.$router.push({ path: `/` })
    },
    addInMyTeam: function () {
      const pokemon = {}
      pokemon.id = this.pokemon.id
      pokemon.name = this.pokemon.name
      pokemon.img = this.pokemon.img
      this.$store.dispatch('global/addInTeam', pokemon)
    },
  }
}
</script>
