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
  import cuid from 'cuid';
  import IconMoon from '$lib/components/icons/IconMoon.svelte';
  import IconSun from '$lib/components/icons/IconSun.svelte';
  import type { CalendarEvent } from '$lib/types';
  import CalendarDay from '$lib/components/ui/CalendarDay.svelte';
  import preferences from '$lib/stores/preferences';

  let selectingMonths = false;
  let selectingHolidays = false;

  let allDates = generateAllDates(2023);

  let event = {
    id: '',
    month: '',
    day: 1,
    year: 1,
    description: '',
    color: 'red' as 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray',
    endMonth: '',
    endDay: 1,
    endYear: 1
  };

  let mounted = false;

  onMount(() => {
    const preferencesString = localStorage.getItem('preferences');
    $preferences =
      preferencesString && preferencesString !== '{}'
        ? JSON.parse(preferencesString)
        : defaultPreferences;

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

      $preferences.events = $preferences.events.map((e) => {
        e.editing = false;
        return e;
      });

      hideEventDialog();
    };

    mounted = true;
  });

  $: if (browser && preferences && mounted) {
    localStorage.setItem('preferences', JSON.stringify($preferences));

    if ($preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function addEvent() {
    if (event.description.trim() === '') return;

    $preferences.events = [
      ...$preferences.events,
      {
        id: cuid(),
        date: moment().year(event.year).month(event.month).date(event.day),
        endDate: moment().year(event.endYear).month(event.endMonth).date(event.endDay),
        title: event.description,
        type: 'EVENT',
        editing: false,
        color: event.color
      }
    ];

    hideEventDialog();
  }

  function editEvent() {
    if (event.description.trim() === '') return;

    $preferences.events = [
      ...$preferences.events.filter((e) => e.id !== event.id),
      {
        id: event.id,
        date: moment().year(event.year).month(event.month).date(event.day),
        endDate: moment().year(event.endYear).month(event.endMonth).date(event.endDay),
        title: event.description,
        type: 'EVENT',
        editing: false,
        color: event.color
      }
    ];

    hideEventDialog();
  }

  function construcColors(
    color: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray'
  ) {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'purple':
        return 'bg-purple-500';
      case 'pink':
        return 'bg-pink-500';
      case 'orange':
        return 'bg-orange-500';
      case 'gray':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  function construcColorsText(
    color: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray'
  ) {
    switch (color) {
      case 'red':
        return 'text-red-500';
      case 'green':
        return 'text-green-500';
      case 'blue':
        return 'text-blue-500';
      case 'yellow':
        return 'text-yellow-500';
      case 'purple':
        return 'text-purple-500';
      case 'pink':
        return 'text-pink-500';
      case 'orange':
        return 'text-orange-500';
      case 'gray':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  }

  function determineRoundness(event: CalendarEvent, currentDate: moment.Moment) {
    const startDate = moment(event.date);
    const endDate = moment(event.endDate);

    if (startDate.isSame(endDate, 'date')) {
      return 'rounded-md';
    } else if (startDate.isSame(currentDate, 'date')) {
      return 'rounded-l-md';
    } else if (endDate.isSame(currentDate, 'date')) {
      return 'rounded-r-md';
    }
  }

  function showEventDialog() {
    const dialog = document.getElementById('addEventDialog');
    if (dialog) {
      setTimeout(() => {
        //@ts-ignore
        dialog.showModal();
      }, 100);
    }
  }

  function hideEventDialog() {
    const dialog = document.getElementById('addEventDialog');
    if (dialog) {
      //@ts-ignore
      dialog.close();
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
            $preferences.year -= 1;
            allDates = generateAllDates($preferences.year);
          }}><IconChevronLeft /></IconButton>
        <p class="text-xl font-bold text-slate-600 dark:text-slate-400">{$preferences.year}</p>
        <IconButton
          on:click={() => {
            $preferences.year += 1;
            allDates = generateAllDates($preferences.year);
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
          bind:value={$preferences.layout}>
          <option value="3">Grid</option>
          <option value="2">2-Column</option>
          <option value="1">Stack</option>
          <option value="0">Continuous</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <p class="text-xs text-slate-500">Months</p>
        <Selector
          label="Show/Hide Months"
          bind:list={$preferences.months}
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
          bind:list={$preferences.holidays}
          on:activate={() => {
            selectingMonths = false;
            selectingHolidays = true;
          }}
          show={selectingHolidays} />
      </div>

      {#if $preferences.darkMode}
        <IconButton
          on:click={() => {
            $preferences.darkMode = false;
          }}>
          <IconSun />
        </IconButton>
      {:else}
        <IconButton
          on:click={() => {
            $preferences.darkMode = true;
          }}>
          <IconMoon />
        </IconButton>
      {/if}
    </div>
  </div>

  <div
    class="grid bg-white dark:bg-black {parseInt($preferences.layout) === 3
      ? 'grid-cols-3'
      : parseInt($preferences.layout) === 2
      ? 'grid-cols-2'
      : 'grid-cols-1'} gap-2 p-1 {parseInt($preferences.layout) < 3 ? 'px-10' : ''}">
    {#if $preferences.layout === '0'}
      <div class="px-56">
        <div class="grid grid-cols-7">
          {#each daysOfWeek as day}
            <div class="px-2 py-4 text-center text-xs text-slate-400 dark:text-zinc-500">
              {day}
            </div>
          {/each}
        </div>

        <div class="grid grid-cols-7">
          {#each allDates.filter((d) => {
            return $preferences.months
              .filter((m) => {
                return m.visible;
              })
              .map((m) => {
                return m.description;
              })
              .includes(d.format('MMMM'));
          }) as date, index}
            <!-- {#each allDates as date, index} -->
            {#if index === 0}
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
            <CalendarDay
              {date}
              on:click={() => {
                event.month = date.month().toString();
                event.day = date.date();
                event.year = date.year();
                event.description = '';

                event.endMonth = event.month;
                event.endDay = event.day;
                event.endYear = event.year;
                event.id = '';

                showEventDialog();
              }}
              on:eventClick={(e) => {
                const calendarEvent = e.detail.event;

                calendarEvent.editing = true;

                const startDate = moment(calendarEvent.date);
                const endDate = moment(calendarEvent.endDate);

                event.month = startDate.month().toString();
                event.day = startDate.date();
                event.year = startDate.year();
                event.description = calendarEvent.title;

                event.endMonth = endDate.month().toString();
                event.endDay = endDate.date();
                event.endYear = endDate.year();
                event.id = calendarEvent.id;

                showEventDialog();
              }} />
          {/each}
        </div>
      </div>
    {:else}
      {#each $preferences.months.filter((m) => m.visible) as month}
        <div>
          <h3 class="py-2 text-center text-lg font-bold text-zinc-700 dark:text-zinc-500">
            {month.description}
          </h3>

          <div class="grid grid-cols-7">
            {#each daysOfWeek as day}
              <div class="px-2 py-4 text-center text-xs text-slate-400 dark:text-zinc-500">
                {day}
              </div>
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
                  {$preferences.layout === '3'
                  ? 'h-28'
                  : $preferences.layout === '2'
                  ? 'h-32'
                  : 'h-32'}
                {date.isSame(moment(), 'date') ? 'border border-red-500' : ''}"
                on:click={() => {
                  event.month = date.month().toString();
                  event.day = date.date();
                  event.year = date.year();
                  event.description = '';

                  event.endMonth = event.month;
                  event.endDay = event.day;
                  event.endYear = event.year;
                  event.id = '';

                  showEventDialog();
                }}>
                <p class="rounded-full py-1 text-xs text-zinc-400">{date.format('D')}</p>

                <div class="flex w-full flex-col gap-1">
                  {#each $preferences.events.filter((e) => date.isSameOrAfter(moment(e.date), 'date') && date.isSameOrBefore(moment(e.endDate), 'date')) as calendarEvent}
                    <button
                      class="relative z-10 w-full px-[2px] py-[1px] text-left text-xs text-white transition duration-100 {construcColors(
                        calendarEvent.color
                      )} {determineRoundness(calendarEvent, date)}"
                      on:click|stopPropagation={() => {
                        calendarEvent.editing = true;

                        const startDate = moment(calendarEvent.date);
                        const endDate = moment(calendarEvent.endDate);

                        event.month = startDate.month().toString();
                        event.day = startDate.date();
                        event.year = startDate.year();
                        event.description = calendarEvent.title;

                        event.endMonth = endDate.month().toString();
                        event.endDay = endDate.date();
                        event.endYear = endDate.year();
                        event.id = calendarEvent.id;

                        showEventDialog();
                      }}>
                      {#if moment(calendarEvent.date).isSame(date, 'date')}
                        {calendarEvent.title}
                      {:else}
                        <p class={construcColorsText(calendarEvent.color)}>heh</p>
                      {/if}
                    </button>
                  {/each}

                  {#each $preferences.holidays.filter((h) => h.visible) as holidayGroup}
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
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}

<dialog
  id="addEventDialog"
  class="dialog w-2/5 rounded-lg bg-white p-5 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300">
  <form
    class="dropdown flex flex-col gap-5"
    on:submit|preventDefault={() => {
      if (event.id) editEvent();
      else addEvent();
    }}>
    {#if event.id}
      <h1 class="text-2xl font-bold">Edit Event</h1>
    {:else}
      <h1 class="text-2xl font-bold">Add Event</h1>
    {/if}

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600 dark:text-zinc-400">Description</p>
      <input
        type="text"
        class="w-full rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
        bind:value={event.description} />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600 dark:text-zinc-400">Start Date</p>
      <div class="flex gap-2">
        <select
          name="month"
          id="eventMonth"
          class="rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={event.month}>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>

        <input
          type="number"
          id="event.day"
          name="day"
          class="w-20 rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={event.day} />

        <input
          type="number"
          id="event.year"
          name="year"
          class="w-24 rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={event.year} />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600 dark:text-zinc-400">End Date</p>
      <div class="flex gap-2">
        <select
          name="month"
          id="eventEndMonth"
          class="rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={event.endMonth}>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>

        <input
          type="number"
          id="eventEndDay"
          name="day"
          class="w-20 rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={event.endDay} />

        <input
          type="number"
          id="eventEndYear"
          name="year"
          class="w-24 rounded-md bg-gray-100 px-4 py-2 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400"
          bind:value={event.endYear} />

        <button
          class="rounded-md bg-gray-500 px-3 text-sm"
          on:click={() => {
            event.endMonth = event.month;
            event.endDay = event.day;
            event.endYear = event.year;
          }}>Same Day</button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-gray-600 dark:text-zinc-400">Color</p>
      <div class="flex gap-2">
        <button
          class="h-10 w-10 rounded-full bg-red-400 {event.color === 'red'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'red';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-green-400 {event.color === 'green'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'green';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-blue-400 {event.color === 'blue'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'blue';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-yellow-400 {event.color === 'yellow'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'yellow';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-purple-400 {event.color === 'purple'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'purple';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-pink-400 {event.color === 'pink'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'pink';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-orange-400 {event.color === 'orange'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'orange';
          }} />

        <button
          class="h-10 w-10 rounded-full bg-gray-400 {event.color === 'gray'
            ? 'border-4 border-gray-100'
            : ''}"
          on:click|preventDefault={() => {
            event.color = 'gray';
          }} />
      </div>
    </div>

    <div class="mt-5 flex place-content-between gap-3">
      <div class="flex-1">
        {#if event.id}
          <button
            class=" rounded-md bg-red-500 px-3 py-2 font-bold text-red-100 transition duration-100 hover:bg-red-600"
            on:click|preventDefault={() => {
              $preferences.events = $preferences.events.filter((e) => {
                return e.id !== event.id;
              });
              hideEventDialog();
            }}>Delete</button>
        {/if}
      </div>
      <div class="flex gap-2">
        <button
          class="rounded-md bg-gray-100 px-3 py-2 font-bold text-gray-500 transition duration-100 hover:bg-gray-200"
          on:click|preventDefault={hideEventDialog}>Cancel</button>
        {#if event.id}
          <button
            class="rounded-md bg-green-200 px-3 py-2 font-bold text-green-600 transition duration-100 hover:bg-green-300"
            type="submit">Save Changes</button>
        {:else}
          <button
            class="rounded-md bg-green-200 px-3 py-2 font-bold text-green-600 transition duration-100 hover:bg-green-300"
            type="submit">Add</button>
        {/if}
      </div>
    </div>
  </form>
</dialog>
