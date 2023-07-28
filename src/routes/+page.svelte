<script lang="ts">
  import { browser } from '$app/environment';
  import { daysOfWeek, defaultPreferences } from '$lib/data';
  import { generateAllDates } from '$lib/utils';
  import moment from 'moment';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let preferences: typeof defaultPreferences;

  let selectingMonths = false;
  let selectingHolidays = false;

  let allDates = generateAllDates(2023);

  onMount(() => {
    const preferencesString = localStorage.getItem('preferences');
    preferences = preferencesString ? JSON.parse(preferencesString) : defaultPreferences;

    window.onclick = (event) => {
      const targetElement = event.target;

      let currentElement = targetElement;
      while (currentElement !== document.body) {
        //@ts-ignore
        if (currentElement.classList.contains('dropdown')) {
          return;
        }
        //@ts-ignore
        currentElement = currentElement.parentElement;
      }

      selectingMonths = false;
      selectingHolidays = false;
    };
  });

  $: if (browser && preferences) {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }
</script>

{#if preferences}
  <div
    class="mb-3 flex place-content-between place-items-center gap-2 border-b border-slate-200 px-4 py-3">
    <div class="flex place-items-center gap-3">
      <h1 class="text-2xl font-extrabold text-slate-700">Year Planner</h1>
      <div class="flex place-items-center gap-2">
        <button
          class="w-12 rounded-full p-3 text-slate-300 transition duration-200 hover:bg-slate-100"
          on:click={() => {
            preferences.year -= 1;
            allDates = generateAllDates(preferences.year);
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
            class="h-full w-full">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <p class="text-xl font-bold text-slate-600">{preferences.year}</p>
        <button
          class="w-12 rounded-full p-3 text-slate-300 transition duration-200 hover:bg-slate-100"
          on:click={() => {
            preferences.year += 1;
            allDates = generateAllDates(preferences.year);
          }}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
            class="h-full w-full">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex gap-5">
      <div class="flex flex-col gap-1">
        <p class="text-xs text-slate-500">Layout</p>
        <select
          class="relative h-full w-fit rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-600 transition duration-100 hover:bg-slate-300"
          bind:value={preferences.layout}>
          <option value="3">Grid</option>
          <option value="2">2-Column</option>
          <option value="1">Stack</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-xs text-slate-500">Months</p>
        <button
          class="dropdown relative rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 transition duration-100 hover:bg-slate-300"
          on:click={() => {
            selectingMonths = true;
            selectingHolidays = false;
          }}
          >Show/Hide Months

          {#if selectingMonths}
            <div
              class=" absolute right-0 top-full mt-4 flex w-56 flex-col gap-2 rounded-md border border-gray-300 bg-gray-100 px-1 py-2 text-left"
              transition:fade={{ duration: 100 }}>
              {#each preferences.months as month}
                <div class="form-control px-2">
                  <label class="label block w-full cursor-pointer">
                    <input type="checkbox" bind:checked={month.visible} class="checkbox" />
                    <span class="label-text">{month.month}</span>
                  </label>
                </div>
              {/each}
              <button
                class="  block w-full rounded-md bg-green-500 py-2 text-center font-bold text-green-100 transition duration-100 hover:bg-green-600"
                on:click={() => {
                  preferences.months = preferences.months.map((m) => {
                    m.visible = true;
                    return m;
                  });
                }}>Show All</button>
              <button
                class="  block w-full rounded-md border border-gray-300 bg-gray-200 py-2 text-center font-bold text-gray-600 transition duration-100 hover:bg-gray-300"
                on:click={() => {
                  preferences.months = preferences.months.map((m) => {
                    m.visible = false;
                    return m;
                  });
                }}>Hide All</button>
            </div>
          {/if}
        </button>
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-xs text-slate-500">Holidays</p>
        <button
          class="dropdown relative rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 transition duration-100 hover:bg-slate-300"
          on:click={() => {
            selectingHolidays = true;
            selectingMonths = false;
          }}
          >Show/Hide Holidays

          {#if selectingHolidays}
            <div
              class="absolute right-0 top-full mt-4 flex w-36 flex-col gap-2 rounded-md border border-gray-300 bg-gray-100 px-1 py-2 text-left">
              {#each preferences.holidays as holiday}
                <div class="form-control px-2">
                  <label class="label block w-full cursor-pointer">
                    <input type="checkbox" bind:checked={holiday.visible} class="checkbox" />
                    <span class="label-text">{holiday.description}</span>
                  </label>
                </div>
              {/each}
            </div>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <div
    class="grid {parseInt(preferences.layout) === 3
      ? 'grid-cols-3'
      : parseInt(preferences.layout) === 2
      ? 'grid-cols-2'
      : 'grid-cols-1'} gap-2 p-1 {parseInt(preferences.layout) < 3 ? 'px-10' : ''}">
    {#each preferences.months as month}
      {#if month.visible}
        <div>
          <h3 class="py-2 text-center text-lg font-bold text-zinc-700">{month.month}</h3>
          <div class="grid grid-cols-7">
            {#each daysOfWeek as day}
              <div class="px-2 py-4 text-center text-slate-400">{day}</div>
            {/each}
          </div>
          <div class="grid grid-cols-7">
            {#each allDates as date}
              {#if date.format('MMMM') === month.month}
                {#if date.date() === 1}
                  {#if date.format('ddd') === 'Tue'}
                    <div />
                  {:else if date.format('ddd') === 'Wed'}
                    <div />
                    <div />
                  {:else if date.format('ddd') === 'Thu'}
                    <div />
                    <div />
                    <div />
                  {:else if date.format('ddd') === 'Fri'}
                    <div />
                    <div />
                    <div />
                    <div />
                  {:else if date.format('ddd') === 'Sat'}
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                  {:else if date.format('ddd') === 'Sun'}
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                  {/if}
                {/if}

                <button
                  class="flex h-20 flex-col hover:bg-slate-200 {date.day() === 6 || date.day() === 0
                    ? 'bg-slate-100'
                    : 'bg-slate-50'}
                  {preferences.layout === '3'
                    ? 'h-28'
                    : preferences.layout === '2'
                    ? 'h-32'
                    : 'h-32'}">
                  <p class="p-1 text-xs text-zinc-400">{date.format('D')}</p>

                  {#if preferences.events}
                    {#each preferences.events as event}
                      {#if event.date.isSame(date, 'date')}
                        <p
                          class="rounded-md bg-green-500 px-[2px] py-[1px] text-left text-xs text-white">
                          {event.title}
                        </p>
                      {/if}
                    {/each}
                  {/if}

                  {#each preferences.holidays as holidayGroup}
                    {#if holidayGroup.visible}
                      {#each holidayGroup.dates as holiday}
                        {#if moment(holiday.date).isSame(date, 'date')}
                          <p
                            class="z-10 rounded-md bg-gray-400 px-[2px] py-[1px] text-left text-xs text-white">
                            {#if holidayGroup.group === 'US'}
                              🇺🇸
                            {:else if holidayGroup.group === 'PH'}
                              🇵🇭
                            {/if}
                            {holiday.holiday}
                          </p>
                        {/if}
                      {/each}
                    {/if}
                  {/each}
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  </div>
{/if}
