<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { X } from '@lucide/svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';

	interface Testcase {
		id: number;
		name: string;
	}

	interface RawTestcaseData {
		testcases: Record<string, Testcase>;
	}

	// State variables
	let testcaseData: Testcase[] = [];
	let selectedTestcases: Testcase[] = [];
	let searchTerm = '';
	let isLoading = false;
	let filteredTestcases: Testcase[] = [];

	$: filteredTestcases = testcaseData.filter((testcase) =>
		testcase.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	export async function get_testcases_data(): Promise<Testcase[]> {
		try {
			isLoading = true;
			const response = await fetch('http://localhost:8000/api/get_testcase/');
			const data: RawTestcaseData = await response.json();

			// Convert the object to an array
			const testcases = Object.values(data.testcases);
			testcaseData = testcases;
			return testcases;
		} catch (error) {
			console.error('Error fetching testcases:', error);
			return [];
		} finally {
			isLoading = false;
		}
	}
</script>

<ScrollArea class="h-screen">
	{#each filteredTestcases as testcase (testcase.id)}
		<div class="flex items-center gap-4 p-2">
			<label for={testcase.id.toString()} class="flex-1 text-sm font-medium">
				{testcase.name}
			</label>
			<Button type="button" on:click={() => testcase.id}>View</Button>
			<Button type="button" variant="destructive" on:click={() => testcase.id}>
				<X class="h-4 w-4" />
			</Button>
		</div>
		<Separator />
	{/each}
</ScrollArea>
