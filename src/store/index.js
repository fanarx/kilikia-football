import { createStore } from 'vuex';

const state = {
  users: [],
  mainVotes: [],
  otherPlayerVotes: [],
};

const getters = {
  allVotes: (state) => {
    return [...state.mainVotes, ...state.otherPlayerVotes];
  },
};

const mutations = {
  setUsers(state, users) {
    state.users = users;
  },
  makeUserConfirmed(state, { userId, userName }) {
    const confirmedUserIndex = state.users.findIndex((user) => user.name === userName);

    state.users[confirmedUserIndex].is_confirmed = true;
    state.users[confirmedUserIndex].id = userId;
  },

  setMainVotes(state, votes) {
    state.mainVotes = votes;
  },
  setOtherPlayerVotes(state, votes) {
    state.otherPlayerVotes = votes;
  },
};

export default createStore({
  state,
  mutations,
  getters,
});
