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
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';

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
  layers: [rasterLayer1, rasterLayer2, vectorLayerPoints, vectorLayerLines],
  target: "map",
  view: new View({
    center: fromLonLat([-3.7038, 40.4168]),
    zoom: 14,
    maxZoom: 18,
    minZoom: 10,
  }),
  controls: [],
});

map.addControl(new FullScreen());
const overviewMapControl = new OverviewMap({
  collapsed: false,
});
map.addControl(overviewMapControl);

const layerSwitcher = new LayerSwitcher({
  tipLabel: "Capas",
});
map.addControl(layerSwitcher);

const popup = new Overlay.Popup();
map.addOverlay(popup);

map.on("click", function (evt) {
  let featureFound = false;
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    if (layer === vectorLayerPoints) {
      const coordinates = feature.getGeometry().getCoordinates();
      const hdms = toStringHDMS(toLonLat(coordinates));
      popup.show(coordinates, "<div>Coordenadas: " + hdms + "</div>");
      featureFound = true;
    }
  });
  if (!featureFound) {
    popup.hide();
  }
});