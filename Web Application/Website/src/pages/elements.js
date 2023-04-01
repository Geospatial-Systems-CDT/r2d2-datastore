import grid from '../components/grid-layout';

import { mapPanel } from '../components/dashboard-panels';
import { getRiskColour, hex2rgb, usePageTitle } from '../util';

import demoData from '../data/fire/fire-dummy.json';

const MAP_POS = [-1.635681, 54.976958];

var demoDataGeoJson = {
    type: "FeatureCollection",
    name: "Permitted_Waste_Sites_Authorised_Landfill_Site_Boundaries",
    crs: { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    features: [],
}

for (const site of demoData) {
    demoDataGeoJson.features.push({
        type: "Feature",
        geometry: site.geometry,
        area: site.area,
        label: site.name,
        centroid: site.centroid,
        uuid: site.uuid,
    })
}

const mapLayers = [
    {
        id: 'demo-data',
        name: "Legal Waste Sites",
        colour: (obj, info) => { return hex2rgb(getRiskColour(obj.area), 255) },
        data: demoDataGeoJson,
    }
]

const columns = [
    {
        id: "name",
        label: "Name",
        width: 4,
    },
    {
        id: "area",
        label: "Area (m^2)",
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

function Elements() {
    usePageTitle("Elements Demo Page");

    return [
        <div className="page">
            <h1>Elements Demo Page</h1>

            {grid([
                mapPanel(mapLayers, MAP_POS, 10),
            ])}

        </div>
    ];
}
export default Elements;