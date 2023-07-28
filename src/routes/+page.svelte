<script lang="ts">
  import { generateAllDates } from '$lib/utils';
  import moment from 'moment';

  const allDates = generateAllDates(2023);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
</script>

<div class="mb-3 bg-slate-200 p-4">
  <h1 class="text-2xl font-extrabold text-slate-700">Year Planner</h1>
</div>

<div class="grid grid-cols-3 gap-3 p-3">
  {#each months as month}
    <div>
      <h3 class="py-2 text-center text-lg font-bold text-zinc-700">{month}</h3>
      <div class="grid grid-cols-7">
        {#each daysOfWeek as day}
          <div class="px-2 py-4 text-center text-slate-500">{day}</div>
        {/each}
      </div>
      <div class="grid grid-cols-7">
        {#each allDates as date}
          {#if date.format('MMMM') === month}
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
              class="flex h-20 flex-col p-2 hover:bg-slate-200 {date.day() === 6 || date.day() === 0
                ? 'bg-slate-100'
                : 'bg-slate-50'}">
              <p class="text-xs text-zinc-500">{date.format('D')}</p>
            </button>

            <!-- {#if date.format('YYYY-MM-DD') === date.endOf('month').format('YYYY-MM-DD')}
              <div  />
            {/if} -->
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>
