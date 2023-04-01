import { Map } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, BitmapLayer } from '@deck.gl/layers';
import { ScreenGridLayer, HeatmapLayer } from '@deck.gl/aggregation-layers';
import { var2col, hex2rgb, randHash } from '../../util';
import { useState } from 'react';
import template from 'just-template';
import React from 'react';
import GL from '@luma.gl/constants';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const MAPBOX_ACCESS_TOKEN = "please insert actual mapbox token";// removed due to sensitivity;

window.setLayerGroupVisibility = (group, visibility) => {
    var _l = {};
    for (const id in window.visibleLayers) { _l[id] = window.visibleLayers[id]; }
    _l[group] = visibility;
    window.setVisibleLayers(_l);
}

function toggleLayer(e) {
    window.setLayerGroupVisibility(e.target.id, e.target.checked);
}

function onViewChange({ viewState, interactionState, oldViewState }) {
    window._center = { lat: viewState.latitude, lon: viewState.longitude }
    window._zoom = viewState.zoom;
}

function onMove(info) {
    const viewCentre = info.coordinate;
    const viewNW = info.viewport.unproject([0, 0], { topLeft: true })
    const viewSE = info.viewport.unproject([info.viewport.width, info.viewport.height], { topLeft: true })
    // console.log({
    //     view: {
    //         north_west: viewNW,
    //         south_east: viewSE,
    //         centre: viewCentre,
    //     }
    // })
}

/**
 * Generates a tooltip when hovering over a layer. This is formatted from the layer's template for the specific object in question
 * @returns The tooltip text. This can also be rich HTML
 */
function getTooltip(e) {
    if (e.layer != null && e.object != null) {
        if (e.layer.props.tooltip !== undefined) {
            return { html: template(e.layer.props.tooltip, e.object) }
        } else {
            return { html: e.layer.props.layerName };
        }
    };

    return null;
}

/**
 * Determines the colour of a map layer
 * @param clr The colour parameter to parse. Can be either an [R,G,B,(A)] array, a hex colour in the format #RRGGBB, a CSS variable starting with --, or a callback
 * @param layer The layer this is being applied to
 */
function parseColour(clr) {
    if (typeof clr === "function") { return clr; }
    if (typeof clr === "string") {
        if (clr.startsWith("#")) { return hex2rgb(clr); }
        if (clr.startsWith("--")) { return var2col(clr); }
    }
    return clr;
}

/**
 * Creates a basic map view, consisting of a number of layers
 * @param layers  An Object containing layer info. Requires `id`, `colour`, and `data`
 * @param pos     The initial position of the map, as a [lon, lat]
 * @param defZoom The initial zoom of the map. Default to 12
 * @param width   The default width of the map on the grid. Defaults to 4 blocks
 * @param height  The default height of the map on the grid. Defaults to 5 blocks
 */
