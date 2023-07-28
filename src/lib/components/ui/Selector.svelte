<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let label = '';
  export let show = false;
  export let list: any[];
</script>

<button
  class="dropdown relative rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 transition duration-100 hover:bg-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
  on:click={() => {
    dispatch('activate');
  }}
  >{label}

  {#if show}
    <div
      class=" absolute right-0 top-full z-20 mt-4 flex w-56 flex-col gap-2 rounded-md border border-gray-300 bg-gray-100 px-1 py-2 text-left dark:border-gray-700 dark:bg-gray-900"
      transition:fade={{ duration: 100 }}>
      {#each list as item}
        <div class="form-control px-2">
          <label class="label block w-full cursor-pointer">
            <input type="checkbox" bind:checked={item.visible} class="checkbox" />
            <span class="label-text">{item.description}</span>
          </label>
        </div>
      {/each}
      <button
        class="block w-full rounded-md bg-green-500 py-2 text-center font-bold text-green-100 transition duration-100 hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-800"
        on:click={() => {
          list = list.map((m) => {
            m.visible = true;
            return m;
          });
        }}>Show All</button>
      <button
        class="block w-full rounded-md border border-gray-300 bg-gray-200 py-2 text-center font-bold text-gray-600 transition duration-100 hover:bg-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        on:click={() => {
          list = list.map((m) => {
            m.visible = false;
            return m;
          });
        }}>Hide All</button>
    </div>
  {/if}
</button>
