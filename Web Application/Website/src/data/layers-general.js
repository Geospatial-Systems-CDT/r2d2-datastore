import { var2col } from '../util';
import northEast from './general/north_east_4326.geojson';
import careHomes from './general/care_homes.geojson';
import halls from './general/halls_centroids.geojson';
import hospitals from './general/hospitals_centroids.geojson';
import schools from './general/schools_centroids.geojson';
import sports from './general/sports_centre_centroids.geojson';
import warmBanks from './general/warm_banks.geojson';
import restLocs from '../data/general/rest_locations.geojson';

export const generalLayers = [
    {
        id: 'north-east-boundary',
        name: "North East Boundary",
        layerGroup: "ne-limit",
        colour: [0, 0, 0, 255],
        filled: false,
        data: northEast,
        tooltip: "<p><b>North East Regional Boundary</b></p>"
    },
    {
        id: 'general-care-homes',
        name: "Care Homes",
        layerGroup: "general-vuln",
        colour: var2col("--theme-feature-carehome"),
        data: careHomes,
        tooltip: "<p><b>Care Home</b></p><p>{{properties.name}}</p>",
        legend: {
            type: 'point',
            color: var2col("--theme-feature-carehome"),
            group: "care-homes"
        },
    },
    {
        id: 'general-halls',
        name: "Public Halls",
        layerGroup: "general-rest",
        colour: [64, 64, 64, 128],
        data: halls,
        tooltip: "<p><b>Public Hall</b></p>",
        legend: {
            type: 'point',
            color: [64, 64, 64, 128],
            group: "public-halls"
        },
    },
    {
        id: 'general-hospitals',
        name: "Hospitals",
        layerGroup: "general-vuln",
        colour: var2col("--theme-feature-medical"),
        data: hospitals,
        tooltip: "<p><b>Hospital</b></p>",
        legend: {
            type: 'point',
            color: var2col("--theme-feature-medical"),
            group: "hospital"
        },
    },
    {
        id: 'general-schools',
        name: "Schools",
        layerGroup: "general-vuln",
        colour: var2col("--theme-feature-school"),
        data: schools,
        tooltip: "<p><b>School</b></p>",
        legend: {
            type: 'point',
            color: var2col("--theme-feature-school"),
            group: "school"
        },
    },
    {
        id: 'general-sports',
        name: "Sports Centres",
        layerGroup: "general-rest",
        colour: var2col("--theme-feature-sports"),
        data: sports,
        tooltip: "<p><b>Sports Centre</b></p>",
        legend: {
            type: 'point',
            color: var2col("--theme-feature-sports"),
            group: "sports"
        },
    },
    {
        id: 'general-warmbanks',
        name: "Warm Banks",
        layerGroup: "general-rest",
        colour: var2col("--theme-feature-warmbank"),
        data: warmBanks,
        tooltip: "<p><b>Warm Bank</b></p>",
        legend: {
            type: 'point',
            color: var2col("--theme-feature-warmbank"),
            group: "warm-banks"
        },
    },
    {
        id: 'rest-locations',
        name: "Rest Locations",
        layerGroup: "general-rest",
        colour: [128, 0, 128, 128],
        data: restLocs,
        tooltip: "<p><b>Rest Location</b></p><p>{{properties.Name}}</p><p>{{properties.Address}}</p>",
        legend: {
            type: 'point',
            color: [128, 0, 128, 128],
            group: "rest-locs"
        },
    },
]

export const generalLayerGroups = [
    {
        id: "ne-limit",
        label: "North-East Boundary",
        default: true,
    },
    {
        id: "general-vuln",
        label: "Vulnerable Assets",
        default: false,
    },
    {
        id: 'general-rest',
        label: "Rest Centres",
        default: false,
    },
    {
        id: "issues",
        label: "Reported Issues",
        default: true,
    },
]