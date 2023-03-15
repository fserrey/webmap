const rasterLayer1 = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });
  
  const rasterLayer2 = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
      visible: false, // Agrega esta línea para ocultar inicialmente la segunda capa raster
    }),
  });
  
  const pointFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.7038, 40.4168])),
  });
  
  const vectorLayerPoints = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [pointFeature],
    }),
  });
  
  const lineFeature = new ol.Feature({
    geometry: new ol.geom.LineString([
      ol.proj.fromLonLat([-3.7038, 40.4168]),
      ol.proj.fromLonLat([-3.6891, 40.4256]),
    ]),
  });
  
  const vectorLayerLines = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [lineFeature],
    }),
  });
  
  const map = new ol.Map({
    target: "map",
    layers: [rasterLayer1, rasterLayer2, vectorLayerPoints, vectorLayerLines],
    view: new ol.View({
      center: ol.proj.fromLonLat([-3.7038, 40.4168]),
      zoom: 12,
    }),
  });
  
  // Ajustar el mapa al área del municipio
  const extent = ol.proj.transformExtent(
    [-3.8890, 40.3120, -3.5180, 40.6439],
    "EPSG:4326",
    "EPSG:3857"
  );
  map.getView().fit(extent, { size: map.getSize() });
  