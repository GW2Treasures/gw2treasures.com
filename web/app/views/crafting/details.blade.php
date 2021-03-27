<h2>{{ trans('recipe.discipline.'.$discipline) }}</h2>

<h3>Recipes ({{ count($recipes) }})</h3>

@if(isset($discoverable) && $discoverable)
    <form id="discoverForm" class="js-only">
        <label for="apikey">API Key:</label>
        <input type="text" name="apikey" id="apikey">
        <input type="submit">
    </form>
    <style>
        #discoverForm { margin: 14px 0; }
        .discovery-info-span--green { color: #4caf50; }
        .discovery-info-span--red { color: #e53935; }
    </style>
    <script>
        document.forms.discoverForm.onsubmit = async function(e) {
            e.preventDefault();

            const fetchApiEndpoint = (endpoint) =>
                fetch('https://api.guildwars2.com' + endpoint).then(r => r.json());

            const createInfoSpan = (text, available) =>
                Object.assign(document.createElement('span'), {
                    className: available ? 'discovery-info-span--green' : 'discovery-info-span--red',
                    innerHTML: text
                });

            const apiKey = document.getElementById('apikey').value;
            const [characters, accountRecipes, materials] = await Promise.all([
                '/v2/characters?access_token=' + apiKey,
                '/v2/account/recipes?access_token=' + apiKey,
                '/v2/account/materials?access_token=' + apiKey
            ].map(fetchApiEndpoint));

            const characterRecipes = await Promise.all(
                characters
                    .map((name) => '/v2/characters/' + name + '/recipes?access_token=' + apiKey)
                    .map(fetchApiEndpoint)
            );

            const knownRecipes = characterRecipes.map((character) => character.recipes).concat([accountRecipes]).reduce(
                (known, list) => known.concat(list), []
            );

            knownRecipes.forEach((id) => {
                const row = document.getElementById('r' + id);
                if(row) row.remove();
            });

            const ingredients = [];
            document.querySelectorAll('.ingredients [data-item-id]').forEach((ingredient) => {
                const ingredientId = ingredient.dataset.itemId;
                const material = materials.filter((material) => material.count > 0 && material.id == ingredientId);

                if(material.length) {
                    ingredient.appendChild(createInfoSpan(' ('+material[0].count+' in Material Storage)', true))
                } else {
                    ingredient.appendChild(createInfoSpan(' (missing)', false));
                    ingredients.push(ingredientId);
                }
            });

            return false;
        }
    </script>
@endif

@include('recipe.table')
