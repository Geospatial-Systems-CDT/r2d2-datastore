import fetch from 'sync-fetch';
import format from '@stdlib/string-format';
import { randHash } from '../../util';

const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,visibility&timeformat=unixtime&timezone=Europe/London&start_date=%s&end_date=%s&current_weather=true&windspeed_unit=ms";

/**
 * Creates a basic weather panel, using 'live' data from Open Meteo
 * @param pos Position to get the weather for. An array of `[lon, lat]`
 * @param width Default width of this panel. Defaults to 2
 * @param height Default height of this panel. Defaults to 2
 */
function weatherPanel(pos, width = 2, height = 2) {
    const today = new Date().toISOString().split('T')[0];
    const apiCall = format(API_URL, pos[1], pos[0], today, today);
    const rep = fetch(apiCall).json();

    return {
        render: <section>
            <h1>Current Weather</h1>
            <p>Location: {rep.latitude.toFixed(2)}, {rep.longitude.toFixed(2)}</p>
            <p>Temperature: {rep.current_weather.temperature} C</p>
            <p>Wind Speed: {rep.current_weather.windspeed} m/s</p>
        </section>,
        params: { i: "weather-" + randHash(), w: width, h: height },
    }
}

export default weatherPanel;