import cx from "clsx";
import type { DivIcon, Icon, IconOptions, LatLngExpression } from "leaflet";
import { latLngBounds } from "leaflet";
import React from "react";
import type { PolylineProps } from "react-leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

export type Marker = {
  position: LatLngExpression;
  icon: DivIcon | Icon<IconOptions>;
  content: React.ReactNode;
};

export type Polyline = {
  positions: LatLngExpression[];
  content?: React.ReactNode;
} & PolylineProps;

type Props = {
  className?: string;
  defaultCenter?: LatLngExpression;
  defaultZoom?: number;
  markers?: Marker[];
  polylines?: Polyline[];
  clusterize?: boolean;
  children?: React.ReactNode;
};

export const BerlinCoordinates = [52.520008, 13.404954] as LatLngExpression;

const Map = ({ className, defaultCenter, defaultZoom, markers, polylines, clusterize = false, children }: Props) => {
  const [map, setMap] = React.useState<any>(null);
  const [zoom, setZoom] = React.useState<number | undefined>(defaultZoom);
  const onZoom = (zoom: number) => setZoom(zoom);
  const onMove = Function.prototype;
  const onClick = Function.prototype;
  const shouldClusterize = markers && clusterize && zoom && zoom < 17;

  React.useEffect(() => {
    if (!map) return;
    map.invalidateSize();
  }, [map]);

  return (
    <div className={cx("relative size-full", !markers?.length && "pointer-events-none", className)}>
      {!markers?.length && (
        <h4 className="absolute left-1/2 top-1/2 z-20 flex size-full -translate-x-1/2 -translate-y-1/2 place-content-center place-items-center bg-black/25 text-center text-white">
          No position found to display on map.
        </h4>
      )}
      <MapContainer className="rounded-2xl" center={defaultCenter} zoom={defaultZoom} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <MapGetter setMap={setMap} />
        <MapResizer />
        <MapEvents onZoom={onZoom} onMove={onMove} onClick={onClick} />
        {markers?.length && <MapFitMarkers markers={markers} preserveZoom={zoom} />}

        {/* Layer providers: https://leaflet-extras.github.io/leaflet-providers/preview/ */}
        <TileLayer url={"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"} maxZoom={20} />

        {!shouldClusterize &&
          markers?.map(({ position, icon, content }, index) => (
            <Marker key={index} position={position} icon={icon}>
              <Popup>{content}</Popup>
            </Marker>
          ))}

        {shouldClusterize && (
          <MarkerClusterGroup chunkedLoading={true}>
            {markers?.map(({ position, icon, content }, index) => (
              <Marker key={index} position={position} icon={icon}>
                <Popup>{content}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}

        {polylines?.map(({ positions, content, ...otherProps }, index: number) => (
          <Polyline key={index} positions={positions} color={"blue"} weight={3} opacity={0.5} smoothFactor={1} {...otherProps} />
        ))}

        {children}
      </MapContainer>
    </div>
  );
};

export default Map;

const MapFitMarkers = React.memo(
  ({ markers, preserveZoom }: { markers: Marker[]; preserveZoom?: number }) => {
    const map = useMap();

    React.useEffect(() => {
      if (!markers?.length) return;
      const bounds = latLngBounds(markers.filter((m) => m.position[0] && m.position[1]).map((m) => [m.position[0], m.position[1]]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [9, 9] });
        if (preserveZoom) map.setZoom(preserveZoom);
      }
    }, [map, markers, preserveZoom]);

    return null;
  },
  (previousProps, nextProps) => {
    const previousMarkersPositions = previousProps.markers.map((m) => m.position);
    const nextMarkersPositions = nextProps.markers.map((m) => m.position);
    const positionsUnchanged = JSON.stringify(previousMarkersPositions) === JSON.stringify(nextMarkersPositions);
    return positionsUnchanged;
  },
);
MapFitMarkers.displayName = "MapFitMarkers";

const MapEvents = ({ onLoad, onZoom, onMove, onClick }: { onLoad?: any; onZoom?: any; onMove?: any; onClick?: any }) => {
  const mapEvents = useMapEvents({
    load: () => {
      if (onLoad) onLoad();
    },
    zoomend: () => {
      const zoom = mapEvents.getZoom();
      if (onZoom) onZoom(zoom);
    },
    moveend: (event) => {
      try {
        const center = event.target.getCenter();
        if (onMove) onMove(center);
      } catch (error) {
        console.error(error);
      }
    },
    click: (event) => {
      const position = event.latlng;
      if (onClick) {
        onClick(position);
      }
    },
  });

  return null;
};

const MapResizer = () => {
  const map = useMap();
  React.useEffect(() => {
    if (!map) return;
    const container = map.getContainer();
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);
    return () => resizeObserver.unobserve(container);
  }, [map]);
  return null;
};

const MapGetter = ({ setMap }) => {
  const map = useMap();

  React.useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
};
