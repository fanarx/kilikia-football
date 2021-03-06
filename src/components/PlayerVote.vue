<template>
  <div>
    <span class="text-orange-600 text-lg font-semibold mb-2">Հիմնական</span>
    <ul v-if="votes && votes.votes">
      <li
        :class="
          `flex w-full h-12 cursor-pointer ${
            user && isActive(vote) ? 'border-b-2 border-gray-600' : 'border-b border-gray-300'
          }`
        "
        v-for="vote in votes.votes"
        :key="vote.id + vote.vote"
      >
        <span :class="`w-2/5 flex items-center capitalize ${user && isActive(vote) ? 'font-bold' : 'font-normal'}`">
          {{ vote.user.name }}
        </span>
        <span class="w-3/5">
          <vote-row @vote="onVoteUpdate" :vote="vote" />
        </span>
      </li>
      <li v-if="user && !hasUserVoted" class="flex w-full h-12 cursor-pointer border-b-2 border-gray-600">
        <span class="w-2/5 flex items-center capitalize font-bold">
          {{ user.email.split('@')[0] }}
        </span>
        <span class="w-3/5">
          <vote-row
            @vote="onVoteCreate"
            :vote="{ vote: createVoteInput, user: { name: user.email.split('@')[0], id: user.uid } }"
          />
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useSubscription, useMutation } from 'villus';
import VoteRow from './VoteRow';
import { INSERT_VOTES, UPDATE_VOTES_BY_PK } from '../graphql/mutations';
import { SUBSCRIBE_TO_VOTES, SUBSCRIBE_TO_USERS } from '../graphql/subscribtions';

export default {
  components: {
    VoteRow,
  },
  props: ['user'],
  setup(props) {
    const store = useStore();

    const { data } = useSubscription({
      query: SUBSCRIBE_TO_USERS,
    });

    const { data: votesSub } = useSubscription({
      query: SUBSCRIBE_TO_VOTES,
    });

    const { execute: executeInsertVotes, error: insertVotesError } = useMutation({
      query: INSERT_VOTES,
    });

    const { execute: executeUpdateVoteByPK, error: updateVoteError } = useMutation({
      query: UPDATE_VOTES_BY_PK,
    });

    const hasUserVoted = ref(false);
    const createVoteInput = ref('');

    let backupCreateVote = '';
    let backupVotesSub = [];
    let votedUserIds = [];

    watch(
      [() => props.user, votesSub, data, updateVoteError, insertVotesError],
      ([user, votesSub, data, updateVoteError, insertVotesError]) => {
        if (data) {
          store.commit('setUsers', data.users);
        }
        if (user && votesSub) {
          votedUserIds = votesSub.votes.map((vote) => vote.user.id);
          hasUserVoted.value = votedUserIds.includes(user.uid);

          if (hasUserVoted.value) {
            createVoteInput.value = '';
          }
        }
        if (updateVoteError) {
          votesSub.votes = backupVotesSub;
        }

        if (insertVotesError) {
          createVoteInput.value = backupCreateVote;
        }
      }
    );

    watchEffect(() => {
      if (votesSub.value) {
        store.commit(
          'setMainVotes',
          votesSub.value.votes.map((vote) => vote.vote)
        );
      }
    });

    function onVoteUpdate(vote) {
      if (!props.user) return;
      if (props.user.uid === vote.user.id) {
        const updateVoteInput = {
          id: vote.id,
          vote: vote.vote,
        };

        const updateVoteIndex = votesSub.value.votes.findIndex((vote) => vote.id === updateVoteInput.id);
        const updatedVotes = [
          ...votesSub.value.votes.slice(0, updateVoteIndex),
          { ...updateVoteInput, user: vote.user },
          ...votesSub.value.votes.slice(updateVoteIndex + 1),
        ];

        backupVotesSub = votesSub.value.votes;
        executeUpdateVoteByPK(updateVoteInput);
        votesSub.value.votes = updatedVotes;
      }
    }
    function onVoteCreate(vote) {
      if (!props.user) return;

      backupCreateVote = createVoteInput.value;
      executeInsertVotes({
        vote: vote.vote,
      });
      createVoteInput.value = vote.vote;
    }

    function isActive(vote) {
      return props.user.uid === vote.user.id;
    }

    return {
      data,
      votes: votesSub,
      onVoteUpdate,
      onVoteCreate,
      createVoteInput,
      hasUserVoted,
      isActive,
    };
  },
};
</script>

<style scoped></style>
