<template>
  <div class="flex flex-col mt-10">
    <!-- <div>
      <pre>{{ JSON.stringify(user, null, 2) }}</pre>
    </div> -->

    <div v-click-outside="closeAddPlayerBox" class="flex mb-2">
      <div class="flex cursor-pointer items-center" @click="(e) => e.stopPropagation() || toggleAddPlayerBox()">
        <div class="text-orange-600 text-lg font-semibold">Կողքից</div>

        <icon-base class="w-6 h-6 ml-2" icon-name="add player">
          <icon-minus-active v-if="isAddPlayerBoxOpen" />
          <icon-plus-active v-else />
        </icon-base>
      </div>
      <div>&nbsp;</div>
    </div>

    <div
      @click="(e) => e.stopPropagation()"
      v-if="isAddPlayerBoxOpen"
      class="flex w-full absolute mt-8 p-2 bg-white border border-gray-400 z-40 bg-gray-200"
    >
      <span class="w-2/5">
        <input
          @click="() => (addPlayer.vote = null)"
          :disabled="isLoading"
          class="w-4/5 border py-2 px-3 text-grey-darkest w-32"
          type="text"
          v-model="addPlayer.name"
          placeholder="Անուն"
        />
      </span>
      <span class="flex w-3/5 relative">
        <vote-row @vote="handleAddOtherPlayer" :vote="{ vote: addPlayer.vote }" />
        <div
          v-if="isLoading"
          class="flex items-center justify-center bg-white w-full h-full
            absolute"
        >
          <icon-base class="w-6 h-6" icon-name="loading">
            <icon-spinner-blue />
          </icon-base>
        </div>
      </span>
    </div>

    <div v-if="otherPlayers" class="flex flex-1 flex-col overflow-auto overflow-x-hidden border-b-0">
      <div
        v-for="otherPlayer in otherPlayers.otherPlayers"
        :key="otherPlayer.id"
        class="flex w-full h-12 border-b border-gray-300"
      >
        <span class="w-2/5 flex items-center font-normal capitalize">
          {{ otherPlayer.name }}
        </span>
        <span class="w-3/5 flex relative">
          <vote-row :vote="{ vote: otherPlayer.vote }" @vote="(vote) => handleVoteUpdate(otherPlayer, vote)" />
          <span class="ml-auto font-thin text-gray-600 text-sm self-end capitalize">
            {{ otherPlayer.invitedBy.name }}
          </span>
          <span class="absolute top-0 right-0 mt-1">
            <icon-base
              v-if="user && otherPlayer.invitedBy.name === user.email.split('@')[0]"
              @click="() => handleOtherPlayerDelete(otherPlayer)"
              class="w-6 h-6 cursor-pointer"
              icon-name="delete"
            >
              <icon-close-red />
            </icon-base>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useSubscription, useMutation } from 'villus';
import { UPDATE_OTHER_PLAYERS_BY_PK, DELETE_OTHER_PLAYERS_BY_PK, INSERT_OTHER_PLAYERS_ONE } from '../graphql/mutations';
import { SUBSCRIBE_TO_OTHER_PLAYERS } from '../graphql/subscribtions';
import { ClickOutside } from '../directives/clickOutside';
import IconBase from '../components/IconBase';
import VoteRow from '../components/VoteRow';

import IconMinusActive from './icons/IconMinusActive';
import IconPlusActive from './icons/IconPlusActive';
import IconCloseRed from './icons/IconCloseRed';
import IconSpinnerBlue from './icons/IconSpinnerBlue';

