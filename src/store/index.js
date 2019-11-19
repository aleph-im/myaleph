import Vue from 'vue'
import Vuex from 'vuex'
import { LocalStorage, SessionStorage } from 'quasar'
import { posts, aggregates, encryption } from 'aleph-js'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      api_server: 'https://api2.aleph.im',
      site_chain: 'NULS',
      site_address: 'TTatYAULiEfV6e7Tqt9z8YCr7dz2KkbJ',
      network_id: 1,
      ipfs_gateway: 'https://ipfs.io/ipfs/',
      account: null,
      profiles: {},
      last_broadcast: null,
      categories: [ // categories are hard-coded for now...
      ],
      pages: {},
      menu: [],
      notes: [],
      channel: "MYALEPH"
    },
    mutations: {
      set_account(state, account) {
        state.account = account
      },
      set_pages(state, pages) { // TODO: handle per-page mutation
        state.pages = pages
      },
      set_notes(state, notes) { // TODO: handle per-page mutation
        state.notes = notes
      },
      update_note(state, new_note) {
        for (let note of state.notes) {
          if (note.hash === new_note.hash) {
            Object.assign(note, new_note)
          }
        }
      },
      add_note(state, new_note) {
        state.notes.unshift(new_note)
      },
      set_menu(state, menu_items) { // TODO: handle per-page mutation
        state.menu = menu_items
      },
      store_profile(state, payload) {
        state.profiles[payload.address] = payload.profile
      },
      set_network(state, payload) {
        state.network_id = payload.network_id
        state.api_server = payload.api_server
        state.profiles = {}
        state.pages = {}
        state.address_alias = {}
        state.alias_address = {}
        state.last_broadcast = null
      },

    },
    actions: {
      async store_account({ state, commit }, account) {
        try {
          LocalStorage.set('account', account)
        } catch (e) {
          console.warn("Can't store account")
        }
        await commit('set_account', account)
      },
      async logout({ state, commit }) {
        try {
          LocalStorage.set('account', null)
        } catch (e) {
          console.warn("Can't store account")
        }
        await commit('set_account', null)
      },
      async update_notes({ state, commit }) {
        let result = await posts.get_posts('note', {
          pagination: 1000,
          addresses: [state.account.address],
          api_server: state.api_server
        })
        let post_list = []
        for (let post of result.posts) {
          try {
            if (post.content.private) {
              post.content.encrypted_title = post.content.title
              post.content.title = encryption.decrypt(state.account, post.content.title)
              post.content.encrypted_body = post.content.body
              post.content.body = encryption.decrypt(state.account, post.content.body)
            }
          } catch (e) {
            console.error("Can't decrypt...", e)
          }
          post_list.push(post)
        }
        commit('set_notes', post_list)
      }
      // async update_pages({ state, commit }) {
      //   let pages = await fetch_one(
      //     state.site_address, 'pages', {
      //     'api_server': state.api_server
      //   })
      //   if (pages === null)
      //     pages = {}
  
      //   await commit('set_pages', pages)
      // },
      // async update_menu({ state, commit }) {
      //   let menu_obj = await fetch_one(
      //     state.site_address, 'menu', {
      //     'api_server': state.api_server
      //   })
      //   let items = []
      //   if ((menu_obj !== null) && menu_obj.items)
      //     items = menu_obj.items
  
      //   await commit('set_menu', items)
      // }
    },

    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
