'use client';

import { CRS, latLng, Map as LMap, type MapOptions, type TileLayerOptions } from 'leaflet';
import { useRef, type FC } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css';

// const tileUrl = 'https://assets.gw2dat.com/tiles/1/1/{z}/{x}/{y}.jpg';
const tileUrl = 'https://tiles1.gw2.io/1/1/{z}/{x}/{y}.jpg';

const zoomOffset = 1;

const mapOptions: MapOptions = {
  // start in zoom level 3
  zoom: 3,
  center: latLng(-260, 365),

  //
  crs: CRS.Simple,

  // constrain viewport to bounds and disable bounce animation
  maxBoundsViscosity: 1,
  maxBounds: [[0, 640], [-896, 0]],

  // add intermediate zoom level
  zoomDelta: .5,
  zoomSnap: .5,
  wheelPxPerZoomLevel: 120,

  // increase distance panned by keyboard
  keyboardPanDelta: 256,

  // render layers with canvas (not supported for TileLayer)
  preferCanvas: true,

  // hide all default controls
  attributionControl: false,
  zoomControl: false,

  fadeAnimation: true,
};


const tileLayerOptions: TileLayerOptions = {
  // configure available tiles from the tile server
  // this has to be offset by zoomOffset
  maxNativeZoom: 7 - zoomOffset,
  minNativeZoom: 2 - zoomOffset,

  // set zoom offset (this basically displays all tiles at double resolution)
  zoomOffset,

  // set the size of the tiles (when zoomOffset is set the tileSize shrinks)
  tileSize: 256 / (2 ** zoomOffset),

  // set min/max zoom
  // maxZoom is larger than the available zoom level (7), to allow zooming in further (but tiles will be stretched)
  minZoom: 2,
  maxZoom: 8,

  // map does not wrap around
  noWrap: true,

  // keep a small buffer around the map when panning
  keepBuffer: 3,

  // set crossOrigin to ensure no credentials are included
  crossOrigin: 'anonymous',
};

console.log(mapOptions, tileLayerOptions);

export interface MapProps {}

export const Map: FC<MapProps> = ({}) => {
  const mapRef = useRef<LMap>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wip}>- Work In Progress -</div>
      <MapContainer className={styles.map} {...mapOptions} ref={mapRef}>
        <TileLayer url={tileUrl} {...tileLayerOptions}/>
      </MapContainer>
    </div>
  );
};

