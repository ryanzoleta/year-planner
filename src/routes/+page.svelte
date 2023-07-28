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

  let preferences: typeof defaultPreferences;

  let selectingMonths = false;
  let selectingHolidays = false;

  let allDates = generateAllDates(2023);

  let eventMonth: string;
  let eventDay: number;
  let eventYear: number;
  let eventDescription = '';

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

  function addEvent() {
    if (eventDescription.trim() === '') return;

    preferences.events = [
      ...preferences.events,
      {
        date: moment().year(eventYear).month(eventMonth).date(eventDay),
        title: eventDescription,
        type: 'EVENT'
      }
    ];

    const dialog = document.getElementById('addEventDialog');

    if (dialog) {
      //@ts-ignore
      dialog.close();
    }
  }
</script>

{#if preferences}
  <div
    class="mb-3 flex place-content-between place-items-center gap-2 border-b border-slate-200 px-4 py-3">
    <div class="flex place-items-center gap-3">
      <h1 class="text-2xl font-extrabold text-slate-700">Year Planner</h1>
      <div class="flex place-items-center gap-2">
        <IconButton
          on:click={() => {
            preferences.year -= 1;
            allDates = generateAllDates(preferences.year);
          }}><IconChevronLeft /></IconButton>
        <p class="text-xl font-bold text-slate-600">{preferences.year}</p>
        <IconButton
          on:click={() => {
            preferences.year += 1;
            allDates = generateAllDates(preferences.year);
          }}><IconChevronRight /></IconButton>
      </div>
    </div>

    <div class="flex place-items-center gap-5">
      <button
        class="rounded-md bg-red-500 px-4 py-2 text-white"
        on:click={() => {
          localStorage.removeItem('preferences');
        }}>Clear localStorage</button>

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
    </div>
  </div>

  <div
    class="grid {parseInt(preferences.layout) === 3
      ? 'grid-cols-3'
      : parseInt(preferences.layout) === 2
      ? 'grid-cols-2'
      : 'grid-cols-1'} gap-2 p-1 {parseInt(preferences.layout) < 3 ? 'px-10' : ''}">
    {#each preferences.months.filter((m) => m.visible) as month}
      <div>
        <h3 class="py-2 text-center text-lg font-bold text-zinc-700">{month.description}</h3>

        <div class="grid grid-cols-7">
          {#each daysOfWeek as day}
            <div class="px-2 py-4 text-center text-xs text-slate-400">{day}</div>
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
              class="flex h-20 flex-col hover:bg-slate-200 {date.day() === 6 || date.day() === 0
                ? 'bg-slate-100'
                : 'bg-slate-50'}
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
                <p
                  class="z-10 w-full rounded-md bg-green-400 px-[2px] py-[1px] text-left text-xs text-white">
                  {event.title}
                </p>
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

<dialog id="addEventDialog" class="w-2/5 rounded-lg bg-white p-5 text-gray-700">
  <form class="flex flex-col gap-5" on:submit={addEvent}>
    <h1 class="text-2xl font-bold">Add Event</h1>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600">Description</p>
      <input
        type="text"
        class="w-full rounded-md bg-gray-100 px-4 py-2 text-gray-600"
        bind:value={eventDescription} />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600">Date</p>
      <div class="flex gap-2">
        <select
          name="month"
          id="eventMonth"
          class="rounded-md bg-gray-100 px-4 py-2 text-gray-600"
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
          class="w-20 rounded-md bg-gray-100 px-4 py-2 text-gray-600"
          bind:value={eventDay} />
        <input
          type="number"
          id="eventYear"
          name="year"
          class="w-24 rounded-md bg-gray-100 px-4 py-2 text-gray-600"
          bind:value={eventYear} />
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
