<script lang="ts">
  import { daysOfWeek, allMonths } from '$lib/data';
  import { generateAllDates } from '$lib/utils';
  import moment from 'moment';
  import { onMount } from 'svelte';

  let selectingMonths = false;
  let months = allMonths;
  let columns = '3';

  const allDates = generateAllDates(2023);

  type Event = {
    date: moment.Moment;
    title: string;
    type: 'BIRTHDAY' | 'HOLIDAY' | 'EVENT';
  };

  let events: Event[] = [];

  onMount(() => {
    events = [
      ...events,
      {
        date: moment('2023-07-24'),
        title: "Aina's Birthday",
        type: 'BIRTHDAY'
      }
    ];

    window.onclick = (event) => {
      const targetElement = event.target;

      let currentElement = targetElement;
      while (currentElement !== document.body) {
        //@ts-ignore
        if (currentElement.classList.contains('month-selector')) {
          console.log('Target is a child of an element with classname "custom"');
          return;
        }
        //@ts-ignore
        currentElement = currentElement.parentElement;
      }

      selectingMonths = false;
    };
  });
</script>

<div class="mb-3 flex place-content-between place-items-center gap-2 bg-slate-200 p-4">
  <h1 class="text-2xl font-extrabold text-slate-700">Year Planner</h1>

  <div>
    <select
      class="relative w-fit rounded-md border border-slate-300 bg-slate-200 px-3 py-2 text-center font-bold text-slate-600 transition duration-100 hover:bg-slate-300"
      bind:value={columns}>
      <option value="3">Grid</option>
      <option value="2">2-Column</option>
      <option value="1">Stack</option>
    </select>

    <button
      class="month-selector relative rounded-md border border-slate-300 bg-slate-200 px-3 py-2 font-bold text-slate-600 transition duration-100 hover:bg-slate-300"
      on:click={() => {
        selectingMonths = true;
      }}
      >Show/Hide Months

      {#if selectingMonths}
        <div
          class=" absolute right-0 top-full mt-2 flex w-56 flex-col gap-2 rounded-md border border-slate-300 bg-slate-200 px-1 py-2 text-left">
          {#each months as month}
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
              months = months.map((m) => {
                m.visible = true;
                return m;
              });
            }}>Show All</button>
          <button
            class="  block w-full rounded-md border border-slate-300 bg-slate-200 py-2 text-center font-bold text-slate-600 transition duration-100 hover:bg-slate-300"
            on:click={() => {
              months = months.map((m) => {
                m.visible = false;
                return m;
              });
            }}>Hide All</button>
        </div>
      {/if}
    </button>
  </div>
</div>

<div class="grid grid-cols-{columns} gap-2 p-1 {parseInt(columns) < 3 ? 'px-10' : ''}">
  {#each months as month}
    {#if month.visible}
      <div>
        <h3 class="py-2 text-center text-lg font-bold text-zinc-700">{month.month}</h3>
        <div class="grid grid-cols-7">
          {#each daysOfWeek as day}
            <div class="px-2 py-4 text-center text-slate-500">{day}</div>
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
                  : 'bg-slate-50'}">
                <p class="p-1 text-xs text-zinc-500">{date.format('D')}</p>

                {#each events as event}
                  {#if event.date.isSame(date, 'date')}
                    <p
                      class="rounded-md bg-green-500 px-[2px] py-[1px] text-left text-xs text-white">
                      {event.title}
                    </p>
                  {/if}
                {/each}
              </button>

              <!-- {#if date.format('YYYY-MM-DD') === date.endOf('month').format('YYYY-MM-DD')}
              <div  />
            {/if} -->
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  {/each}
</div>
