<div class="tooltip">
    <header>{{ $skill->getName( ) }}</header>

    @unless( $skill->getDescription() == '' )
        {{ $skill->getDescription() }}
    @endunless

    @if($skill->hasFacts() || $skill->hasTraitedFacts())
        <div class="skill-facts">
            @if($skill->hasFacts())
                @foreach($skill->getFacts() as $fact)
                    <?php $section = uniqid('skill.fact.'); ?>

                    @if(isset($fact->type) && View::exists('traits.facts.'.$fact->type))
                        @include('traits.facts.'.$fact->type)
                    @else
                        @include('traits.fact')
                    @endif
                @endforeach
            @endif
            @if($skill->hasTraitedFacts())
                @if($skill->hasFacts())
                    <hr>
                @endif
                @foreach($skill->getTraitedFacts() as $fact)
                    <?php $section = uniqid('skill.fact.'); ?>

                    @if(View::exists('traits.facts.'.$fact->type))
                        @include('traits.facts.'.$fact->type)
                    @else
                        @include('traits.fact')
                    @endif
                @endforeach
            @endif
        </div>
    @endif
</div>

<style>
    .skill-facts {
        margin-top: 16px;
    }
    .skill-facts > hr {
        border-top-color: #eee;
    }
    .trait-fact {
        margin-bottom: 4px;
    }
    .trait-fact > img {
        vertical-align: -3px;
    }
    .trait-fact__buff {
        margin-left: 20px;
        color: #777;
    }
</style>
