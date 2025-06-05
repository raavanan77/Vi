<script lang="ts">
	import { CircleCheck, ArrowUpRight, Router, CircleX, Ban, CirclePause } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
</script>

<div class="flex min-h-screen w-full flex-col">
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Devices Online</Card.Title>
					<Router class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">1</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Passed Testcases</Card.Title>
					<CircleCheck class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+20</div>
					<p class="text-xs text-muted-foreground">Across all devices</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Failed Testcases</Card.Title>
					<CircleX class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+13</div>
					<p class="text-xs text-muted-foreground">Across all devices</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Aborted Testcases</Card.Title>
					<Ban class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+0</div>
					<p class="text-xs text-muted-foreground">Across all devices</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Running Testcases</Card.Title>
					<CirclePause class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+20</div>
					<p class="text-xs text-muted-foreground">Across all devices</p>
				</Card.Content>
			</Card.Root>
		</div>
		<div class="grid gap-4 md:gap-8 lg:grid-cols-2">
			<Card.Root class="xl:col-span-2">
				<Card.Header class="flex flex-row items-center">
					<div class="grid gap-2">
						<Card.Title>Execution History</Card.Title>
					</div>
					<Button href="##" size="sm" class="ml-auto gap-1">
						View All
						<ArrowUpRight class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Device</Table.Head>
								<Table.Head class="xl:table.-column">Testcase</Table.Head>
								<Table.Head class="xl:table.-column">Date</Table.Head>
								<Table.Head class="text-right">Result</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
									<div class="font-medium">HPCC_v1</div>
									<div class="text-sm text-muted-foreground md:inline">Build_Q1_2025</div>
								</Table.Cell>
								<Table.Cell class="xl:table.-column">Sanity</Table.Cell>
								<Table.Cell class="xl:table.-column">2023-06-24</Table.Cell>
								<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
									2023-06-23
								</Table.Cell>
								<Table.Cell class="text-right">Aborted</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>
									<div class="font-medium">HPCC_winter</div>
									<div class="text-sm text-muted-foreground md:inline">Build_Q3_2024</div>
								</Table.Cell>
								<Table.Cell class="xl:table.-column">Sanity-Ext</Table.Cell>
								<Table.Cell class="xl:table.-column">2024-11-12</Table.Cell>
								<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
									2023-06-23
								</Table.Cell>
								<Table.Cell class="text-right">Skipped</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>
									<div class="font-medium">HPCC_dev</div>
									<div class="text-sm text-muted-foreground md:inline">Build_dev_build</div>
								</Table.Cell>
								<Table.Cell class="xl:table.-column">Ignition-cycle</Table.Cell>
								<Table.Cell class="xl:table.-column">2025-03-04</Table.Cell>
								<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
									2023-06-23
								</Table.Cell>
								<Table.Cell class="text-right">Passed</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>
									<div class="font-medium">HPCC_last_child</div>
									<div class="text-sm text-muted-foreground md:inline">
										Build_custom_client_requested
									</div>
								</Table.Cell>
								<Table.Cell class="xl:table.-column">Power-mode-stress</Table.Cell>
								<Table.Cell class="xl:table.-column">2025-04-24</Table.Cell>
								<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
									2023-06-23
								</Table.Cell>
								<Table.Cell class="text-right">Passed</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>
									<div class="font-medium">HPCC_v1</div>
									<div class="text-sm text-muted-foreground md:inline">Build_Q1_2025</div>
								</Table.Cell>
								<Table.Cell class="xl:table.-column">Ethernet-traffic</Table.Cell>
								<Table.Cell class="xl:table.-column">2023-06-24</Table.Cell>
								<Table.Cell class="md:table.-cell xl:table.-column hidden lg:hidden">
									2023-06-23
								</Table.Cell>
								<Table.Cell class="text-right">Failed</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</main>
</div>
