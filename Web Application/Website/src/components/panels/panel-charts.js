import ReactApexChart from 'react-apexcharts';
import { randHash } from '../../util';

/** Options array, which is to be shared across all chart types */
const optionsDummy = {
    chart: {
        events: {
            mounted: (chart) => { chart.windowResizeHandler(); }
        }
    },
    xaxis: { }
}

/**
 * Creates a simple bar chart
 * @param categories Array of category labels
 * @param series     Array of series objects, in the standard ApexCharts format
 * @param id         A unique ID for this chart. Will be used as the file name if anyone downloads it
 * @param width      The default width of this panel, in blocks. Default to 5
 * @param height     The default height of this panel, in blocks. Defaults to 3
 */
export function barChartPanel(categories, series, id, width = 5, height = 3) {
    var options = optionsDummy;
    options.chart.id = id;
    options.xaxis.categories = categories;

    return {
        render: <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />,
        params: { i: "chart-" + randHash(), w: width, h: height, minW: 3, minH: 2},
    }
}