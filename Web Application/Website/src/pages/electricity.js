import grid from '../components/grid-layout';
import {mapPanel} from '../components/dashboard-panels';
import { var2col, hex2rgb, usePageTitle } from '../util';
import fetch from 'sync-fetch';

import { generalLayers, generalLayerGroups } from '../data/layers-general';
import analysis from '../data/electricity/analysis.geojson';
import networkRisk from '../data/electricity/NE-power-network-risk.geojson';
import networkAnalysis from '../data/electricity/network_analysis_min.geojson';
import vulnMap from '../data/electricity/vulnerability_map-84.geojson';

const MAP_POS = [-1.614719930296475, 54.981289410326994];

// (This is a server Luis rents, can be moved elsewhere later maybe)
const ODK_PROXY_URL = "https://odk-proxy.itsonlyluis.com";
var formData = fetch(ODK_PROXY_URL + "/issue-layer/electricity").json();

const twitterData = {'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {'postcode': 'BD18', 'year': 2022, 'month': 3}, 'geometry': {'type': 'Point', 'coordinates': [-1.784797813, 53.83238663]}}, {'type': 'Feature', 'properties': {'postcode': 'BD18', 'year': 2022, 'month': 4}, 'geometry': {'type': 'Point', 'coordinates': [-1.784797813, 53.83238663]}}, {'type': 'Feature', 'properties': {'postcode': 'DN41', 'year': 2022, 'month': 3}, 'geometry': {'type': 'Point', 'coordinates': [-0.188245380325566, 53.5867214712058]}}, {'type': 'Feature', 'properties': {'postcode': 'HG3', 'year': 2022, 'month': 3}, 'geometry': {'type': 'Point', 'coordinates': [-1.70825, 54.0681445524172]}}, {'type': 'Feature', 'properties': {'postcode': 'HG5', 'year': 2022, 'month': 4}, 'geometry': {'type': 'Point', 'coordinates': [-1.46674225859938, 54.0171119184523]}}, {'type': 'Feature', 'properties': {'postcode': 'HU7', 'year': 2022, 'month': 4}, 'geometry': {'type': 'Point', 'coordinates': [-0.310155369193297, 53.790485768057906]}}, {'type': 'Feature', 'properties': {'postcode': 'LS25', 'year': 2022, 'month': 4}, 'geometry': {'type': 'Point', 'coordinates': [-1.371283, 53.78981367565191]}}, {'type': 'Feature', 'properties': {'postcode': 'NE12', 'year': 2022, 'month': 3}, 'geometry': {'type': 'Point', 'coordinates': [-1.5679933042, 55.018271]}}, {'type': 'Feature', 'properties': {'postcode': 'NE32', 'year': 2022, 'month': 3}, 'geometry': {'type': 'Point', 'coordinates': [-1.49546382466975, 54.977957148189695]}}, {'type': 'Feature', 'properties': {'postcode': 'S9', 'year': 2022, 'month': 3}, 'geometry': {'type': 'Point', 'coordinates': [-1.40657096994994, 53.381145168291]}}, {'type': 'Feature', 'properties': {'postcode': 'S9', 'year': 2022, 'month': 4}, 'geometry': {'type': 'Point', 'coordinates': [-1.40657096994994, 53.381145168291]}}, {'type': 'Feature', 'properties': {'postcode': 'TS6', 'year': 2022, 'month': 4}, 'geometry': {'type': 'Point', 'coordinates': [-1.15452039248476, 54.5556438443086]}}]};
const mapLayers = [
    ...generalLayers,
    {
        id: 'twitter',
        name: "Twitter Data",
        layerGroup: "twitter",
        colour: [29, 161, 242, 128],
        data: twitterData,
        tooltip: "<p><b>Twitter Data</b></p><p>Postcode: {{properties.postcode}}</p><p>Month: {{properties.month}} / {{properties.year}}</p>",
        legend: {
            type: 'point',
            color: [29, 161, 242, 128],
            group: "twitter"
        },
    },
    {
        id: 'analysis',
        name: "Potential Issue",
        layerGroup: "analysis",
        colour: (obj, info) => { return hex2rgb(obj.properties.fill, 255 * obj.properties['fill-opacity']) },
        lineWidth: (obj, info) => { return obj.properties['stroke-width'] },
        data: analysis,
        tooltip: "<p><b>Potential Issue</b></p><p>Rank: {{properties.Rank}}</p><p>Priority Group: {{properties.priority group}}</p><p>Line Priority: {{properties.line priority}}</p><p>Closest Address: {{properties.closest address}}</p>",
        legend: {
            type: 'poly',
            color: [255, 255, 0, 255],
            group: "analysis"
        },
    },
    {
        id: 'network-risk',
        name: "NE Power Network Risk",
        layerGroup: "network-risk",
        colour: (obj, info) => { return hex2rgb(obj.properties.stroke, Math.round(255 * obj.properties['stroke-opacity'])) },
        lineWidth: (obj, info) => { return 4 * obj.properties.priority },
        data: networkRisk,
        legend: {
            type: 'line',
            color: [255, 0, 0, 255],
            group: "network-risk"
        },
    },
    {
        id: 'network-analysis',
        name: "Network Analysis",
        layerGroup: "network-analysis",
        colour: (obj, info) => { return hex2rgb(obj.properties['marker-color']) },
        data: networkAnalysis,
        tooltip: "<p><b>Network Point</b></p><p>Community {{properties.community}}</p>",
        legend: {
            type: 'point',
            color: [192, 32, 255, 128],
            group: "network-analysis"
        },
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
        id: 'vuln-map',
        name: "Social Vulnerability",
        layerGroup: "vuln-map",
        colour: (obj, info) => {
            const score = obj.properties.vulnerability_rank;
            if(score <= 0.142857) { obj.properties.rank = 1; return hex2rgb("#ffff55"); }
            if(score <= 0.333333) { obj.properties.rank = 2; return hex2rgb("#ffcb56"); }
            if(score <= 0.571429) { obj.properties.rank = 3; return hex2rgb("#f99746"); }
            if(score <= 0.809524) { obj.properties.rank = 4; return hex2rgb("#ec5f2b"); }
            if(score <= 1.000000) { obj.properties.rank = 5; return hex2rgb("#d90000"); }
        },
        data: vulnMap,
        tooltip: "<p><b>Social Vulnerability - Rank {{properties.rank}}</b></p><p>{{properties.MSOA01NM}} ({{properties.MSOA01CD}})</p><p>Vulnerability Score: {{properties.vulnerability_rank}}</p>",
        
        legend: {
            type: 'poly',
            color: hex2rgb("#d90000"),
            group: "social-vuln"
        },
    },
]

const layerGroups = [
    ...generalLayerGroups,
    {
        id: "twitter",
        label: "Twitter Data",
        default: true,
    },
    {
        id: 'analysis',
        label: "Analysis",
        default: true,
    },
    {
        id: 'network-risk',
        label: "NE Power Network Risk",
        default: true,
    },
    {
        id: 'network-analysis',
        label: "Network Analysis",
        default: false,
    },
    {
        id: 'vuln-map',
        label: "Social Vulnerability",
        default: false,
    }
]

function Electricity() {
    usePageTitle("Electricity Transmission");

    return [
        <div className="page theme-electricity">
            <h1>Electricity Transmission</h1>

            {grid([
                mapPanel(mapLayers, layerGroups, MAP_POS, 9, 6, 4),
            ])}

        </div>
    ];
}
export default Electricity;