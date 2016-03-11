<h2 class="pageWidth">New Items</h2>

<div class="date-selector">
	<div class="date-selector__content pageWidth">
		<a class="date-selector__content__button date-selector__content__button--prev" href="{{ route('stats.items.new', [App::getLocale(), 'date' => $startPrev->format('Y-m-d')]) }}">
			<svg width="32" height="32" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
			<span>{{ $startPrev->format('d.m.Y') }} <span class="date-selector__separator">–</span> {{ $endPrev->format('d.m.Y') }}</span>
		</a>
		<span class="date-selector__content__current">
			<span class="date-selector__content__current__button" id="dropdown-button">
				<span>{{ $start->format('d.m.Y') }} <span class="date-selector__separator">–</span> {{ $end->format('d.m.Y') }}</span>
				<svg width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
			</span>
			<div class="date-selector__dropdown" id="dropdown" aria-hidden="true" style="display: none">
				@include('stats.items.new.dropdown')
			</div>
		</span>
		<a class="date-selector__content__button date-selector__content__button--next" {{ $canShowNextWeek ? 'href="'.route('stats.items.new', [App::getLocale(), 'date' => $startNext->format('Y-m-d')]).'"' : 'disabled' }}>
			<span>{{ $startNext->format('d.m.Y') }} <span class="date-selector__separator">–</span> {{ $endNext->format('d.m.Y') }}</span>
			<svg width="32" height="32" viewBox="0 0 24 24"><path transform="rotate(180 12 12)" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
		</a>
	</div>
</div>

<div class="pageWidth">
	@forelse($days as $day)
		<h3 id="{{ $day->date->format('Y-m-d') }}">{{ $day->date->format('d.m.Y') }} ({{ count($day->items) }})</h3>
		<ul class="itemList">
			@foreach($day->items as $item)
				<li>{{ $item->link(32) }}
			@endforeach
		</ul>
	@empty
		<p>{{ trans('misc.noNewItems', ['start' => $start->format('d.m.Y'), 'end' => $end->format('d.m.Y')]) }}</p>
	@endforelse
</div>

<script>
	(function() {
		var dropdownElement = document.getElementById('dropdown');
		var dropdownButton = document.getElementById('dropdown-button');
		var dropdownVisible = false;

		dropdownButton.addEventListener('click', function() {
			dropdownVisible = !dropdownVisible;

			dropdownElement.setAttribute('aria-hidden', !dropdownVisible);

			if(dropdownVisible) {
				dropdownElement.classList.add('visible');
				dropdownButton.classList.add('dropdown-visible');
			} else {
				dropdownElement.classList.remove('visible');
				dropdownButton.classList.remove('dropdown-visible');
			}
		});
	})();
</script>

<style>
	.date-selector {
		background: #eee;
		padding: 0;
		margin-bottom: 24px;

		position: sticky;
		top: 0;
		z-index: 1;
	}

	.date-selector__content {
		display: flex;
		line-height: 48px;
		height: 48px;
		padding-left: 0;
		padding-right: 0;
		max-width: 1056px;
	}

	.date-selector__content__current {
		flex: 1;
		position: relative;
		text-align: center;
	}

	.date-selector__content__current__button {
		cursor: pointer;
		width: 100%;
		max-width: 350px;
		display: inline-block;
		height: 48px;
	}
	.date-selector__content__current__button:hover {
		background: #f8f8f8;
	}
	.date-selector__content__current__button.dropdown-visible {
		background: #e2e2e2;
	}
	.date-selector__content__current__button.dropdown-visible:hover {
		background: #f2f2f2;
	}

	.date-selector__content__button:hover {
		text-decoration: none;
		background: #f8f8f8;
	}
	.date-selector__content__button--prev {
		padding-right: 16px;
	}
	.date-selector__content__button--next {
		padding-left: 16px;
	}

	.date-selector__content__button > svg {
		vertical-align: middle;
		fill: #aaa;
		float: left;
		margin: 8px;
		width: 32px;
		height: 32px;
	}
	.date-selector__content__button:hover svg {
		fill: #888;
	}
	.date-selector__content__button > span {
		vertical-align: middle;
		float: left;
	}
	.date-selector__content__current__button > span {
		font-family: Bitter, sans-serif;
		font-size: 16px;
	}
	.date-selector__content__current__button > svg {
		width: 24px; height: 24px;
		vertical-align: -6px;
	}
	.date-selector__content__button[disabled] {
		color: #aaa;
	}
	.date-selector__content__button[disabled]:hover {
		background: #eee;
	}
	.date-selector__content__button[disabled] > svg {
		fill: #ddd;
	}

	.date-selector__separator {
		margin: 0 0.2em;
	}


	@media(max-width: 768px) {
		.date-selector__content__button > span {
			display: none;
		}
		.date-selector__content__button {
			padding-right: 0;
			padding-left: 0;
		}
	}

	.date-selector__dropdown {
		position: absolute;
		width: 350px;
		max-width: 100vw;
		background: #f8f8f8;
		border-bottom: 2px solid #ddd;
		top: 48px;
		left: 50%;
		margin-left: -175px;
		line-height: 1.5em;
		z-index: 1;

		max-height: calc(100vh - 200px);

		overflow-y: auto;
		cursor: default;

		display: none;
	}
	.date-selector__dropdown.visible {
		display: block !important;
	}
</style>
