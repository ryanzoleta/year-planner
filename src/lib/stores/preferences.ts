import { defaultPreferences } from '$lib/data';
import { writable } from 'svelte/store';

const preferences = writable(defaultPreferences);

export default preferences;
