<h2>🔥 Missing in the whitelist</h2>

@include('lye.table', [
    'title' => 'Missing Recipes',
    'ids' => 'unlock_id',
    'description' => 'These recipes get unlocked by a <code>CraftingRecipe</code> but the <code>details.recipe_id</code> is missing in the /v2/recipes API.',
    'data' => $missing_recipes,
    'columns' => [
        'Recipe' => 'unlock_id',
        'Source' => [
            'id',
            function($e) { return $e->link(); },
        ],
        'Created at' => 'date_added'
    ]
])

<h3>Missing Items</h3>
@include('lye.table', [
    'level' => 4,
    'title' => 'Achievement Objectives',
    'ids' => 'entity_id',
    'description' => 'These items are required for an achievement (<code>bits</code>) but missing in /v2/items.',
    'data' => $missing_items_objectives,
    'columns' => [
        'Item' => 'entity_id',
        'Source' => [
            'achievement_id',
            function($e) { return $e->achievement->link(); },
        ],
        'Created at' => function($e) { return $e->achievement->created_at; }
    ]
])

@include('lye.table', [
    'level' => 4,
    'title' => 'Achievement Rewards',
    'ids' => 'entity_id',
    'description' => 'These items are rewarded for an achievement (<code>rewards</code>) but missing in /v2/items.',
    'data' => $missing_items_rewards,
    'columns' => [
        'Item' => 'entity_id',
        'Source' => [
            'achievement_id',
            function($e) { return $e->achievement->link(); },
        ],
        'Created at' => function($e) { return $e->achievement->created_at; }
    ]
])

@include('lye.table', [
    'level' => 4,
    'title' => 'Recipe Source',
    'description' => 'These recipes have the flag <code>LearnedFromItem</code> but there are no items unlocking them.',
    'data' => $missing_items_source,
    'columns' => [
        'Item' => function() { return '?'; },
        'Source' => [
            'recipe_id',
            function($e) { return $e->output->link(16,null,null,'r'.$e->recipe_id); },
        ],
        'Created at' => function($e) { return $e->output->date_added; }
    ]
])

@include('lye.table', [
    'level' => 4,
    'title' => 'Recipe Output',
    'ids' => 'output_id',
    'description' => 'These recipes have an item as output that is missing in /v2/items.',
    'data' => $missing_items_output,
    'columns' => [
        'Item' => 'output_id',
        'Source' => [
            'recipe_id',
            'type'
        ],
        'Created at' => function($e) { return '?'; }
    ]
])

@include('lye.table', [
    'title' => 'Missing Skins',
    'ids' => 'skin_id',
    'description' => 'These skins get unlocked by an item but are missing in /v2/skins.',
    'data' => $missing_skins,
    'columns' => [
        'Skin' => 'skin_id',
        'Source' => [
            function($e) { return $e->id; },
            function($e) { return $e->link(); },
        ],
        'Created at' => 'date_added'
    ]
])
