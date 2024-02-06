import React, { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, ScaleControl } from "react-leaflet";
import L , { divIcon }from "leaflet";
import * as topojson from "topojson-client";
import india from "../Utils/india.json";
import { getColor, layersUtils, getCenterOfGeoJson } from "../Utils/mapUtils";
import "leaflet/dist/leaflet.css";
import { Button } from "antd";

const COUNTRY_VIEW_ID = "india-states";

const MapTwo = () => {
  const [geoJsonId, setGeoJsonId] = useState(COUNTRY_VIEW_ID);
  const geoJson = topojson.feature(india, india.objects[geoJsonId]);

  var mapRef = useRef(null);
  var geoJsonRef = useRef(null);

  function onEachFeature(_, layer) {
    let layerUtils = layersUtils(geoJsonRef, mapRef);
    layer.on({
      mouseover: layerUtils.highlightOnClick,
      mouseout: layerUtils.resetHighlight,
      click: onDrillDown
    });
  }

  const customMarkerIcon = (name) =>
    divIcon({
      html: name,
      className: "icon"
    });

  const setIcon = ( feature , latlng) => {
    return L.marker(latlng, { icon: customMarkerIcon(feature.Name) });
  };

  function geoJSONStyle(feature) {
    return {
      color: "#1f2021",
      weight: 1,
      fillOpacity: 0.5,
      fillColor: getColor(Math.floor(Math.random() * 26))
    };
  }

  const onDrillDown = (e) => {
    const featureId = e.target.feature.id;
    if (!india.objects[featureId]) {
      return;
    }
    setGeoJsonId(featureId);
  };

  useEffect(() => {
    if (mapRef.current && geoJsonRef.current) {
      mapRef.current.fitBounds(
        geoJsonRef.current.getBounds()
      );
    }
  });

  const mapCenter = getCenterOfGeoJson(geoJson);

  return (
    <div className="mapMainContainer">
      <div className="buttonWrapper">
        <Button
          onClick={() => setGeoJsonId(COUNTRY_VIEW_ID)}
          className="backButton"
        >
          Back To Country View
        </Button>
      </div>
      <MapContainer className="geo-map" center={mapCenter} zoom={4} ref={mapRef}>
        <GeoJSON
          data={geoJson}
          key={geoJsonId}
          style={geoJSONStyle}
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
          id="geoJsonAll"
          pointToLayer={setIcon}
        />
        <ScaleControl />
      </MapContainer>
    </div>
  );
}

export default MapTwo