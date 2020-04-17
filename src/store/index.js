import { createStore } from 'vuex';

const state = {
  users: [],
  count: 0,
};

const mutations = {
  increment(state) {
    state.count++;
  },
  decrement(state) {
    state.count--;
  },
  setUsers(state, users) {
    state.users = users;
  },
  makeUserConfirmed(state, { userId, userName }) {
    console.log('***: makeUserConfirmed -> { userId, userName }', { userId, userName });
    const confirmedUserIndex = state.users.findIndex((user) => user.name === userName);

    state.users[confirmedUserIndex].is_confirmed = true;
    state.users[confirmedUserIndex].id = userId;
  },
};

export default createStore({
  state,
  mutations,
});
