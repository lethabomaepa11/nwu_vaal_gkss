<script>
	import { ArrowUpRightFromSquareIcon, Edit, PlusCircle, Trash2, X } from 'lucide-svelte';
	import moment from 'moment';

	let array = [];
	let { data, form } = $props();
	let events = $state(data.events);

	const handleDelete = (id) => {
		const data = new FormData();
		data.append('id', id);
		fetch('?/deleteEvent', {
			method: 'POST',
			body: data
		});
		// Remove the deleted event from state
		events = events.filter(event => event.id !== id);
	};
</script>

<div class="shadow-xl rounded-lg overflow-hidden">
	<div class="mb-8 flex justify-between items-center p-6">
		<h2 class="text-3xl font-semibold text-gray-800">Event Management</h2>
		<button class="btn btn-primary flex items-center space-x-2" onclick={() => my_modal_1.showModal()}>
			<PlusCircle class="mr-2" /> <span>Create Event</span>
		</button>
	</div>

	<div class="overflow-x-auto px-6 pb-6">
		<table class="w-full text-sm text-left text-gray-600 border-separate space-y-4 shadow-xl">
			<thead class="bg-gray-100 text-xs uppercase text-gray-700">
				<tr>
					<th class="px-6 py-4 font-medium">Event</th>
					<th class="px-6 py-4 font-medium hidden lg:table-cell">Description</th>
					<th class="px-6 py-4 font-medium">Date and time</th>
					<th class="px-6 py-4 font-medium text-center">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each events as event}
					<tr class="bg-white border-b hover:bg-gray-50 transition-colors">
						<td class="px-6 py-4 font-semibold text-gray-800">
							<a href={`/executive/events/${event.id}`} class="block">{event.topic}</a>
						</td>
						<td class="px-6 py-4 hidden lg:table-cell max-w-[300px] overflow-hidden">{event.description}</td>
						<td class="px-6 py-4">{moment(event.date).format('llll')}</td>
						<td class="px-6 py-4 text-center flex justify-center space-x-4">
							<button class="btn btn-ghost btn-sm hover:bg-gray-100 hidden lg:flex items-center space-x-1">
								<Edit class="mr-1" /> <span class="text-xs">Edit</span>
							</button>
							<button onclick={() => handleDelete(event.id)} class="btn btn-ghost btn-sm text-red-600 hover:bg-red-100 flex items-center space-x-1">
								<Trash2 class="mr-1" /> <span class="text-xs">Delete</span>
							</button>
							<a href={`/executive/events/${event.id}`} class="btn btn-ghost btn-sm hover:bg-gray-100 flex items-center space-x-1">
								<ArrowUpRightFromSquareIcon/> <span class="text-xs">View</span>
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<dialog id="my_modal_1" class="modal modal-bottom z-50 sm:modal-middle">
	<div class="modal-box text-white">
		<div class="flex items-center justify-between">
			<p class="text-lg font-bold">Create an Event</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn text-white"><X /> Close</button>
				</form>
			</div>
		</div>

		<p class="py-4 text-sm">Enter the required details to create an event</p>
		<form method="post" action="?/addEvent" class="flex w-full flex-col gap-5">
			<label class="form-control w-full">
				<p>Topic</p>
				<input type="text" name="topic" class="input input-bordered" id="topic" placeholder="The name of the event" />
			</label>
			<label class="form-control w-full">
				<p>Date and Time</p>
				<input type="datetime-local" name="date" class="input input-bordered" id="date" />
			  </label>
			<label class="form-control w-full">
				<p>Poster</p>
				<input type="file" name="image" class="file-input file-input-bordered w-full" accept="image/*" id="image" />
			</label>
			<label class="form-control w-full">
				<p>Description</p>
				<textarea name="description" class="textarea textarea-bordered" id="description" placeholder="What is the event about?"></textarea>
			</label>
			<button type="submit" class="btn btn-primary text-white">Create</button>
		</form>
	</div>
</dialog>

<style>
	table,
	td,
	tr,
	th,
	h1,
	h2,
	h3 {
		@apply text-black;
	}
	/* Add hover effects for action buttons */
	.btn-ghost:hover {
		@apply bg-gray-200;
	}
	/* Adjust cursor and mobile responsiveness */
	overflow-x-auto {
		@apply max-w-full;
	}
	/* Improve padding for better readability */
	th, td {
		@apply px-6 py-4;
	}
	/* Making sure the modal box is centered and not too wide */
	.modal-box {
		@apply max-w-lg mx-auto;
	}
</style>
