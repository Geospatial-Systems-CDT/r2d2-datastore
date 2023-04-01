import grid from '../components/grid-layout';
import {mapPanel} from '../components/dashboard-panels';
import { getRiskColour, var2col, hex2rgb, usePageTitle } from '../util';
import DataGridPanel from '../components/panels/panel-datagrid';
import fetch from 'sync-fetch';

import { generalLayers, generalLayerGroups } from '../data/layers-general';

import demoData from '../data/fire/fire-dummy.json';
import humanVul from '../data/fire/HumanVul-84-simple.json';
import enviroVul from '../data/fire/EnvVul-84-simple.json';
import highAgri from '../data/fire/VeryHighAgri-84.geojson';
import highUrban from '../data/fire/VeryHighUrban-84.geojson';
import change_1 from '../data/fire/epoch_1_poly.geojson';
import change_2 from '../data/fire/epoch_2_poly.geojson';
import change_3 from '../data/fire/epoch_3_poly.geojson';



const MAP_POS = [-1.635681, 54.976958];

// const bivarScheme = ["#d3d3d3", "#70a2cd", "#006ac5", "#db9591", "#74728c", "#004b87", "#e83b31", "#7b2d30", "#001e2e"]; // Red-Blue = Blackish
// const bivarScheme = ["#c0c0c0", "#b077b9", "#990bae", "#82b988", "#777383", "#680b7c", "#28b137", "#256e35", "#200a32"]; // Purple-Green = navy
const bivarScheme = ["#c0c0c0", "#b077b9", "#990bae", "#cd9f77", "#bc6272", "#a4096c", "#dd7317", "#cb4717", "#b10715"]; // Orange-Purple = Red

// (This is a server Luis rents, can be moved elsewhere later maybe)
const ODK_PROXY_URL = "https://odk-proxy.itsonlyluis.com";
var formData = fetch(ODK_PROXY_URL + "/issue-layer/fire").json();