export default {
  props: ['user'],
  components: {
    VoteRow,
    IconBase,
    IconMinusActive,
    IconPlusActive,
    IconCloseRed,
    IconSpinnerBlue,
  },
  directives: {
    ClickOutside,
  },
  setup(props, { emit }) {
    const store = useStore();

    const { data: otherPlayersSub } = useSubscription({
      query: SUBSCRIBE_TO_OTHER_PLAYERS,
    });

    const { execute: executeOtherPlayerUpdate, error: updateOtherPlayerError } = useMutation({
      query: UPDATE_OTHER_PLAYERS_BY_PK,
    });

    const { execute: executeOtherPlayerDelete, error: deleteOtherPlayerError } = useMutation({
      query: DELETE_OTHER_PLAYERS_BY_PK,
    });

    const {
      data: insertOtherPlayerData,
      execute: executeInsertOtherPlayer,
      error: insertOtherPlayerError,
    } = useMutation({
      query: INSERT_OTHER_PLAYERS_ONE,
    });

    const isAddPlayerBoxOpen = ref(false);
    const isLoading = ref(false);
    let addPlayer = reactive({
      name: null,
      vote: null,
    });

    let backupOtherPlayersSub = [];

    function toggleAddPlayerBox() {
      isAddPlayerBoxOpen.value = !isAddPlayerBoxOpen.value;
      if (!isAddPlayerBoxOpen.value) {
        addPlayer.name = null;
        addPlayer.vote = null;
      }
    }

    function closeAddPlayerBox() {
      isAddPlayerBoxOpen.value = false;
      addPlayer.name = null;
      addPlayer.vote = null;
    }

    watchEffect(() => {
      if (updateOtherPlayerError.value || deleteOtherPlayerError.value) {
        otherPlayersSub.value.otherPlayers = backupOtherPlayersSub;
      }

      if (insertOtherPlayerData.value) {
        addPlayer.name = null;
        addPlayer.vote = null;
        isLoading.value = false;
        isAddPlayerBoxOpen.value = false;
      }

      if (insertOtherPlayerError.value) {
        isLoading.value = false;
      }

      if (otherPlayersSub.value) {
        store.commit(
          'setOtherPlayerVotes',
          otherPlayersSub.value.otherPlayers.map((otherPlayer) => otherPlayer.vote)
        );
      }
    });

    function handleVoteUpdate(otherPlayer, { vote }) {
      if (!props.user) return;
      if (otherPlayer.invitedBy.name !== props.user.email.split('@')[0]) return;

      const updateOtherPlayerInput = {
        ...otherPlayer,
        vote,
      };

      const otherPlayerIndex = otherPlayersSub.value.otherPlayers.findIndex(
        (otherPlayer) => otherPlayer.id === updateOtherPlayerInput.id
      );

      const updatedOtherPlayers = [
        ...otherPlayersSub.value.otherPlayers.slice(0, otherPlayerIndex),
        updateOtherPlayerInput,
        ...otherPlayersSub.value.otherPlayers.slice(otherPlayerIndex + 1),
      ];

      backupOtherPlayersSub = otherPlayersSub.value.otherPlayers;

      executeOtherPlayerUpdate({
        id: updateOtherPlayerInput.id,
        vote: updateOtherPlayerInput.vote,
      });

      otherPlayersSub.value.otherPlayers = updatedOtherPlayers;
    }

    function handleOtherPlayerDelete(otherPlayer) {
      backupOtherPlayersSub = [...otherPlayersSub.value.otherPlayers];

      const deleteOtherPlayerInput = {
        id: otherPlayer.id,
      };

      const updatedOtherPlayers = otherPlayersSub.value.otherPlayers.filter((player) => player.id !== otherPlayer.id);
      otherPlayersSub.value.otherPlayers = updatedOtherPlayers;

      executeOtherPlayerDelete(deleteOtherPlayerInput);
    }

    function isAddPlayerInvalid(addPlayer) {
      return addPlayer.name == null || addPlayer.name.trim() === '' || addPlayer.vote == null;
    }

    function handleAddOtherPlayer({ vote }) {
      addPlayer.vote = vote;
      if (isAddPlayerInvalid(addPlayer)) return;

      isLoading.value = true;
      executeInsertOtherPlayer(addPlayer);
    }

    return {
      emit,
      addPlayer,
      isLoading,
      isAddPlayerBoxOpen,
      closeAddPlayerBox,
      toggleAddPlayerBox,
      handleVoteUpdate,
      handleOtherPlayerDelete,
      handleAddOtherPlayer,
      otherPlayers: otherPlayersSub,
    };
  },
};
</script>
