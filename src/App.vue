<template>
  <main class="flex justify-center">
    <navbar :user="user"></navbar>
    <div class="pt-20 w-4/5 flex flex-col">
      <vote-counter />
      <player-vote :user="user" />
      <other-player-vote :user="user" />
    </div>
  </main>
</template>

<script>
import { useClient } from 'villus';
import useAuth from './compositions/useAuth';
import Navbar from './components/Navbar';
import VoteCounter from './components/VoteCounter';
import PlayerVote from './components/PlayerVote';
import OtherPlayerVote from './components/OtherPlayerVote';
import { SubscriptionClient } from 'subscriptions-transport-ws';

export default {
  components: {
    Navbar,
    PlayerVote,
    OtherPlayerVote,
    VoteCounter,
  },
  setup() {
    const subscriptionClient = new SubscriptionClient(process.env.VUE_APP_GRAPH_QL_URL_WS, { reconnect: true });

    useClient({
      url: process.env.VUE_APP_GRAPH_QL_URL,
      subscriptionForwarder: (op) => subscriptionClient.request(op),
      context: () => {
        const token = localStorage.getItem('token');
        return {
          fetchOptions: {
            headers: {
              ...(token ? { authorization: `Bearer ${token}` } : {}),
            },
          },
        };
      },
    });

    const { user } = useAuth();

    return {
      user,
    };
  },
};
</script>

<style scoped></style>
