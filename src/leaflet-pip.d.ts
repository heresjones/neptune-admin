declare module "@mapbox/leaflet-pip" {
  import { LatLng, Layer } from "leaflet";

  function leafletPip(point: LatLng, layer: Layer, inside?: boolean): LatLng[];
  export default leafletPip;
}
