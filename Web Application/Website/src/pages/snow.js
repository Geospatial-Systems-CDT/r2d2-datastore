import grid from '../components/grid-layout';
import {mapPanel} from '../components/dashboard-panels';
import { var2col, hex2rgb, usePageTitle } from '../util';
import fetch from 'sync-fetch';

import { generalLayers, generalLayerGroups } from '../data/layers-general';

import gritPrio1 from '../data/snow/Gritting_Priority1.geojson';
import gritPrio2 from '../data/snow/Gritting_Priority2.geojson';
import accSlightRaw from '../data/snow/gdf_Slight_Accidents.csv';
import accSeriousRaw from '../data/snow/gdf_Serious_Accidents.csv';
import accFatalRaw from '../data/snow/gdf_Fatal_Accidents.csv';
import trafficAcc from '../data/snow/kde_poly_4326.geojson';
import gritRouteAll from '../data/snow/Gritting_Route_Northumberland.geojson';
import roadBetweenness from '../data/snow/Road_Betweenness_Centrality.geojson';
import roadCloseness from '../data/snow/Road_Closeness_Centrality.geojson';
import resilience from '../data/snow/resilience.geojson';
import vulBfte from '../data/snow/vulnerability_bfte.geojson';
import vulDarcy from '../data/snow/vulnerability_darcy.geojson';
import vulSocioEco from '../data/snow/vulnerability_socio_eco.geojson';
import trafficCamCsv from '../data/snow/Traffic_Cameras_Loc.csv';
import snowDarcy from '../data/snow/darcy_snow_cover.geojson';
import snowBfte from '../data/snow/bfte_snow_cover.geojson';



const accSlight = csv2geo(accSlightRaw, "slight-accidents");
const accSerious = csv2geo(accSeriousRaw, "serious-accidents");
const accFatal = csv2geo(accFatalRaw, "fatal-accidents");
const trafficCam = csv2geo(trafficCamCsv, "traffic-cameras");

const MAP_POS = [-1.614719930296475, 54.981289410326994];

// (This is a server Luis rents, can be moved elsewhere later maybe)
const ODK_PROXY_URL = "https://odk-proxy.itsonlyluis.com";
var formData = fetch(ODK_PROXY_URL + "/issue-layer/snow").json();

