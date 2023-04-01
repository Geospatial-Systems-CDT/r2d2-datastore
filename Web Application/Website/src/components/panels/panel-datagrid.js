import { randHash } from "../../util";
import { useState } from 'react';

const useToggleRow = (element) => {
    window.tmp = element;

    const newPos = {
        lat: +element.target.parentElement.getAttribute('pos_lat'),
        lon: +element.target.parentElement.getAttribute('pos_lon')
    }
    window._center = newPos;
    window._zoom = 12;
    window.setMapCenter(newPos);
    window.setMapZoom(12);

    window.setSelectedSite(element.target.parentElement.getAttribute('uuid'));
}

/** 
 * Creates a panel with a data grid in it, containing assorted summary and expanded information
 * @param {Array} data The text to place in the panel, in a row-wise format
 * @prarm {Array} columns Definition of the columns, including titles and formatting
 * @param width   The default width of this panel, in blocks. Default to 6
 * @param height  The default height of this panel, in blocks. Defaults to 4
 */
function DataGridPanel(data, columns, width = 6, height = 4) {
    var colDefs = [];

    const [selectedSite, setSelectedSite] = useState("null");
    window.setSelectedSite = setSelectedSite;

    for (const column of columns) {
        column.width = (column.width === undefined) ? "1fr" : Number.parseInt(column.width) + "fr";
        column.align = (column.align === undefined) ? "left" : column.align;
        if(column.align !== "detail") { colDefs.push(column.width); }
    }

    return {
        render: <table id="dataTable" className="datagrid" style={{ "--table-cols": colDefs.join(" ") }}>
            <tbody>
                <tr key={randHash()}>{Object.entries(columns).map((ele) => { return (ele[1].align !== "detail") ? <th key={ele[1].id}>{ele[1].label}</th> : ""; })}</tr>
                {
                    Object.entries(data).map((ele) => {
                        const obj = ele[1];
                        var detail = [];

                        const clazz = "expanded-row-content" + ((selectedSite === obj.uuid) ? "" : " hide-row");

                        return <tr
                            key={randHash()}
                            className="nogridmove"
                            onClick={useToggleRow}
                            pos_lon={obj.centroid.coordinates[0]}
                            pos_lat={obj.centroid.coordinates[1]}
                            uuid={obj.uuid}
                            >
                            
                            {Object.entries(columns).map((ele) => {
                                if(ele[1].align === "detail") {
                                    detail.push(<p key={ele[1].id}><b>{ele[1].label}</b><span>{obj[ele[1].id]}</span></p>);
                                    return null;
                                }
                                else {
                                    return <td key={ele[1].id} style={{ textAlign: ele[1].align }}>{obj[ele[1].id]}</td>
                                }
                            })}
                            <td key={randHash()} className={clazz}>{
                                Object.entries(detail).map((ele) => {
                                    return ele[1];
                                })
                            }</td>
                        </tr>
                    })
                }
            </tbody>
        </table>,
        params: { i: "datagrid-" + randHash(), w: width, h: height },
    }
}

export default DataGridPanel;