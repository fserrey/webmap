d3.csv("puntos.csv").then(function (data) {
    const pointsData = data.map(function (d) {
        return {
            name: d.nombre,
            longitude: parseFloat(d.longitude),
            latitude: parseFloat(d.latitude),
        };
    });

    const osmLayer = new ol.layer.Tile({
        title: "OpenStreetMap",
        type: "base",
        source: new ol.source.OSM(),
    });

    const stamenWatercolorLayer = new ol.layer.Tile({
        title: "Capa de acuarela",
        type: "base",
        source: new ol.source.Stamen({ layer: "watercolor" }),
    });

    const stamenTerrainLayer = new ol.layer.Tile({
        title: "Capa topográfica",
        type: "base",
        source: new ol.source.Stamen({ layer: "terrain" }),
    });

    const pointsLayer = new ol.layer.Vector({
        title: "Parques más conocidos de Madrid",
        source: new ol.source.Vector({
            features: pointsData.map(function (point) {
                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([point.longitude, point.latitude])
                    ),
                    name: point.name,
                });
                return feature;
            }),
        }),
        style: function (feature) {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({ color: "red" }),
                    stroke: new ol.style.Stroke({
                        color: "white",
                        width: 2,
                    }),
                }),
                text: new ol.style.Text({
                    font: "12px Calibri,sans-serif",
                    fill: new ol.style.Fill({ color: "#000" }),
                    stroke: new ol.style.Stroke({
                        color: "#fff",
                        width: 3,
                    }),
                    offsetY: 15,
                    text: feature.get("name"),
                }),
            });
        },
    });

    const lineLayer = new ol.layer.Vector({
        title: "Gran Vía",
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.LineString([
                        ol.proj.fromLonLat([-3.6967385, 40.4189036]),
                        ol.proj.fromLonLat([-3.7005150, 40.4199572]),
                        ol.proj.fromLonLat([-3.7060511, 40.4203411]),
                        ol.proj.fromLonLat([-3.7109005, 40.4233795]),
                    ]),
                }),
            ],
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#ffcc33",
                width: 3,
            }),
        }),
    });

    const polygonLayer = new ol.layer.Vector({
        title: "Parque del Retiro",
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Polygon([
                        [
                            ol.proj.fromLonLat([-3.6884880, 40.4198021]),
                            ol.proj.fromLonLat([-3.6884451, 40.4079084]),
                            ol.proj.fromLonLat([-3.6866426, 40.4076143]),
                            ol.proj.fromLonLat([-3.6859989, 40.4086926]),
                            ol.proj.fromLonLat([-3.6818790, 40.4089214]),
                            ol.proj.fromLonLat([-3.6787033, 40.4083659]),
                            ol.proj.fromLonLat([-3.6766434, 40.4112414]),
                            ol.proj.fromLonLat([-3.6802912, 40.4213703]),
                            ol.proj.fromLonLat([-3.6885309, 40.4197694])
                        ],
                    ]),
                }),
            ],
        }),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(0, 255, 0, 0.1)",
            }),
            stroke: new ol.style.Stroke({
                color: "green",
                width: 2,
            }),
        }),
    });

    const map = new ol.Map({
        target: "map",
        layers: [
            osmLayer,
            stamenWatercolorLayer,
            stamenTerrainLayer,
            pointsLayer,
            lineLayer,
            polygonLayer,
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-3.7037902, 40.4167754]),
            zoom: 12,
        }),
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false,
            },
        }).extend([new ol.control.LayerSwitcher(), new ol.control.FullScreen(), new ol.control.OverviewMap()]),
    });

    const popupContainer = document.getElementById("popup");
    const popupCloser = document.createElement("a");
    popupCloser.href = "#";
    popupCloser.className = "ol-popup-closer";
    popupCloser.onclick = function () {
        overlay.setPosition(undefined);
        popupCloser.blur();
        return false;
    };
    popupContainer.appendChild(popupCloser);

    const popupContent = document.createElement("div");
    popupContent.className = "ol-popup-content";
    popupContainer.appendChild(popupContent);

    const overlay = new ol.Overlay({
        element: popupContainer,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });
    map.addOverlay(overlay);

    map.on("click", function (evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });

        if (feature && feature.getGeometry().getType() === "Point") {
            const coordinate = evt.coordinate;
            const name = feature.get("name");
            const lonLat = ol.proj.toLonLat(coordinate).map((c) => c.toFixed(6)).join(", ");
            popupContent.innerHTML = `<p><strong>${name}</strong></p><p>Coordinates: ${lonLat}</p>`;
            overlay.setPosition(coordinate);
        } else {
            overlay.setPosition(undefined);
            popupCloser.blur();
        }
    });
});