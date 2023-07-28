<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<button
  class="w-12 rounded-full p-3 text-slate-300 transition duration-200 hover:bg-slate-100"
  on:click={() => {
    dispatch('click');
  }}><slot /></button>
