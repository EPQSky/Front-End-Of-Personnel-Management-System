import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        routes: [],
        currentHr: JSON.parse(window.sessionStorage.getItem('user'))
    },
    mutations: {
        initRoutes(state, data) {
            state.routes = data;
        },
        initCurrentHr(state, hr) {
            state.currentHr = hr;
        }
    },
    actions: {}
})