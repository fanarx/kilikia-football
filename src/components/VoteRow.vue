<template>
  <div class="flex w-full items-center h-12">
    <icon-base
      @click="emit('vote', { ...vote, vote: 'YES' })"
      class="w-8 h-8 mr-2 sm:mr-6 cursor-pointer"
      icon-name="yes"
    >
      <icon-yes-active v-if="vote.vote === 'YES'" />
      <icon-yes-passive v-else />
    </icon-base>
    <icon-base
      @click="emit('vote', { ...vote, vote: 'NO' })"
      class="w-8 h-8 mr-2 sm:mr-6 cursor-pointer"
      icon-name="no"
    >
      <icon-no-active v-if="vote.vote === 'NO'" />
      <icon-no-passive v-else />
    </icon-base>
    <icon-base @click="emit('vote', { ...vote, vote: 'MAYBE' })" class="w-8 h-8 cursor-pointer" icon-name="maybe">
      <icon-maybe-active v-if="vote.vote === 'MAYBE'" />
      <icon-maybe-passive v-else />
    </icon-base>
  </div>
</template>

<script>
import IconBase from '../components/IconBase';

import IconYesActive from './icons/IconYesActive';
import IconYesPassive from './icons/IconYesPassive';
import IconNoActive from './icons/IconNoActive';
import IconNoPassive from './icons/IconNoPassive';
import IconMaybeActive from './icons/IconMaybeActive';
import IconMaybePassive from './icons/IconMaybePassive';

export default {
  props: ['vote'],
  components: {
    IconBase,
    IconYesActive,
    IconYesPassive,
    IconNoActive,
    IconNoPassive,
    IconMaybeActive,
    IconMaybePassive,
  },
  setup(props, { emit }) {
    return {
      emit,
    };
  },
};
</script>
