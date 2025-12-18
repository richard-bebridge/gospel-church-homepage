/**
 * Layout Metrics Constants
 * Central source of truth for layout measurements to avoid magic numbers.
 * strictly for 80px header contract and associated scroll areas.
 */

export const HEADER_HEIGHT_PX = 80;
export const HEADER_HEIGHT_CLASS = 'h-20';
export const MOBILE_HEADER_HEIGHT_CLASS = 'h-16';

// Style objects for use in style={{ ... }} prop
// Replaces: h-[calc(100vh-80px)]
export const SCROLL_AREA_HEIGHT_STYLE = { height: `calc(100vh - ${HEADER_HEIGHT_PX}px)` };

// Replaces: min-h-[calc(100vh-80px)]
export const SCROLL_AREA_MINH_STYLE = { minHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)` };

// Replaces: scroll-padding-top: 80px
export const SCROLL_PADDING_TOP_STYLE = { scrollPaddingTop: `${HEADER_HEIGHT_PX}px` };
