<script>
	import { ChartNoAxesColumn, Dot, MessageCircleMore, Share2, Star } from 'lucide-svelte';

	let { topic, text } = $props();
	import moment from 'moment';
	import { onMount } from 'svelte';
	let fav_id = $state([]);
	const setFavId = () => {
		let fav = localStorage.getItem('fav_ids');
		if (fav) {
			fav_id = JSON.parse(fav);
		}
	};
	onMount(() => {
		//when the document is mounted on the browser, get the fav_ids item in localstorage
		setFavId();
	});
	const handleFavorite = (topic) => {
		//have 2 stores in localstorage
		//fav: holds the complete info of the topics and fav_ids holds only the ids of the topic for quick operations
		//get the favorites item in localstorage
		let favorites = JSON.parse(localStorage.getItem('fav'));
		let fav_ids = [];
		if (favorites) {
			let exists = false;
			let newArray = [];
			for (let i = 0; i < favorites.length; i++) {
				let favorite = favorites[i];
				if (favorite.id == topic.id) {
					//item exists in the array, skip it
					exists = true;
				} else {
					//push the item into the new array
					newArray.push(favorite);
					fav_ids.push(favorite.id);
				}
			}
			if (!exists) {
				//the topic does not exist, push to the array
				newArray.push(topic);
				fav_ids.push(topic.id);
			}
			//update the favorites item in localstorage
			localStorage.setItem('fav', JSON.stringify(newArray));
			localStorage.setItem('fav_ids', JSON.stringify(fav_ids));
		} else {
			//the favorites item in localstorage does not exist, set a new one
			localStorage.setItem('fav', JSON.stringify([topic]));
			localStorage.setItem('fav_ids', JSON.stringify([topic.id]));
		}
		setFavId();
	};
	// Web Share API function
	export const shareTopic = async (topicTitle, url) => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: topicTitle,
					text: `Check out this topic: ${topicTitle}`,
					url: url
				});
			} catch (error) {
				console.error('Error sharing the topic:', error);
			}
		} else {
			// Fallback to copy link
			copyToClipboard();
		}
	};
	export const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			alert('Link copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy the link:', error);
		}
	};
	// function to handle multiple terms
	function highlightText(fullText, match) {
		if (!match) return fullText;

		// Split the match variable into individual words or phrases
		const terms = match.split(/\s+/); // Split by spaces or other delimiters

		// Create a regex to match all terms
		const regex = new RegExp(`(${terms.join('|')})`, 'gi');

		// Highlight matching terms in the full text
		return fullText
			.split(regex)
			.map((part) =>
				terms.some((term) => part.toLowerCase() === term.toLowerCase())
					? `<span class="bg-primary/30">${part}</span>`
					: part
			)
			.join('');
	}
</script>

<div class="bg-white p-2 hover:bg-gray-50">
	<div class="flex items-center justify-between text-sm">
		<span class="flex items-center">
			<div class="mr-2 h-[25px] w-[25px] overflow-hidden rounded-full">
				<img class="object-fit" src={topic.Member.image} alt={topic.Member.username} />
			</div>
			<a class=" link-hover" href={`/community/${topic.Member.username}`}>{topic.Member.username}</a
			>
			<Dot />
			<p class="text-gray-400">{moment(topic.created_at).fromNow()}</p></span
		>
		<button class="btn btn-ghost" onclick={() => handleFavorite(topic)}>
			{#if fav_id.includes(topic.id)}
				<Star fill="red" color="red" />
			{:else}
				<Star />
			{/if}
		</button>
	</div>
	<a href={`/community/topic/${topic.id}`}>
		<h3 class="text-xl font-bold">{@html highlightText(topic.topic, text)}</h3>
		<p class="mt-2 text-sm text-gray-800">
			{@html highlightText(topic.content, text)}
		</p>
	</a>
	<div class="mt-5 text-xs">
		<div
			class="tooltip"
			data-tip={`${topic.topic_views.length} view${topic.topic_views.length == 1 ? '' : 's'}`}
		>
			<button class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
				><ChartNoAxesColumn size="20px" />
				<p>{topic.topic_views.length}</p></button
			>
		</div>
		<a
			onclick={() => commentModal.show()}
			href={`/community/topic/${topic.id}`}
			class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
			><MessageCircleMore size="20px" />
			<p>{topic.Comment.length}</p></a
		>
		<button
			onclick={() => shareTopic(topic.topic, `${location.href}/topic/${topic.id}`)}
			class="btn btn-ghost rounded-full bg-base-100/10 text-xs"
			><Share2 size="20px" />
			<p>Share</p></button
		>
	</div>
</div>
