// import DeckGL from '@deck.gl/react';
// import {LineLayer, GeoJsonLayer} from '@deck.gl/layers';
// import {StaticMap} from 'react-map-gl';

import {Map} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer, LineLayer} from '@deck.gl/layers';
import NCL_DATA from './data.geojson'

function Distribution() {

    // Viewport settings
    const INITIAL_VIEW_STATE = {
        longitude: -1.6016169879310098,
        latitude: 54.98150234776915,
        zoom: 12,
        pitch: 0,
        bearing: 0
    };
    
  // Data to be used by the LineLayer
    const data_default = [
        {sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
    ];
    
    const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'

    // const data_url = 'https://newcastle-2345-2345-1243.s3.eu-west-2.amazonaws.com/output-edges.geojson?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJIMEYCIQCjOqdSnLJDh3eJWYf81s5NNiJGmxDiZdtQCUbSNFJ1eAIhAPRz1IBHQexKPcD7NOfYUat8gSrl01qd146BUd95byNoKv0CCEQQAxoMNDQyMTI1NTYwNTY1IgzAKLdJ8huG5N6KUfgq2gJAOyi0SwFjwzNUWbHF7Vv%2BaSPXcw8a%2FxWjjRzhZmLlReXNMlMpjRuIwRlNN7XY1I%2BfrSDApeoA5vMOkujGcUNpz6Aijww8y8aWeWLnQcMH419amHNdKPLhMzlYD0LR5mdca61Nh8X0z62XUprfTMdvk83vMvOzelOthNOhQ7QG%2Fh%2BKXDP3SXPUgQdUj%2FWbLfnXPLEzsuTkgRoUzVjhYn%2FJyHJUoi8EkAFEDR8Ew0g4OKusR6jxAu2mYJuKOYWAlMNjYmLNCTM3bi170PMMTNAJutlzaWqJOjB%2FOgGXrKhjne3MSjR5%2BeG8FZUAcYYLevXNcoCz58lkB3mFuqIsmM7%2Bn4gi46bSajJJ%2B%2Fkr3ETDJCKpgCv4s5quzb%2FIiASRbzPtGBk8f2%2Bti26LmjhR9E4cyLQI5O1TEu151yNRvbptN8QlgMGBtaG4nic9LTRcM%2BQkIWMdgZnL5ZrmMMTboaAGOrICZv6DWHYFZBgg2L80%2F7M6zm3kyJ2%2Fsoskh950D7ZDRh2nDwxKQbjsnxg1dXMdv9NH5A0%2BhefUUuK5KOTSQRcARWly6QGEWrHaMI3%2BStXsIf3tGtkVdIZDxeEkZJyiFvEgMgLEO36ynoFA4N7ifHA22m4126ZT6%2FnZ%2F7E%2FLe8yG1seY77BwnU%2FJGk1DJbJmVEpBGZuXcJWMIeJl6wo6YrXjT5bESe1sZ%2F3djsbfkcPiIiVYzeXSkgqNmNrBLqDvBZpYTRoqs91zXQMI2DT6D6i%2FUSDa70Y3oe0QDj4gmnicTxJqc5VmUapIivvuOx0aK7hS5fFsbvxCKcGZdxGUQRAOk1cpggpLCA9WE%2BxeLPtA9Xm%2FLV0ICaozb8BkWIZehi05y5ATyBZPXXL1gTSPF5IdxqO&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230308T111709Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAWN4F4VL2Y3Z2GZDG%2F20230308%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Signature=bd02f5f03e2c1de67fe5112d28b1cd785eb3a2f61d97375189ec29ed79800a9d'
    const data_url = NCL_DATA

    const onClick = info => {
        if(info.object) {
            alert(info.object.properties.name)
        }
    }

    const layers = [
        new LineLayer({id: 'line-layer', data: data_default}),
        new GeoJsonLayer({id: 'geojson-layer',
                          data: data_url,
                          filled: true,
                          pointRadiusMinPixels: 5,
                          pointRadiusScale: 10,
                          getPointRadius: f=> 5,
                          getFillColor: [85, 144, 58, 250],
                          getLineColor: d => [255, 255, 255],
                          lineWidthMinPixels: 2,
                          pickable: true,
                          autoHighlight: true,
                        //   onClick,
                        })
      ];
    
    const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic3R1YXJ0Z29yZG9uOTIiLCJhIjoiY2xlc3JsNmc2MDFiOTQycXMzZ2E2eWdpayJ9.RCfaC7CC7-qliPdvCYRQMQ";

    return <div>
        <DeckGL initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                width='100%'
                height='90%'
                >
            <Map reuseMaps
                mapStyle={MAP_STYLE}
                preventStyleDiffing={true}
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                />
        </DeckGL>
    </div>
}
export default Distribution;


