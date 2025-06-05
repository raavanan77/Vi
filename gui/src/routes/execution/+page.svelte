<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { X, Play, Loader2 } from '@lucide/svelte';

	interface Device {
		id: number;
		name: string;
	}

	interface Testcase {
		id: number;
		name: string;
	}

	interface RawDeviceData {
		devices: Record<string, Device>;
	}

	interface RawTestcaseData {
		testcases: Record<string, Testcase>;
	}

	interface ExecutionResult {
		[x: string]: any;
		success?: boolean;
		message?: string;
		results?: any;
		error?: string;
		executionId?: string;
		timestamp?: string;
	}

	let testcaseData: Testcase[] = [];
	let selectedTestcases: Testcase[] = [];
	let selectedDevice = '';
	let searchTerm = '';
	let isLoading = false;
	let isExecuting = false;
	let executionResults: ExecutionResult[] = [];
	let filteredTestcases: Testcase[] = [];

	let dutProfile: Device[] = [];

	$: filteredTestcases = testcaseData.filter((testcase) =>
		testcase.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	export async function get_testcases_data(): Promise<Testcase[]> {
		try {
			isLoading = true;
			const response = await fetch('http://localhost:8000/api/testcase/get/');
			const data: RawTestcaseData = await response.json();
			console.log('Testcases:', data);
			const testcases = Object.values(data).map((testcase: any) => ({
				id: testcase.id,
				name: testcase.testcasename
			}));
			testcaseData = testcases;
			return testcases;
		} catch (error) {
			console.error('Error fetching testcases:', error);
			return [];
		} finally {
			isLoading = false;
		}
	}

	export async function get_dut_profile(): Promise<Testcase[]> {
		try {
			isLoading = true;
			const response = await fetch('http://localhost:8000/api/dut/profile/get/');
			const data: RawDeviceData = await response.json();
			console.log('DUT Profile:', data);
			dutProfile = Object.values(data).map((device: any) => ({
				id: device.id,
				name: device.profilename
			}));
			return dutProfile;
		} catch (error) {
			console.error('Error fetching DUT profile:', error);
			return [];
		} finally {
			isLoading = false;
		}
	}

	function addTestcase(testcase: Testcase) {
		if (!selectedTestcases.find((tc) => tc.id === testcase.id)) {
			selectedTestcases = [...selectedTestcases, testcase];
		}
		searchTerm = '';
	}

	function removeTestcase(testcaseId: number) {
		selectedTestcases = selectedTestcases.filter((tc) => tc.id !== testcaseId);
	}

	function clearAllTestcases() {
		selectedTestcases = [];
	}

	async function executeTestcases() {
		if (selectedTestcases.length === 0 || !selectedDevice) {
			alert('Please select a device and at least one testcase');
			return;
		}

		isExecuting = true;

		try {
			const response = await fetch('http://localhost:8000/api/testcase/execute/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					device: selectedDevice,
					testcases: selectedTestcases.map((tc) => ({
						id: tc.id,
						name: tc.name
					})),
					timestamp: new Date().toISOString(),
					action: 'execute_testcases'
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error('Error executing testcases:', error);
		} finally {
			isExecuting = false;
		}
	}

	function handleDeviceSelect(selected: any) {
		selectedDevice = selected?.value || '';
		console.log('Selected device:', selectedDevice);
	}

	onMount(() => {
		get_dut_profile();
		get_testcases_data();
	});
</script>

<main class="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
	<div class="relative flex flex-col items-start gap-8 md:flex">
		<form class="grid w-full items-start gap-6" on:submit|preventDefault={executeTestcases}>
			<fieldset class="grid gap-6 rounded-lg border p-4">
				<legend class="-ml-1 px-1 text-sm font-medium">Execute Testcases</legend>

				<!-- Device Selection -->
				<div class="grid gap-3">
					<Label for="device">Device</Label>
					<Select.Root onSelectedChange={handleDeviceSelect}>
						<Select.Trigger id="device" class="items-start [&_[data-description]]:hidden">
							<Select.Value placeholder="Select a Device" />
						</Select.Trigger>
						<Select.Content>
							{#each dutProfile as device}
								<Select.Item
									value={device.name}
									class="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-muted"
								>
									<p>{device.name}</p>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Selected Testcases Chips -->
				{#if selectedTestcases.length > 0}
					<div class="grid gap-3">
						<div class="flex items-center justify-between">
							<Label>Selected Testcases ({selectedTestcases.length})</Label>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								on:click={clearAllTestcases}
								class="h-auto p-1 text-xs"
							>
								Clear All
							</Button>
						</div>
						<div class="flex flex-wrap gap-2 rounded-lg border-2 border-dashed bg-muted/50 p-3">
							{#each selectedTestcases as testcase (testcase.id)}
								<Badge variant="secondary" class="flex items-center gap-2 px-3 py-1">
									<span class="text-sm">{testcase.name}</span>
									<button
										type="button"
										on:click={() => removeTestcase(testcase.id)}
										class="rounded-full p-0.5 transition-colors hover:bg-background"
									>
										<X class="size-3" />
									</button>
								</Badge>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Script Selection -->
				<div class="grid gap-3">
					<Label>Select Scripts</Label>
					<Command.Root class="max-w-[450px] rounded-lg border shadow-md">
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
											onSelect={() => addTestcase(script)}
											class="cursor-pointer {selectedTestcases.find((tc) => tc.id === script.id)
												? 'opacity-50'
												: ''}"
										>
											<div class="flex w-full items-start gap-3 text-muted-foreground">
												<div class="grid flex-1 gap-0.5">
													<p class="font-medium text-foreground">
														{script.name}
													</p>
												</div>
												{#if selectedTestcases.find((tc) => tc.id === script.id)}
													<Badge variant="outline" class="text-xs">Selected</Badge>
												{/if}
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

				<!-- Execute Button -->
				<Button
					type="submit"
					class="w-full"
					disabled={isExecuting || selectedTestcases.length === 0 || !selectedDevice}
				>
					{#if isExecuting}
						<Loader2 class="mr-2 size-4 animate-spin" />
						Executing...
					{:else}
						<Play class="mr-2 size-4" />
						Execute Testcases ({selectedTestcases.length})
					{/if}
				</Button>
			</fieldset>
		</form>
	</div>

	<!-- Results Panel -->
	<div class="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
		<Badge variant="outline" class="absolute right-3 top-3">Execution Results</Badge>

		<div class="mt-8 space-y-4 overflow-y-auto">
			{#if executionResults.length === 0}
				<div class="flex h-full items-center justify-center text-muted-foreground">
					<div class="text-center">
						<Play class="mx-auto mb-4 size-12 opacity-50" />
						<p>No executions yet</p>
						<p class="text-sm">Select testcases and click execute to see results</p>
					</div>
				</div>
			{:else}
				{#each executionResults as result, index}
					{#each Object.values(result.result) as value}
						<div class="space-y-2 rounded-lg border bg-background p-4">
							<div class="flex items-start justify-between">
								<div class="flex items-center gap-2">
									{console.log('Result', result)}
									{#if result.error}
										<Badge variant="destructive">Error</Badge>
									{:else if result.success}
										<Badge variant="default">Success</Badge>
									{:else}
										<p>{value}</p>
									{/if}
									{#if result.timestamp}
										<span class="text-xs text-muted-foreground">
											{new Date(result.timestamp).toLocaleString()}
										</span>
									{/if}
								</div>
								{#if result.executionId}
									<Badge variant="outline" class="text-xs">
										ID: {result.executionId}
									</Badge>
								{/if}
							</div>

							{#if result.error}
								<div class="text-sm text-destructive">
									<strong>Error:</strong>
									{result.error}
								</div>
							{:else if result.message}
								<div class="text-sm">
									<strong>Message:</strong>
									{result.message}
								</div>
							{/if}

							{#if result.results}
								<details class="text-sm">
									<summary class="mb-2 cursor-pointer font-medium">View Results</summary>
									<pre class="overflow-x-auto rounded bg-muted p-2 text-xs">{JSON.stringify(
											result.results,
											null,
											2
										)}</pre>
								</details>
							{/if}
						</div>
					{/each}
				{/each}
			{/if}
		</div>
	</div>
</main>
