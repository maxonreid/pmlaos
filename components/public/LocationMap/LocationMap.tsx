'use client'

import maplibregl, { type StyleSpecification } from 'maplibre-gl'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import styles from './LocationMap.module.css'

type Props = {
  latitude: number
  longitude: number
  label?: string
}

const BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
} as const

export default function LocationMap({ latitude, longitude, label }: Props) {
  return (
    <div className={styles.mapContainer}>
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude,
          latitude,
          zoom: 15,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={BASEMAP_STYLE}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <div className={styles.marker}>
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
              <path
                d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z"
                fill="var(--color-primary)"
              />
              <circle cx="16" cy="16" r="6" fill="white" />
            </svg>
          </div>
        </Marker>
      </Map>
    </div>
  )
}
