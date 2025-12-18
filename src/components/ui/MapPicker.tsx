'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in Next.js/Leaflet
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

function LocationMarker({ position, onLocationSelect }: { position: [number, number], onLocationSelect: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom())
        }
    }, [position, map])

    return (
        <Marker position={position} icon={icon}>
            <Popup>
                พิกัด: {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </Popup>
        </Marker>
    )
}

export default function MapPicker({ lat, lng, onLocationSelect }: { lat: number, lng: number, onLocationSelect: (lat: number, lng: number) => void }) {
    return (
        <div className="relative z-0">
            <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%', borderRadius: '12px', zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={[lat, lng]} onLocationSelect={onLocationSelect} />
            </MapContainer>
        </div>
    )
}
