<script lang="ts">
	import { LucideBot } from "@lucide/svelte";
    let className: String;
    className = "sidebar";
</script>

<div class={className}>
	<button>Devices</button>
</div>

<style>
	.sidebar {
		width: 17rem;
		padding: 2rem 1rem 0.6rem;
		border-right: 1px solid #aaa;
		background: #fff;
		border-radius: 2px;
	}
</style>