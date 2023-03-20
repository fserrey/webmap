//mapa de Madrid
var map = L.map('map', {
  miniMap: true,
  center: [40.4167754, -3.7037902],
  zoom: 13
});

//capas
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap' +
    '</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
    'CC-BY-SA</a>'
}).addTo(map);

var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>,' +
    ' under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.' +
    ' Data by <a href="http://openstreetmap.org">OpenStreetMap</a>,' +
    ' under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});
var terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>,' +
    ' under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.' +
    ' Data by <a href="http://openstreetmap.org">OpenStreetMap</a>,' +
    ' under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});
var stadia = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
});
var toner = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
});
var Spain_PNOA_Ortoimagen = L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma', {
  layers: 'OI.OrthoimageCoverage',
  format: 'image/png',
  transparent: false,
  continuousWorld: true,
  attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
});
var Spain_UnidadAdministrativa = L.tileLayer.wms('http://www.ign.es/wms-inspire/unidades-administrativas', {
  layers: 'AU.AdministrativeUnit',
  format: 'image/png',
  transparent: true,
  continuousWorld: true,
  attribution: '© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'

});

// plugin de capas del IGN
var lidar = L.tileLayer.providerESP('LiDAR');
var curvas_de_nivel = L.tileLayer.providerESP('MDT.CurvasNivel');
var nombres_geograficos = L.tileLayer.providerESP('NombresGeograficos');

// Agregar plugin de edición
var drawnItems = new L.FeatureGroup().addTo(map);

// Cambiar estilo de los polígonos dibujados
map.on('draw:created', function (e) {
  var layer = e.layer;
  layer.setStyle({
    fillColor: '#00FF00',
    fillOpacity: 0.5,
    color: '#000000',
    weight: 2
  });
  drawnItems.addLayer(layer);
});

// Agregar datos usando omnivore
var parquesCSV = omnivore.csv('data/puntos.csv')
.on('ready', function (layer) {
  this.eachLayer(function (marker) {
    var lat = marker.getLatLng().lat;
    var lng = marker.getLatLng().lng;
    marker.bindPopup('<strong>' + marker.toGeoJSON().properties.nombre + '</strong><br>' +
      lat + ', ' + lng);
  });
})
.addTo(map);

var osmMiniMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap' +
    '</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
    'CC-BY-SA</a>'
});

var miniMap = new L.Control.MiniMap(osmMiniMap, {
  toggleDisplay: true,
  minimized: true,
}).addTo(map);

//controles
L.control.scale({
  position: 'bottomright',
  imperial: false,
}).addTo(map);

var baseMaps = {
  "Base de OpenStreetMap": osm,
  "Acuarela": watercolor,
  "Terreno": terrain,
  "Modo oscuro": toner,
  "Modo claro": stadia
};

var overlays = {
  "Parques": parquesCSV,
  "PNOA": Spain_PNOA_Ortoimagen,
  "Unidades Administrativas": Spain_UnidadAdministrativa,
  "LiDAR": lidar,
  "Curvas de nivel": curvas_de_nivel,
  "Nombres geográficos": nombres_geograficos,
};

L.control.layers(baseMaps, overlays).addTo(map);


var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    marker: true,
    polyline: true,
    polygon: true,
    rectangle: false,
    circle: false,
    circlemarker: false
  }
});
map.addControl(drawControl);


// Import the geosearch provider
const { GeoSearchControl, OpenStreetMapProvider } = window.GeoSearch;

// Create the search control and add it to the map
const searchControl = new GeoSearchControl({
  provider: new OpenStreetMapProvider(),
  style: 'bar',
  autoComplete: true,
  autoCompleteDelay: 250,
  showMarker: true,
  showPopup: true,
  autoClose: true,
  searchLabel: 'Busca una dirección',
  keepResult: true,
  animateZoom: true,
  position: 'bottomleft',
  zoomLevel: 18,
});

map.addControl(searchControl);
