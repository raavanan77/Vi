<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<div class="app">
	<ModeWatcher />
	<Header />
	{@render children()}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
