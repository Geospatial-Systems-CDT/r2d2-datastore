import { randHash } from "../../util";

/** 
 * Creates a panel containing plain text
 * @param content The text to place in the panel
 * @param width   The default width of this panel, in blocks. Default to 2
 * @param height  The default height of this panel, in blocks. Defaults to 2
 */
function textPanel(content, width = 2, height = 1) {
    return {
        render: <span>{content}</span>,
        params: { i: "html-" + randHash(), w: width, h: height },
    }
}

export default textPanel;