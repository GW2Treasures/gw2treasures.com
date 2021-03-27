<style>
    #map {
        width: 100%;
        min-height: calc(100vh - 56px - 56px - 30px);
        margin-bottom: -20px;
        display: flex;
        background: #f9f9f9;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
    @media(max-width: 740px) {
        #map {
            min-height: calc(100vh - 56px - 30px);
        }
    }
</style>

<div id="map">
    Loading…
</div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
      integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
      crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js"
        integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw=="
        crossorigin=""></script>
<script>
(function() {
    const mapElement = document.getElementById('map');

    Promise.all([
        'https://api.guildwars2.com/v2/continents/1',
        'https://api.guildwars2.com/v2/continents/1/floors/0/regions?ids=all'
    ].map(
        (url) => fetch(url).then((r) => r.json())
    )).then(([continent, regions]) => {
        var map = L.map(mapElement, {
            minZoom: continent.min_zoom,
            maxZoom: continent.max_zoom,
            crs: L.CRS.Simple
        });

        function unproject(coord) {
            return map.unproject(coord, map.getMaxZoom());
        }

        const southWest = unproject([0, continent.continent_dims[1]]);
        const northEast = unproject([continent.continent_dims[0], 0]);

        const bounds = new L.LatLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);
        map.setView(bounds.getCenter(), 2);

        L.tileLayer('https://tiles.guildwars2.com/'+continent.id+'/'+continent.floors[0]+'/{z}/{x}/{y}.jpg').addTo(map);

        regions.forEach((region) => Object.values(region.maps).forEach((m) => {
            L.rectangle(m.continent_rect.map(unproject), {color: "#ff7800", weight: 1})
                .addTo(map)
                .bindTooltip(m.name, {direction:"center"}).openTooltip();
        }));
    })
})();
</script>
