<script lang="ts">
  import { browser } from '$app/environment';
  import IconChevronLeft from '$lib/components/icons/IconChevronLeft.svelte';
  import IconChevronRight from '$lib/components/icons/IconChevronRight.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import Selector from '$lib/components/ui/Selector.svelte';
  import { daysOfWeek, defaultPreferences } from '$lib/data';
  import { generateAllDates } from '$lib/utils';
  import moment from 'moment';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import cuid from 'cuid';
  import IconMoon from '$lib/components/icons/IconMoon.svelte';
  import IconSun from '$lib/components/icons/IconSun.svelte';

  let preferences: typeof defaultPreferences;

  let selectingMonths = false;
  let selectingHolidays = false;

  let allDates = generateAllDates(2023);

  let eventMonth: string;
  let eventDay: number;
  let eventYear: number;
  let eventDescription = '';
  let eventColor: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray' = 'red';

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

      preferences.events = preferences.events.map((e) => {
        e.editing = false;
        return e;
      });
    };
  });

  $: if (browser && preferences) {
    localStorage.setItem('preferences', JSON.stringify(preferences));

    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function addEvent() {
    if (eventDescription.trim() === '') return;

    preferences.events = [
      ...preferences.events,
      {
        id: cuid(),
        date: moment().year(eventYear).month(eventMonth).date(eventDay),
        title: eventDescription,
        type: 'EVENT',
        editing: false,
        color: eventColor
      }
    ];

    const dialog = document.getElementById('addEventDialog');

    if (dialog) {
      //@ts-ignore
      dialog.close();
    }
  }

  function construcColors(color: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray') {
    switch (color) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'yellow':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'gray':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  }
</script>

{#if preferences}
  <div
    class="mb-3 flex place-content-between place-items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-black">
    <div class="flex place-items-center gap-3">
      <h1 class="text-2xl font-extrabold text-slate-700 dark:text-slate-300">Year Planner</h1>
      <div class="flex place-items-center gap-2">
        <IconButton
          on:click={() => {
            preferences.year -= 1;
            allDates = generateAllDates(preferences.year);
          }}><IconChevronLeft /></IconButton>
        <p class="text-xl font-bold text-slate-600 dark:text-slate-400">{preferences.year}</p>
        <IconButton
          on:click={() => {
            preferences.year += 1;
            allDates = generateAllDates(preferences.year);
          }}><IconChevronRight /></IconButton>
      </div>
    </div>

    <div class="flex place-items-center gap-5">
      <!-- <button
        class="rounded-md bg-red-500 px-4 py-2 text-white"
        on:click={() => {
          localStorage.removeItem('preferences');
          console.log('Preferences cleared');
        }}>Clear localStorage</button> -->

      <div class="flex flex-col gap-1">
        <p class="text-xs text-slate-500">Layout</p>
        <select
          class="relative h-full w-fit rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-600 transition duration-100 hover:bg-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          bind:value={preferences.layout}>
          <option value="3">Grid</option>
          <option value="2">2-Column</option>
          <option value="1">Stack</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-xs text-slate-500">Months</p>
        <Selector
          label="Show/Hide Months"
          bind:list={preferences.months}
          on:activate={() => {
            selectingMonths = true;
            selectingHolidays = false;
          }}
          show={selectingMonths} />
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-xs text-slate-500">Holidays</p>
        <Selector
          label="Show/Hide Holidays"
          bind:list={preferences.holidays}
          on:activate={() => {
            selectingMonths = false;
            selectingHolidays = true;
          }}
          show={selectingHolidays} />
      </div>

      {#if preferences.darkMode}
        <IconButton
          on:click={() => {
            preferences.darkMode = false;
          }}>
          <IconSun />
        </IconButton>
      {:else}
        <IconButton
          on:click={() => {
            preferences.darkMode = true;
          }}>
          <IconMoon />
        </IconButton>
      {/if}
    </div>
  </div>

  <div
    class="grid bg-white dark:bg-black {parseInt(preferences.layout) === 3
      ? 'grid-cols-3'
      : parseInt(preferences.layout) === 2
      ? 'grid-cols-2'
      : 'grid-cols-1'} gap-2 p-1 {parseInt(preferences.layout) < 3 ? 'px-10' : ''}">
    {#each preferences.months.filter((m) => m.visible) as month}
      <div>
        <h3 class="py-2 text-center text-lg font-bold text-zinc-700 dark:text-zinc-500">
          {month.description}
        </h3>

        <div class="grid grid-cols-7">
          {#each daysOfWeek as day}
            <div class="px-2 py-4 text-center text-xs text-slate-400 dark:text-zinc-500">{day}</div>
          {/each}
        </div>

        <div class="grid grid-cols-7">
          {#each allDates.filter((d) => d.format('MMMM') === month.description) as date}
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
              class="bg-whtie flex h-20 flex-col transition duration-100 hover:bg-slate-200 dark:hover:bg-zinc-800 {date.day() ===
                6 || date.day() === 0
                ? 'bg-slate-100 dark:bg-zinc-950'
                : 'bg-slate-50 dark:bg-zinc-900'}
                  {preferences.layout === '3'
                ? 'h-28'
                : preferences.layout === '2'
                ? 'h-32'
                : 'h-32'}
                {date.isSame(moment(), 'date') ? 'border border-red-500' : ''}"
              on:click={() => {
                const dialog = document.getElementById('addEventDialog');

                eventMonth = date.month().toString();
                eventDay = date.date();
                eventYear = date.year();
                eventDescription = '';

                if (dialog) {
                  //@ts-ignore
                  dialog.showModal();
                }
              }}>
              <p class="rounded-full py-1 text-xs text-zinc-400">{date.format('D')}</p>

              {#each preferences.events.filter((e) => moment(e.date).isSame(date, 'date')) as event}
                <button
                  class="relative z-10 w-full rounded-md px-[2px] py-[1px] text-left text-xs text-white transition duration-100 {construcColors(
                    event.color
                  )}"
                  on:click|stopPropagation={() => {
                    event.editing = true;
                  }}>
                  {event.title}

                  {#if event.editing}
                    <div
                      class="dropdown dark:text-zinc-30l0 absolute left-0 top-full mt-1 flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3 text-gray-600 dark:border-zinc-700 dark:bg-zinc-800"
                      transition:fade={{ duration: 100 }}>
                      <h3 class="text-lg font-bold text-gray-800 dark:text-zinc-300">
                        {event.title}
                      </h3>
                      <div class="flex gap-2">
                        <button
                          class="rounded-md border border-gray-200 px-3 py-1 text-sm transition duration-100 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                          >Edit</button>
                        <button
                          class="rounded-md bg-red-500 px-3 py-1 text-sm text-white transition duration-100 hover:bg-red-600"
                          on:click|stopPropagation={() => {
                            preferences.events = preferences.events.filter((e) => {
                              return e.id !== event.id;
                            });
                          }}>Delete</button>
                      </div>
                    </div>
                  {/if}
                </button>
              {/each}

              {#each preferences.holidays.filter((h) => h.visible) as holidayGroup}
                {#each holidayGroup.dates.filter( (d) => moment(d.date).isSame(date, 'date') ) as holiday}
                  <p
                    class="z-10 w-full rounded-md bg-gray-400 px-[2px] py-[1px] text-left text-xs text-white">
                    {#if holidayGroup.group === 'US'}
                      🇺🇸
                    {:else if holidayGroup.group === 'PH'}
                      🇵🇭
                    {/if}
                    {holiday.holiday}
                  </p>
                {/each}
              {/each}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}

<dialog
  id="addEventDialog"
  class="w-2/5 rounded-lg bg-white p-5 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300">
  <form class="flex flex-col gap-5" on:submit={addEvent}>
    <h1 class="text-2xl font-bold">Add Event</h1>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600 dark:text-zinc-400">Description</p>
      <input
        type="text"
        class="w-full rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
        bind:value={eventDescription} />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600 dark:text-zinc-400">Date</p>
      <div class="flex gap-2">
        <select
          name="month"
          id="eventMonth"
          class="rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={eventMonth}>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="8">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>

        <input
          type="number"
          id="eventDay"
          name="day"
          class="w-20 rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={eventDay} />

        <input
          type="number"
          id="eventYear"
          name="year"
          class="w-24 rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={eventYear} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600 dark:text-zinc-400">Color</p>
      <div class="flex gap-2">
        <button
          class="h-10 w-10 rounded-full bg-red-400 {eventColor === 'red'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            eventColor = 'red';
            console.log(eventColor);
          }} />

        <button
          class="h-10 w-10 rounded-full bg-green-400 {eventColor === 'green'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            eventColor = 'green';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-blue-400 {eventColor === 'blue'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            eventColor = 'blue';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-yellow-400 {eventColor === 'yellow'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            eventColor = 'yellow';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-purple-400 {eventColor === 'purple'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            eventColor = 'purple';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-gray-400 {eventColor === 'gray'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            eventColor = 'gray';
          }} />
      </div>
    </div>

    <div class="mt-5 flex place-content-end gap-3">
      <button
        class="rounded-md bg-gray-100 px-3 py-2 font-bold text-gray-500 transition duration-100 hover:bg-gray-200"
        value="cancel"
        formmethod="dialog">Cancel</button>
      <button
        class="rounded-md bg-green-200 px-3 py-2 font-bold text-green-600 transition duration-100 hover:bg-green-300"
        on:click={addEvent}>Add</button>
    </div>
  </form>
</dialog>
