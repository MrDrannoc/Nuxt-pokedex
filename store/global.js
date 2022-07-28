export const actions = {
  addInTeam ({ commit }, data) {
    commit('CREATETEAM', data)
  },
  moveInTeam ({ commit }, data) {
    commit('UPDATETEAM', data)
  },
  delInTeam ({ commit }, data) {
    commit('DELETETEAM', data)
  },
  checkTeam ({ commit }) {
    let team = JSON.parse(localStorage.getItem("myTeam"))
    if (team === null) {
      team = []
    }
    commit('CHECKTEAM', team)
  }
}

export const mutations = {
  CREATETEAM (state, result) {
    state.team.push(result)
    localStorage.setItem("myTeam", JSON.stringify(state.team))
  },
  UPDATETEAM (state, result) {
    state.team = result
    localStorage.setItem("myTeam", JSON.stringify(state.team))
  },
  DELETETEAM (state, data) {
    const index = data.team.findIndex((el) => el.id === data.pokemon.id)
    data.team.splice(index, 1)
    state.team = data.team
    localStorage.setItem("myTeam", JSON.stringify(state.team))
  },
  CHECKTEAM (state, team) {
    state.team = team
  }
}

export const state = () => ({
  team: []
})

// export const getters = {
// }
