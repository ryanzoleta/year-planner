<script lang="ts">
  import moment from 'moment';
  import preferences from '$lib/stores/preferences';
  import type { CalendarEvent } from '$lib/types';
  import cuid from 'cuid';
  import { createEventDispatcher } from 'svelte';

  export let date: moment.Moment;

  function construcColorsText(color: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray') {
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

  function construcColors(color: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray') {
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
      case 'gray':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  let borderStyle = '';

  if (date.date() >= 1 && date.date() <= 7) {
    borderStyle = 'border-t border-t-zinc-500';
  }

  if (date.date() === 1 && date.day() !== 1) {
    borderStyle += ' border-l border-l-zinc-500';
  }

  const dispatch = createEventDispatcher();
</script>

<button
  class="bg-whtie relative flex h-20 flex-col transition duration-100 hover:bg-slate-200 dark:hover:bg-zinc-800 {date.day() ===
    6 || date.day() === 0
    ? 'bg-slate-100 dark:bg-zinc-950'
    : 'bg-slate-50 dark:bg-zinc-900'}
                  {$preferences.layout === '3'
    ? 'h-28'
    : $preferences.layout === '2'
    ? 'h-32'
    : 'h-32'}
      {date.isSame(moment(), 'date') ? 'border border-red-500' : ''} {borderStyle}"
  on:click={() => {
    dispatch('click');
  }}>
  <p class="rounded-full py-1 text-xs text-zinc-400">{date.format('D')}</p>

  {#if date.date() === 1}
    <div class="absolute left-0 top-0 z-10">
      <h3 class="text-4xl font-bold text-zinc-500 opacity-50">{date.format('MMMM')}</h3>
    </div>
  {/if}

  <div class="flex w-full flex-col gap-1">
    {#each $preferences.events.filter((e) => date.isSameOrAfter(moment(e.date), 'date') && date.isSameOrBefore(moment(e.endDate), 'date')) as calendarEvent}
      <button
        class="relative z-20 w-full px-[2px] py-[1px] text-left text-xs text-white transition duration-100 {construcColors(
          calendarEvent.color
        )} {determineRoundness(calendarEvent, date)}"
        on:click|stopPropagation={() => {
          dispatch('eventClick', { event: calendarEvent });
        }}>
        {#if moment(calendarEvent.date).isSame(date, 'date')}
          {calendarEvent.title}
        {:else}
          <p class={construcColorsText(calendarEvent.color)}>heh</p>
        {/if}
      </button>
    {/each}

    {#each $preferences.holidays.filter((h) => h.visible) as holidayGroup}
      {#each holidayGroup.dates.filter((d) => moment(d.date).isSame(date, 'date')) as holiday}
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