const mapLayers = [
    ...generalLayers,
    {
        id: 'road-between',
        name: "Road Betweenness",
        layerGroup: "road-between",
        colour: hex2rgb("#39CCCC", 255),
        data: roadBetweenness,
        lineWidth: 4,
        tooltip: "<p><b>Road Betweenness</b></p><p>{{properties.ref}} {{properties.name}}</p><p>{{properties.maxspeed}}</p>",
        legend: {
            type: 'line',
            color: hex2rgb("#39CCCC", 255),
            group: "road-betw"
        }
    },
    {
        id: 'road-closeness',
        name: "Road Closeness",
        layerGroup: "road-close",
        colour: hex2rgb("#0074D9", 255),
        data: roadCloseness,
        lineWidth: 4,
        tooltip: "<p><b>Road Closeness</b></p><p>{{properties.ref}} {{properties.name}}</p><p>{{properties.maxspeed}}</p>",
        legend: {
            type: 'line',
            color: hex2rgb("#0074D9", 255),
            group: "road-close"
        }
    },
    {
        id: 'grit-all',
        name: "Northumberland Gritting Routes",
        layerGroup: "grit-all",
        colour: hex2rgb("#85144b", 255),
        data: gritRouteAll,
        tooltip: "<p><b>Gritting Route</b></p><p>Depot: {{properties.DEPOT}}</p><p>Route: {{properties.ROUTE}}</p>",
        legend: {
            type: 'line',
            color: hex2rgb("#85144b", 255),
            group: "grit-all"
        }
    },
    {
        id: 'grit-1',
        name: "Priority 1 Gritting Routes",
        layerGroup: "grit-prio",
        colour: hex2rgb("#F012BE", 255),
        lineWidth: 2,
        data: gritPrio1,
        tooltip: "<p><b>Gritting Route</b></p><p>Priority 1</p>",
        legend: {
            type: 'line',
            color: hex2rgb("#f012be", 255),
            group: "grit-prio-1"
        }
    },
    {
        id: 'grit-2',
        name: "Priority 2 Gritting Routes",
        layerGroup: "grit-prio",
        colour: hex2rgb("#B10DC9", 255),
        data: gritPrio2,
        tooltip: "<p><b>Gritting Route</b></p><p>Priority 2</p>",
        legend: {
            type: 'line',
            color: hex2rgb("#b10dc9", 255),
            group: "grit-prio-2"
        }
    },
    {
        id: 'acc-slight',
        name: "Slight Accidents",
        layerGroup: "acc",
        colour: hex2rgb("#FFDC00", 255),
        data: accSlight,
        tooltip: "<p><b>Slight Accident</b></p><p>Date: {{properties.Date}}</p><p>Road Conditions: {{properties.Road_Surface_Conditions}}</p><p>Weather Conditions: {{properties.Weather_Conditions}}</p>",
        legend: {
            type: 'point',
            color: hex2rgb("#ffdc00", 255),
            group: "acc-slight"
        }
    },
    {
        id: 'acc-serious',
        name: "Serious Accidents",
        layerGroup: "acc",
        colour: hex2rgb("#FF851B", 255),
        data: accSerious,
        tooltip: "<p><b>Serious Accident</b></p><p>Date: {{properties.Date}}</p><p>Road Conditions: {{properties.Road_Surface_Conditions}}</p><p>Weather Conditions: {{properties.Weather_Conditions}}</p>",
        legend: {
            type: 'point',
            color: hex2rgb("#ff851b", 255),
            group: "acc-serious"
        }
    },
    {
        id: 'acc-fatal',
        name: "Fatal Accidents",
        layerGroup: "acc",
        colour: hex2rgb("#FF4136", 255),
        data: accFatal,
        tooltip: "<p><b>Fatal Accident</b></p><p>Date: {{properties.Date}}</p><p>Road Conditions: {{properties.Road_Surface_Conditions}}</p><p>Weather Conditions: {{properties.Weather_Conditions}}</p>",
        legend: {
            type: 'point',
            color: hex2rgb("#ff4136", 255),
            group: "acc-fatal"
        }
    },
    {
        id: 'car-crashes',
        name: "Traffic Accidents",
        layerGroup: "car-crashes",
        tooltip: "<div><p><b>Traffic accidents</b></p><p>Risk Level: {{properties.MaxClass}}</p><p></p></div>",
        colour: (obj, info) => {
            const col = obj.properties.MaxClass;
            if(col === 1) { return [254, 229, 217, 128]; }
            if(col === 2) { return [252, 174, 145, 128]; }
            if(col === 3) { return [251, 106, 74, 128]; }
            if(col === 4) { return [222, 45, 38, 128]; }
            if(col === 5) { return [165, 15, 21, 128]; }
            return [255, 255, 255, 128]
        },
        data: trafficAcc,
        legend: {
            type: 'poly',
            color: [251, 106, 74, 128],
            group: "car-crashes"
        }
    },
    {
        id: 'resilience',
        name: "Resilience",
        layerGroup: "resilience",
        colour: (obj, info) => {
            switch(obj.properties.resilience_level) {
                case "Very Low": return hex2rgb('#d90000')
                case "Low": return hex2rgb('#e05300')
                case "Medium": return hex2rgb('#e37f00')
                case "High": return hex2rgb('#e0a702')
                case "Very High": return hex2rgb('#8cde37')
            }
        },
        data: resilience,
        tooltip: "<p><b>{{properties.resilience_level}} Resilience</b></p>",
        legend: {
            type: 'poly',
            color: hex2rgb("#e37f00", 255),
            group: "resilience"
        }
    },
    {
        id: 'vuln-bfte',
        name: "Vulnerabilty - BFTE",
        layerGroup: "vuln-bfte",
        data: vulBfte,
        tooltip: "<p><b>{{properties.vulnerability_level}} Vulnerability</b></p>",
        colour: (obj, info) => {
            switch(obj.properties.vulnerability_level) {
                case "Very High": return hex2rgb('#d90000')
                case "High": return hex2rgb('#e05300')
                case "Medium": return hex2rgb('#e37f00')
                case "Low": return hex2rgb('#e0a702')
                case "Very Low": return hex2rgb('#8cde37')
            }
        },
        legend: {
            type: 'poly',
            color: hex2rgb("#e37f00", 255),
            group: "vuln"
        }
    },
    {
        id: 'vuln-darcy',
        name: "Vulnerabilty - Storm Darcy",
        layerGroup: "vuln-darcy",
        data: vulDarcy,
        tooltip: "<p><b>{{properties.vulnerability_level}} Vulnerability</b></p>",
        colour: (obj, info) => {
            switch(obj.properties.vulnerability_level) {
                case "Very High": return hex2rgb('#d90000')
                case "High": return hex2rgb('#e05300')
                case "Medium": return hex2rgb('#e37f00')
                case "Low": return hex2rgb('#e0a702')
                case "Very Low": return hex2rgb('#8cde37')
            }
        },
        legend: {
            type: 'poly',
            color: hex2rgb("#e37f00", 255),
            group: "vuln"
        }
    },
    {
        id: 'vuln-socio-eco',
        name: "Vulnerabilty - Socio/Economic",
        layerGroup: "vuln-socio-eco",
        data: vulSocioEco,
        tooltip: "<p><b>{{properties.vulnerability_level}} Vulnerability</b></p>",
        colour: (obj, info) => {
            switch(obj.properties.vulnerability_level) {
                case "Very High": return hex2rgb('#d90000')
                case "High": return hex2rgb('#e05300')
                case "Medium": return hex2rgb('#e37f00')
                case "Low": return hex2rgb('#e0a702')
                case "Very Low": return hex2rgb('#8cde37')
            }
        },
        legend: {
            type: 'poly',
            color: hex2rgb("#e37f00", 255),
            group: "vuln"
        }
    },
    {
        id: 'form-data',
        name: "Public Reports",
        layerGroup: "issues",
        colour: var2col("--theme-feature-user-note"),
        data: formData,
        tooltip: "<div><p><b>Note added on {{dateClean}}</b></p><p>Urgency: {{urgency}}</p><p>{{files.comment}}</p></div>",
        pointRadius: (item) => {
            const r = item.geometry.properties.accuracy;
            return r === undefined ? 5 : r;
        },
        onClick: (item) => {
            const note = item.object;
            const when = new Date(note.__system.submissionDate);
            var detailHtml = `<p><b>Issue reported at ${when.toLocaleString()}</b></p>`;
            var photoHtml = ``;
            if(note.files.comment !== null) {
                detailHtml += `<p>${note.files.comment}</p>`;
            }
            if(note.files.photo !== null) {
                photoHtml += `<img src="${ODK_PROXY_URL}${note.files.photo}" alt="User-uploaded image"/>`
                detailHtml += `<p><a href="${ODK_PROXY_URL}${note.files.photo}">Full-size photo</a></p>`;
            }
            if(note.files.file !== null) {
                detailHtml += `<p><a href="${ODK_PROXY_URL}${note.files.file}">Attached file</a></p>`;
            }
            document.querySelector("#map-detail").innerHTML = `<div>${detailHtml}</div>${photoHtml}`;
        },
        legend: {
            type: 'point',
            color: var2col("--theme-feature-user-note"),
            group: "form-data"
        }
    },
    {
        id: 'traffic-cams',
        name: "Road Traffic Cameras",
        layerGroup: "traffic-cams",
        data: trafficCam,
        tooltip: "<p><b>Road Traffic Camera</b></p><p>{{properties.Location_Description}}</p>",
        colour: (obj, info) => {
            obj.properties.Location_Description = obj.properties.Location_Description.replace(/['"\r]/g, '').trim();
            return [192, 192, 0, 128]
        },
        onClick: (item) => {
            const obj = item.object;
            var detailHtml = `<p><b>Road Traffic Camera</b></p><p>${obj.properties.Location_Description}</p>`;
            var photoHtml = ``;
            photoHtml += `<img src="/data/traffic/${obj.properties.Camer_Code}.jpg" alt="Photo from a road traffic camera"/>`
            detailHtml += `<p><a href="/data/traffic/${obj.properties.Camer_Code}.jpg">Full-size photo</a></p>`;
            document.querySelector("#map-detail").innerHTML = `<div>${detailHtml}</div>${photoHtml}`;
        },
        legend: {
            type: 'point',
            color: [192, 192, 0, 128],
            group: "traffic-cams"
        }
    },
    {
        id: 'snow-bfte',
        name: "Snow Cover - BFTE",
        layerGroup: "snow-cover-bfte",
        colour: [192, 192, 192, 128],
        data: snowBfte,
        tooltip: "<p><b>Snow Cover - BFTE</b></p>",
        legend: {
            type: 'poly',
            color: [192, 192, 192, 128],
            group: "snow-cover"
        }
    },
    {
        id: 'snow-darcy',
        name: "Snow Cover - Storm Darcy",
        layerGroup: "snow-cover-darcy",
        colour: [192, 192, 192, 128],
        data: snowDarcy,
        tooltip: "<p><b>Snow Cover - Storm Darcy</b></p>",
        legend: {
            type: 'poly',
            color: [192, 192, 192, 128],
            group: "snow-cover"
        }
    },
    {
        id: 'surface-temp-bfte',
        name: "BFTE Surface Temperature",
        layerGroup: "surface-temp-bfte",
        type: 'bitmap',
        bounds: [-2.75, 54.449999999999996, -0.75, 55.849999999999994],
        image: '/data/snow/bfte_era5_surface_temp.jpg',
    },
]

const layerGroups = [
    ...generalLayerGroups,
    {
        id: "grit-prio",
        label: "Priority Gritting Routes",
        default: false,
    },
    {
        id: "grit-all",
        label: "Northumberland Gritting Routes",
        default: false,
    },
    {
        id: "road-between",
        label: "Road Betweenness",
        default: false,
    },
    {
        id: "road-close",
        label: "Road Closeness",
        default: false,
    },
    {
        id: "acc",
        label: "Accidents",
        default: false,
    },
    {
        id: "car-crashes",
        label: "Traffic Accidents",
        default: false,
    },
    {
        id: 'resilience',
        label: "Resilience",
        default: true,
    },
    {
        id: 'vuln-bfte',
        label: "Vulnerability - BFTE",
        default: false,
    },
    {
        id: 'vuln-darcy',
        label: "Vulnerability - Storm Darcy",
        default: false,
    },
    {
        id: 'vuln-socio-eco',
        label: "Vulnerability - Socio/Economic",
        default: false,
    },
    {
        id: 'traffic-cams',
        label: "Road Traffic Cameras",
        default: false,
    },
    {
        id: 'snow-cover-bfte',
        label: "Snow Cover Map (BFTE)",
        default: false,
    },
    {
        id: 'snow-cover-darcy',
        label: "Snow Cover Map (Storm Darcy)",
        default: false,
    },
    {
        id: 'surface-temp-bfte',
        label: "Surface Temperature (BFTE)",
        default: false,
    }
]

function Snow() {
    usePageTitle("Low Temperature & Heavy Snow");

    return [
        <div className="page theme-snow">
            <h1>Low Temperature & Heavy Snow</h1>

            {grid([
                mapPanel(mapLayers, layerGroups, MAP_POS, 9, 6, 4),
            ])}

        </div>
    ];
}
export default Snow;






function csv2geo(csv, name) {
    const lines = fetch(csv).text().split("\n");

    var json = [];
    const columns = lines.shift().split(",");
    for (const _line of lines) {
        const line = _line.split(",");
        var ele = {}
        for (let i = 0; i < columns.length; i++) {
            ele[columns[i].trim().replace(/\s/g, "_")] = line[i];
            json.push(ele);
        }
    }

    var geo = {
        type: "FeatureCollection",
        name: name,
        crs: { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        features: [],
    }

    for (const item of json) {
        geo.features.push({
            properties: item,
            geometry: {
                type: "Point",
                coordinates: [+item["Longitude"], +item["Latitude"]]
            }
        })
    }

    return geo;
}