function MapPanel(layers, layerGroups, pos, defZoom = 12, width = 6, height = 5) {
    var _layers = [];

    var _defLayerVisibilities = {};
    var visibleLayerToggles = [];
    for (const group of layerGroups) {
        _defLayerVisibilities[group.id] = (window.visibleLayers !== undefined) ? (window.visibleLayers[group.id] || false) : group.default;

        visibleLayerToggles.push(
            <li key={`layer-toggle-${group.id}`}><input id={group.id} type={'checkbox'} defaultChecked={_defLayerVisibilities[group.id]} onChange={toggleLayer} />{group.label}</li>
        )
    }

    const initCenter = {
        lon: (window._center !== undefined) ? window._center.lon : pos[0],
        lat: (window._center !== undefined) ? window._center.lat : pos[1],
    }
    const [center, setCenter] = useState(initCenter);
    window.setMapCenter = setCenter;

    const [zoom, setZoom] = useState((window._zoom !== undefined) ? window._zoom : defZoom);
    window.setMapZoom = setZoom;

    const [visibleLayers, setVisibleLayers] = useState(_defLayerVisibilities);
    window.visibleLayers = visibleLayers;
    window.setVisibleLayers = setVisibleLayers;

    var INITIAL_VIEW_STATE = {
        longitude: (window._center !== undefined) ? window._center.lon : pos[0],
        latitude: (window._center !== undefined) ? window._center.lat : pos[1],
        zoom: (window._zoom !== undefined) ? window._zoom : defZoom,
        pitch: 0,
        bearing: 0
    }

    for (const layer of layers) {
        if (layer.type === undefined) { layer.type = "geojson" }

        /* GeoJSON data sources */
        if (layer.type === "geojson") {
            _layers.push(
                new GeoJsonLayer({
                    id: layer.id,
                    layerName: layer.name,
                    data: layer.data,
                    tooltip: layer.tooltip,
                    filled: (layer.filled == null) ? true : layer.filled,
                    pointRadiusMinPixels: 5,
                    pointRadiusScale: 1,
                    getPointRadius: (layer.pointRadius == null) ? 5 : layer.pointRadius,
                    getFillColor: parseColour(layer.colour),
                    getLineColor: parseColour(layer.colour),
                    getLineWidth: (layer.lineWidth == null) ? 1 : layer.lineWidth,
                    lineWidthUnits: "pixels",
                    pickable: true,
                    autoHighlight: true,
                    onClick: layer.onClick,
                    visible: visibleLayers[layer.layerGroup],
                    legend: layer.legend,
                })
            )
        }

        /* Bitmap data sources */
        if (layer.type === "bitmap") {
            _layers.push(
                new BitmapLayer({
                    id: layer.id,
                    layerName: layer.name,
                    bounds: layer.bounds,
                    image: layer.image,
                    pickable: true,
                    onClick: layer.onClick,
                    visible: visibleLayers[layer.layerGroup],
                    textureParameters: {
                        [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
                        [GL.TEXTURE_MAG_FILTER]: GL.NEAREST
                    },
                    legend: layer.legend,
                })
            )
        }

        /* Heatmap data source */
        if (layer.type === "heatmap") {
            var _data = layer.data;
            _layers.push(
                new ScreenGridLayer({
                    id: layer.id,
                    _data,
                    // opacity: 0.75,
                    // colorRange: [[255, 0, 0, 255], [255, 0, 255, 255]],
                    cellSizePixels: 50,
                    pickable: true,
                    getPosition: d => d.COORDINATES,
                    getWeight: d => d.WEIGHT,
                    aggregation: 'SUM',
                    visible: visibleLayers[layer.layerGroup],
                    legend: layer.legend,
                })
            )
        }

        window.mapLayers = _layers;
    }

    var legendHtml = [];
    var legendTop = [];
    var legendIncluded = [];
    for (const layer of _layers) {
        if(layer.props.visible && layer.props.legend != undefined) {
            const legend = layer.props.legend;

            if(legend.type === "poly" || legend.type === "point" || legend.type === "line") {

                if(legendIncluded.includes(legend.group)) { continue; }
                legendIncluded.push(legend.group);

                const _c = legend.color;
                const markerColour = `rgba(${_c[0]}, ${_c[1]}, ${_c[2]}, ${_c[3] / 255})`;
                legendHtml.push(
                    <p>
                        <span
                            className="legend-marker"
                            legendtype={legend.type}
                            style={{"--marker-colour": markerColour}}>
                        </span>
                        {layer.props.layerName}
                    </p>)
            }
            else if(legend.type === "bivar") {
                if(legendIncluded.includes(legend.group)) { continue; }
                legendIncluded.push(legend.group);

                var n = 0;
                legendTop.push(
                    <p>
                        <div
                            className="legend-bivar"
                            legendtype={legend.type}>

                            <span className="x-label">{legend.x.label}</span>
                            <span className="y-label">{legend.y.label}</span>
                            {legend.scheme.map((clr) => {
                                return <span style={{background: clr, "grid-area": "c" + (n++)}}></span>
                            })}
                        </div>
                    </p>)
            }
        }
    }


    return {
        className: 'movebar',
        params: { i: "map-" + randHash(), w: width, h: height, minW: 2, minH: 2 },
        render: <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={_layers}
            width='100%'
            height='100%'
            onDragEnd={(info, event) => { onMove(info); }}
            getTooltip={getTooltip}
            onWebGLInitialized={(gl) => { window.gl = gl }}
            onViewStateChange={onViewChange}
        >

            <ul className='layer-toggle'><i className="fa fa-fw fa-bars"></i>{visibleLayerToggles}</ul>
            <div id="map-detail"></div>
            <p className="map-epoch">{new Date().toISOString().replace("T", " ").split(".")[0]}</p>
            <div id="map-legend">{legendTop}{legendHtml}</div>

            <Map
                ref={e => { window.map = e; }}
                reuseMaps
                mapStyle={MAP_STYLE}
                preventStyleDiffing={true}
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                attributionControl={false}
            />
        </DeckGL>
    }
}

export default MapPanel;