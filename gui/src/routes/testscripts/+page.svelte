<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { X, FilePenLine, Loader2 } from '@lucide/svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	interface Testcase {
		id: number;
		name: string;
	}

	interface RawTestcaseData {
		testcases: Record<string, Testcase>;
	}

	// State variables
	let testcaseData: Testcase[] = [];
	let scriptcontent = '';
	let searchTerm = '';
	let isLoading = false;
	let scriptname = '';
	let filteredTestcases: Testcase[] = [];

	// Reactive statement to filter testcases based on search
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

	export async function get_testcases_content(testcase_name: string): Promise<string> {
		try {
			isLoading = true;
			const response = await fetch(`http://localhost:8000/api/get_testcase/${testcase_name}/`);
			const data = await response.json();
			scriptcontent = data.testcase || '';
			scriptname = testcase_name;
			return data.testcase || '';
		} catch (error) {
			console.error('Error fetching testcases:', error);
			return '';
		} finally {
			isLoading = false;
		}
	}

	export async function edit_testcase(testcase_name: string, new_content: string): Promise<string> {
		try {
			isLoading = true;
			const response = await fetch(`http://localhost:8000/api/edit_testcase/${testcase_name}/`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ testcase: new_content })
			});
			const data = await response.json();

			if (data.success) {
				scriptcontent = new_content;
				scriptname = testcase_name;
			} else {
				console.error('Error editing testcase:', data.message);
			}
			return data.testcase || '';
		} catch (error) {
			console.error('Error fetching testcases:', error);
			return '';
		} finally {
			isLoading = false;
		}
	}

	function update_content(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		scriptcontent = target.value;
		console.log('Updated content:', scriptcontent);
	}

	onMount(() => {
		get_testcases_data();
	});
</script>

<main class="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
	<div class="relative flex flex-col items-start gap-8 md:flex">
		<form class="grid w-full items-start gap-6" on:submit|preventDefault>
			<fieldset class="grid gap-6 rounded-lg border p-4">
				<legend class="-ml-1 px-1 text-sm font-medium">Execute Testcases</legend>
				<!-- Script Selection -->
				<div class="grid gap-3">
					<Label>Select Script to edit or view</Label>
					<Command.Root class="w-full rounded-lg border shadow-md">
						<Command.Input placeholder="Type a script name or search..." bind:value={searchTerm} />
						<Command.List class="max-h-[300px] overflow-y-auto">
							<Command.Empty>No results found.</Command.Empty>
							<Command.Group heading="Available Scripts">
								{#if isLoading}
									<div class="flex items-center gap-2 p-2">
										<Loader2 class="size-4 animate-spin" />
										<span>Loading testcases...</span>
									</div>
								{:else if filteredTestcases && filteredTestcases.length}
									{#each filteredTestcases as script}
										<Command.Item
											value={script.name}
											onSelect={() => get_testcases_content(script.name)}
											class="cursor-pointer"
										>
											<div class="flex w-full items-start gap-3 text-muted-foreground">
												<div class="grid flex-1 gap-0.5">
													<p class="font-medium text-foreground">
														{script.name}
													</p>
												</div>
											</div>
										</Command.Item>
									{/each}
								{:else}
									<div class="p-4 text-center text-muted-foreground">No testcases available</div>
								{/if}
							</Command.Group>
						</Command.List>
					</Command.Root>
				</div>
			</fieldset>
		</form>
	</div>

	<!-- Editor Panel -->
	<div class="relative flex flex-col rounded-xl lg:col-span-2">
		<fieldset class="h-full rounded-lg border p-4">
			<legend class="-ml-1 px-1 text-sm font-medium">Script Editor</legend>
			<Label class="p-2">Script Name : {scriptname}</Label>
			<Textarea
				class="max-h-[79vh] w-full resize-none overflow-auto rounded-lg border-2 border-dashed bg-muted/50 p-4 md:h-full"
				placeholder="Test script will be displayed here..."
				rows={10}
				value={scriptcontent}
				onchange={scriptcontent != '' ? update_content : undefined}
				on:input={update_content}
				disabled={scriptcontent == ''}
			/>
		</fieldset>
		<div class="absolute bottom-4 right-4 flex gap-2">
			<Button
				variant="outline"
				size="sm"
				on:click={() => scriptcontent != '' && edit_testcase(scriptname, scriptcontent)}
			>
				<FilePenLine class="h-4 w-4" />
				Commit Changes
			</Button>
			<Button
				variant="outline"
				size="sm"
				on:click={() => ((scriptcontent = ''), (scriptname = ''))}
			>
				<X class="h-4 w-4" />
				Clear
			</Button>
		</div>
	</div>
</main>
