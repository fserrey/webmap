import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { FullScreen, OverviewMap } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
import Overlay from 'ol/Overlay';
import { Circle as CircleStyle } from 'ol/style';


const rasterLayer1 = new TileLayer({
  source: new OSM(),
  title: "OSM",
  type: "base",
});

const rasterLayer2 = new TileLayer({
  source: new XYZ({
    url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
  }),
  title: "OpenTopoMap",
  type: "base",
});

const stamenTonerLayer = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'toner',
  }),
});

const pointFeature = new Feature({
  geometry: new Point(fromLonLat([-3.7038, 40.4168])),
});

const vectorLayerPoints = new VectorLayer({
  source: new VectorSource({
    features: [pointFeature],
  }),
  title: "Puntos",
  style: new Style({
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({ color: "red" }),
      stroke: new Stroke({ color: "black", width: 2 }),
    }),
  }),
});

const lineFeature = new Feature({
  geometry: new LineString([
    fromLonLat([-3.7038, 40.4168]),
    fromLonLat([-3.6884, 40.4082]),
  ]),
});

const vectorLayerLines = new VectorLayer({
  source: new VectorSource({
    features: [lineFeature],
  }),
  title: "Líneas",
  style: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 3,
    }),
  }),
});

const map = new Map({
  layers: [rasterLayer1, rasterLayer2, stamenTonerLayer, vectorLayerPoints, vectorLayerLines],
  target: "map",
  view: new View({
    center: fromLonLat([-3.7038, 40.4168]),
    zoom: 14,
  }),
  controls: [],
});

map.addControl(new FullScreen());
map.addControl(new OverviewMap());
const layerSwitcher = new LayerSwitcher({
  tipLabel: "Capas",
});
map.addControl(layerSwitcher);

map.on("click", function (evt) {
  map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    const coordinates = feature.getGeometry().getCoordinates();
    const hdms = toStringHDMS(toLonLat(coordinates));
    alert("Coordenadas: " + hdms);
  });
});
