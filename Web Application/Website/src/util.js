import { useEffect } from 'react';
import Rainbow from 'rainbowvis.js';

/**
 * Sets a new title for the current page, as displayed in the tab bar and other similar places. This overrides the <title></title> meta tag
 * @param {String} title The new title for the page
 * @param {String} prefix The prefix for the page. Will default to "R2D2 - ", but this can be overridden on a case-by-case basis _only if required_
 */
export function usePageTitle(title, prefix = "R2D2 - ") {
    useEffect(() => {
      const prevTitle = document.title
      document.title = prefix + title
      return () => { document.title = prevTitle }
    })
  }

/**
 * Converts a CSS variable to its hex value. Actually this will just resolve the value of any CSS variable regardless of it's hex or not
 * @param {String} v A CSS variable, starting with --
 * @returns The corresponding hex value associated with this property
 */
export function var2hex(v) {
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

/**
 * Converts a CSS variable to an RGBA array. The variable must resolve to a hex colour
 * @param {String} v A CSS variable name, starting with --
 * @returns An RGBA string array
 */
export function var2col(v) {
    return hex2rgb(var2hex(v));
}

/**
 * Converts a hex string to an RGBA array
 * @param {String} hex The hex string to convert, in the format [#]RRGGBB
 * @param {Number} alpha An optional alpha value, in the range 0 - 255. Defaults to 128 (50%);
 * @returns A colour array, in the format [R, G, B, A]
 */
export function hex2rgb(hex, alpha = 128) {
    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex.trim());
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), alpha];
}

/**
 * Generates a random hash, which may be useful for uniquely identifying an object such as a grid panel item.
 * This is not cryptographically secure, don't rely on the output to be unique
 * @returns A random 8-character hash
 */
export function randHash() {
    return (Math.random() + 1).toString(16).substring(2, 10).padStart(8, '0');
}

const riskRainbow = new Rainbow();
riskRainbow.setSpectrum(
    var2hex("--theme-risk-1"),
    var2hex("--theme-risk-2"),
    var2hex("--theme-risk-3"),
    var2hex("--theme-risk-4"),
    var2hex("--theme-risk-5"),
);
riskRainbow.setNumberRange(0, 1000000); // TODO: This is arbitary at the moment, just for testing
/**
 * Determines the tint colour for a particular normalised risk score, across a smooth gradient, according to the risk colour scheme defined by the {@link riskRainbow}
 * @param {Number} score The normalised risk score for this particular site
 * @returns The hex colour code that corresponds to this risk score, on a smooth gradient
 */
export function getRiskColour(score) {
    return riskRainbow.colourAt(score);
}