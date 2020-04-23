<template>
  <div v-if="votes && votes.length > 0" class="flex w-full h-12 cursor-pointer">
    <span class="w-2/5 flex items-center">&nbsp;</span>
    <span class="w-3/5">
      <div class="flex w-full items-center h-12">
        <span class="w-8 h-8 mr-4 sm:mr-6 text-center text-lg font-bold text-green-600">
          {{ yesNumber }}
        </span>
        <span class="w-8 h-8 mr-4 sm:mr-6 text-center text-lg font-bold text-red-600">
          {{ noNumber }}
        </span>
        <span class="w-8 h-8 text-center text-lg font-bold text-blue-600">
          {{ maybeNumber }}
        </span>
      </div>
    </span>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  setup() {
    const store = useStore();
    const votes = computed(() => store.getters.allVotes);
    const yesNumber = computed(() => votes.value.filter((vote) => vote === 'YES').length);
    const noNumber = computed(() => votes.value.filter((vote) => vote === 'NO').length);
    const maybeNumber = computed(() => votes.value.filter((vote) => vote === 'MAYBE').length);

    return {
      votes,
      yesNumber,
      noNumber,
      maybeNumber,
    };
  },
};
</script>
