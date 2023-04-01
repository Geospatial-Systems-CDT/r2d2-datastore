import GridLayout from "react-grid-layout";

/** Checks if an item collides currently */
const collides = (layout, item, cols) => {
    const cls = (l1, l2) => {
        if (l1.x + l1.w <= l2.x) return false;
        if (l1.x >= l2.x + l2.w) return false;
        if (l1.y + l1.h <= l2.y) return false;
        if (l1.y >= l2.y + l2.h) return false;
        return true;
    }
    for (let i = 0; i < layout.length; i++) { if (cls(item, layout[i])) {return true; } }
    if (item.x + item.w > cols && item.w <= cols) { return true; }
    return false
};

/** Calculates the position of the last element */
const getLastElementPosition = (layout, cols) => {
    if (!layout.length) { return { x: 0, y: 0 }; }
    const { x, y } = layout[layout.length - 1];
    return { x, y };

}

/** Adds an item to the layout */
const addItem = (layout, item, cols, fillSpaces) => {
    if (layout.length === 0) {
        layout.push({ ...item, x: 0, y: 0 });
    } else {
        let { x, y } = fillSpaces ? { x: 0, y: 0 } : getLastElementPosition(layout, cols);
        while (collides(layout, { ...item, x, y }, cols)) {
            if (x + 1 >= cols) { x = 0; y++; } 
            else { x++; }
        }
        layout.push({ ...item, x, y, });
    }
}

/** Creates a layout */
const createLayout = (items, cols, fillSpaces) => {
    const layout = [];
    items.forEach(item => addItem(layout, item.params, cols, fillSpaces));
    return layout;
}








/** 
 * Creates a grid layout with a number of panels
 * @param panels An Object containing panel definitions, as created by the panel builder
 */
function grid(panels) {
    const layout = createLayout(panels, 12, true);

    const width = Math.floor(window.innerWidth * 0.90);
    const cols  = (width > 900) ? 12 : 6;

    return <GridLayout
        className="layout"
        style={{width: (width + 30) + "px"}}
        layout={layout}
        cols={cols}
        rowHeight={(width / cols) - 10}
        width={width}
        draggableCancel={["#deckgl-wrapper", ".apexcharts-toolbar", ".nogridmove"]}
        compactType={null}
        preventCollision={true}
    >
        {panels.map(panel => <div key={panel.params.i} className={panel.className}>{panel.render}</div>)}

    </GridLayout>
}



export default grid;