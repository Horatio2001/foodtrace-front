import { login, logout, getInfoByToken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { id } from 'html-webpack-plugin/lib/chunksorter'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    identity: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_IDENTITY:(state, identity) => {
    state.identity = identity
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // console.log(userInfo)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response
        // console.log(data.data)
        commit('SET_TOKEN', data.data)
        setToken(data.data)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // console.log(state)
    return new Promise((resolve, reject) => {
      getInfoByToken( state.token ).then(response => {
        const data = response.data
        // console.log(response)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const name = data.id
        const avatar = data.avatarUrl
        const identity = data.identity
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_IDENTITY', identity)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        // commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      // commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

