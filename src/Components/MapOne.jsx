import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Marker, MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import L, {Icon} from 'leaflet';
import tileLayer from '../Utils/tileLayer';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { initialMarkers } from '../Utils/initialMarkers';

const center = [52.22977, 21.01178];

const removeMarker = (index, map, legend) => {
    map.eachLayer((layer) => {
        if (layer.options && layer.options.pane === "markerPane") {
            if (layer.options.uniceid === index) {
                map.removeLayer(layer);
                legend.textContent = 'marker removed';
            }
        }
    });
}

const ShowMarkers = ({ mapContainer, legend, markers }) => {
    return markers.map((marker, index) => {
        return <Marker
            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
            key={index}
            uniceid={marker.id}
            position={marker.position}
            draggable={true}
            eventHandlers={{
                moveend(e) {
                const { lat, lng } = e.target.getLatLng();
                legend.textContent = `change position: ${lat} ${lng}`;
                }
            }}
            >
                <Popup>
                    <p>ID: {marker.id}</p>
                    <p>Title: {marker.title}</p>
                    <p>Description: {marker.description}</p>
                    <button onClick={() => removeMarker(index, mapContainer, legend)}>delete marker</button>
                </Popup>
        </Marker>
    })
}

const MyMarkers = ({initialM}) => {
    const map = useMap();
    const [marker, setMarker] = useState([]);
    const [legend, setLegend] = useState()

    useEffect(()=>{
        setMarker(initialM);
        map.locate({
            setView: true,
        })
    },[]);

    useEffect(() => {
        if (!map) return;

        const legend = L.control({ position: "bottomleft" });

        const info = L.DomUtil.create("div", "legend");

        legend.onAdd = () => {
            info.textContent = `click on the map, move the marker, click on the marker`;
            return info;
        };

        legend.addTo(map);

        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            let newMarker = {
                position:  [lat, lng],
                id: uuidv4(), 
                title: 'New Marker'
            }
            setMarker(mar => [...mar, newMarker]);
            //info.textContent = `new marker: ${e.latlng}`;
            setLegend(info);
        })

    }, [map]);

    return marker.length > 0 ? (
        <ShowMarkers
            mapContainer={map}
            legend={legend}
            markers={marker} 
        />
    ) : null
}

const MapOne = () => {
    return (
        <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        >
            <TileLayer {...tileLayer} />
            <MyMarkers initialM={initialMarkers} />
        </MapContainer>
    )
}

export default MapOne;