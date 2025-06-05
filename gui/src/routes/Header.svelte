<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/images/evvi.png';
	import { CircleUser } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
	<nav
		class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
	>
		<a href="/" class="flex items-center gap-4 text-lg font-semibold md:text-base">
			<img class="max-w-12" src={logo} alt="vi-logo" />
			<span class="sr-only">Vi AF</span>
		</a>
		<a
			href="/"
			class="{page.url.pathname === '/'
				? 'text-foreground'
				: 'text-muted-foreground'} hover:text-foreground"
		>
			Home
		</a>
		<a
			href="/execution"
			class="{page.url.pathname === '/execution'
				? 'text-foreground'
				: 'text-muted-foreground'} hover:text-foreground"
		>
			Execution
		</a>
		<a
			href="/devices"
			class="{page.url.pathname === '/devices'
				? 'text-foreground'
				: 'text-muted-foreground'} transition-colors hover:text-foreground"
		>
			Devices
		</a>
		<a
			href="/testscripts"
			class="{page.url.pathname === '/testscripts'
				? 'text-foreground'
				: 'text-muted-foreground'} transition-colors hover:text-foreground"
		>
			Scripts
		</a>
		<a
			href="/documents"
			class="{page.url.pathname === '/documents'
				? 'text-foreground'
				: 'text-muted-foreground'} transition-colors hover:text-foreground"
		>
			Documents
		</a>
		<!--<a href="/settings" class="text-foreground transition-colors hover:text-foreground">
			Settings
		</a>-->
	</nav>
	<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
		<form class="ml-auto flex-1 sm:flex-initial">
			<div class="relative"></div>
		</form>

		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
					<CircleUser class="h-5 w-5" />
					<span class="sr-only">Toggle user menu</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Settings</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Logout</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