var demoDataGeoJson = {
    type: "FeatureCollection",
    name: "Permitted_Waste_Sites_Authorised_Landfill_Site_Boundaries",
    crs: { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    features: [],
}
for (const site of demoData) { site.type = "Feature"; demoDataGeoJson.features.push(site); }

const mapLayers = [
    ...generalLayers,
    // {
    //     id: 'demo-sat-2016',
    //     name: "Digimap (2016-05-06)",
    //     type: 'bitmap',
    //     bounds: [-1.530292, 55.194367, -1.514475, 55.203291],
    //     image: '/data/2016.jpg',
    // },
    {
        id: 'demo-sat-2020',
        name: "Digimap (2020-04-23)",
        layerGroup: "satimg",
        type: 'bitmap',
        bounds: [-1.530292, 55.194367, -1.514475, 55.203291],
        image: '/data/2020.jpg',
    },
    {
        id: 'legal-waste-sites',
        name: "Legal Waste Sites",
        layerGroup: "legal",
        colour: (obj, info) => { return hex2rgb(getRiskColour(obj.area), 128) },
        data: demoDataGeoJson,
        tooltip: "<div><p><b>{{name}}</b></p><p>Priority: {{rank}}</p><p>Area: {{area}}</p></div>",
        onClick: (item) => {
            if (item.object) {
                const newPos = {
                    lon: item.object.centroid.coordinates[0],
                    lat: item.object.centroid.coordinates[1],
                }
                window.setMapCenter(newPos);
                window.setMapZoom(13.5);
                window.setSelectedSite(item.object.uuid);
            }
        },
        legend: {
            type: 'line',
            color: var2col("--theme-risk-5"),
            group: "legal-waste-sites"
        }
    },
    {
        id: 'change-1',
        name: "Change Detection",
        layerGroup: "change",
        tooltip: "<div><p><b>Change Detection</b></p><p>Epoch 1</p><p>{{change}} change</p></div>",
        colour: (obj, info) => {
            const col = obj.properties.gridcode;
            obj.change = (col === 1) ? "Positive" : ((col === 2) ? "Negative" : "Indefinite")
            if(col === 1) { return hex2rgb("#ff4136"); }
            if(col === 2) { return hex2rgb("#7fdbff"); }
            if(col === 3) { return hex2rgb("#ffdc00"); }
            return [255, 255, 255, 128]
        },
        data: change_1,
        legend: {
            type: 'poly',
            color: hex2rgb("#7fdbff"),
            group: "change"
        }
    },
    {
        id: 'change-2',
        name: "Change Detection",
        layerGroup: "change",
        tooltip: "<div><p><b>Change Detection</b></p><p>Epoch 2</p><p>{{change}} change</p></div>",
        colour: (obj, info) => {
            const col = obj.properties.gridcode;
            obj.change = (col === 1) ? "Positive" : ((col === 2) ? "Negative" : "Indefinite")
            if(col === 1) { return hex2rgb("#ff4136"); }
            if(col === 2) { return hex2rgb("#7fdbff"); }
            if(col === 3) { return hex2rgb("#ffdc00"); }
            return [255, 255, 255, 128]
        },
        data: change_2,
        legend: {
            type: 'poly',
            color: hex2rgb("#7fdbff"),
            group: "change"
        }
    },
    {
        id: 'change-3',
        name: "Change Detection",
        layerGroup: "change",
        tooltip: "<div><p><b>Change Detection</b></p><p>Epoch 3</p><p>{{change}} change</p></div>",
        colour: (obj, info) => {
            const col = obj.properties.gridcode;
            obj.change = (col === 1) ? "Positive" : ((col === 2) ? "Negative" : "Indefinite")
            if(col === 1) { return hex2rgb("#ff4136"); }
            if(col === 2) { return hex2rgb("#7fdbff"); }
            if(col === 3) { return hex2rgb("#ffdc00"); }
            return [255, 255, 255, 128]
        },
        data: change_3,
        legend: {
            type: 'poly',
            color: hex2rgb("#7fdbff"),
            group: "change"
        }
    },
    {
        id: 'very-high-agri',
        name: "Very High Risk - Agriculture",
        layerGroup: "very-high",
        colour: [0, 128, 0, 128],
        data: highAgri,
        legend: {
            type: 'poly',
            color: [0, 128, 0, 128],
            group: "high-agri"
        }
    },
    {
        id: 'very-high-urban',
        name: "Very High Risk - Urban",
        layerGroup: "very-high",
        colour: [0, 0, 128, 128],
        data: highUrban,
        legend: {
            type: 'poly',
            color: [0, 0, 128, 128],
            group: "high-urban"
        }
    },
    {
        id: 'vuln-human',
        name: "Human Vulnerabilities",
        layerGroup: "vuln-human",
        tooltip: "<div><p><b>Human Vulnerability</b></p><p>LSOA: {{properties.LSOA21NM}}</p><p>Resilience: {{res}}</p><p>Vulnerability: {{vul}}</p></div>",
        colour: (obj, info) => {
            const yThresholds = [1, 1];
            const xThresholds = [50.100165, 100.787993];
            const _y = obj.properties["Count of Points"];
            const _x = obj.properties["SUM_PercentArea"];
            const y = (_y < yThresholds[0] ? 0 : (_y < yThresholds[1] ? 1 : 2));
            const x = (_x < xThresholds[0] ? 0 : (_x < xThresholds[1] ? 1 : 2));
            obj.vul = (x === 0 ? "Low" : (x === 1 ? "Medium" : "High"));
            obj.res = (y === 2 ? "Low" : (y === 1 ? "Medium" : "High"));
            const hex = bivarScheme[x + (3 * y)];
            return hex2rgb(hex);
        },
        data: humanVul,
        legend: {
            type: 'bivar',
            scheme: bivarScheme,
            x: {
                label: "Vulnerability",
                inverse: true
            },
            y: {
                label: "Resilience",
            },
            group: "vuln-bivar"
        }
    },
    {
        id: 'vuln-env',
        name: "Environment Vulnerabilities",
        layerGroup: "vuln-env",
        tooltip: "<div><p><b>Environmental Vulnerability</b></p><p>LSOA: {{properties.LSOA21NM}}</p><p>Resilience: {{res}}</p><p>Vulnerability: {{vul}}</p></div>",
        colour: (obj, info) => {
            const yThresholds = [20.28, 50.24];
            const xThresholds = [50.100165, 100.787993];
            const _y = obj.properties["%Area"];
            const _x = obj.properties["SUM_PercentArea"];
            const y = (_y < yThresholds[0] ? 0 : (_y < yThresholds[1] ? 1 : 2));
            const x = (_x < xThresholds[0] ? 0 : (_x < xThresholds[1] ? 1 : 2));
            obj.vul = (x === 0 ? "Low" : (x === 1 ? "Medium" : "High"));
            obj.res = (y === 2 ? "Low" : (y === 1 ? "Medium" : "High"));
            const hex = bivarScheme[x + (3 * y)];
            return hex2rgb(hex);
        },
        data: enviroVul,
        legend: {
            type: 'bivar',
            scheme: bivarScheme,
            x: {
                label: "Vulnerability",
                inverse: true
            },
            y: {
                label: "Resilience",
            },
            group: "vuln-bivar"
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
]

const layerGroups = [
    ...generalLayerGroups,
    {
        id: "satimg",
        label: "Satellite Images",
        default: false,
    },
    {
        id: "vuln-human",
        label: "Human Vulnerabilities",
        default: true,
    },
    {
        id: "vuln-env",
        label: "Environmental Vulnerabilities",
        default: false,
    },
    {
        id: "very-high",
        label: "High Probability Areas",
        default: false,
    },
    {
        id: "legal",
        label: "Known Waste Sites",
        default: false,
    },
    {
        id: "change",
        label: "Change Detection",
        default: false,
    },
]

const columns = [
    {
        id: "name",
        label: "Name",
        width: 4,
    },
    {
        id: "area",
        label: "Area (sq. m)",
        align: "left",
        width: 2,
    },
    {
        id: "rank",
        label: "Rank",
        align: "center",
        width: 1,
    },
    {
        id: "fireRegion",
        label: "Fire Authority",
        align: "detail"
    },
    {
        id: "nhsRegion",
        label: "NHS Authority",
        align: "detail"
    },
    {
        id: "policeRegion",
        label: "Police Authority",
        align: "detail"
    },
    {
        id: "westminster",
        label: "Constituency",
        align: "detail"
    }
]

function Fire() {
    usePageTitle("Major Fire Risk");

    return [
        <div className="page theme-fire">
            <h1>Major Fire Risk Sites</h1>

            {grid([
                mapPanel(mapLayers, layerGroups, MAP_POS, 10),
                // DataGridPanel(demoData, columns),
            ])}

        </div>
    ];
}
export default Fire;