import { createStore } from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

/**
 * Vuex store for the color palette application.
 * This store manages the state, actions, mutations, and getters for the application.
 * @module store
 */
const store = createStore({
    actions,
    getters,
    mutations,
    state,
});

export default store;
