<div class="tooltip">
    <header>{{ $trait->getName( ) }}</header>

    @unless( $trait->getDescription() == '' )
        {{ $trait->getDescription() }}
    @endunless

    @if($trait->hasFacts() || $trait->hasTraitedFacts())
        <div class="trait-facts">
            @if($trait->hasFacts())
                @foreach($trait->getFacts() as $fact)
                    <?php $section = uniqid('trait.fact.'); ?>

                    @if(View::exists('traits.facts.'.$fact->type))
                        @include('traits.facts.'.$fact->type)
                    @else
                        @include('traits.fact')
                    @endif
                @endforeach
            @endif
            @if($trait->hasTraitedFacts())
                @if($trait->hasFacts())
                    <hr>
                @endif
                @foreach($trait->getTraitedFacts() as $fact)
                    <?php $section = uniqid('trait.fact.'); ?>

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

@foreach($trait->getSkills() as $skillData)
    <?php $skill = Skill::fromTraitData($skillData); ?>
    @include('skill.tooltip')
@endforeach

<style>
    .trait-facts {
        margin-top: 16px;
    }
    .trait-facts > hr {
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

    #tooltip .tooltip {
        display: block;
        margin-bottom: 10px;
    }

    #tooltip .tooltip+.tooltip {
        margin-top: 0;
    }
</style>
