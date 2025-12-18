import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';

const NOTION_SITE_SETTINGS_DB_ID = process.env.NOTION_SETTING_DB_ID || process.env.NOTION_SITE_SETTINGS_DB_ID;
const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = new Client({ auth: NOTION_API_KEY });

/**
 * DEFAULT_SITE_SETTINGS
 * - Primary fallback for all global info
 */
export const DEFAULT_SITE_SETTINGS = {
    church_name: "대한예수교장로회 가스펠교회",
    email: "2014gospel@naver.com",
    phone_main: "02-583-2014",
    phone_alt: "02-6008-5830",
    address: "서울특별시 서초구 서초동 1627-5 B1",
    sns: {
        instagram: "https://www.instagram.com/gospel_church_/",
        youtube: "https://www.youtube.com/@gospel_church",
        facebook: "#",
    },
    map_url: "https://naver.me/G87q7zqz" // Example fallback
};

/**
 * Normalizes URL to ensure it starts with https://
 */
export const normalizeUrl = (url) => {
    if (!url || url === "#") return "#";
    let clean = url.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        return `https://${clean}`;
    }
    return clean;
};

/**
 * Converts a phone number string to a tel: href
 */
export const toTelHref = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, '');
    return `tel:${digits}`;
};

/**
 * Property Candidates Registry
 */
const PROPERTY_CANDIDATES = {
    email: ["church_email", "email", "이메일"],
    phone_main: ["church_phone", "phone", "전화", "대표전화"],
    phone_alt: ["church_phone2", "phone2", "전화2", "추가전화", "church_fax", "fax"],
    address: ["address", "주소"],
    youtube: ["youtube", "유튜브"],
    instagram: ["instagram", "인스타", "인스타그램", "instgram"],
    facebook: ["facebook", "페이스북"],
    map_url: ["map_url", "지도", "지도링크"]
};

/**
 * Case-Insensitive property extractor for Notion
 */
const extractPropValue = (properties, candidates) => {
    const key = Object.keys(properties).find(k =>
        candidates.includes(k.toLowerCase().replace(/\s+/g, '_')) ||
        candidates.includes(k.toLowerCase().trim())
    );

    if (!key) return null;
    const prop = properties[key];

    switch (prop.type) {
        case 'title':
            return prop.title?.[0]?.plain_text || null;
        case 'rich_text':
            return prop.rich_text?.[0]?.plain_text || null;
        case 'url':
            return prop.url || null;
        case 'email':
            return prop.email || null;
        case 'phone_number':
            return prop.phone_number || null;
        default:
            return null;
    }
};

let warnLogged = false;

async function fetchGlobalSiteSettingsFromNotion() {
    if (!NOTION_SITE_SETTINGS_DB_ID || !NOTION_API_KEY) {
        if (process.env.NODE_ENV === 'development' && !warnLogged) {
            console.warn('[SiteSettings] Missing Notion environment variables.');
            warnLogged = true;
        }
        return null;
    }

    try {
        const response = await notion.databases.query({
            database_id: NOTION_SITE_SETTINGS_DB_ID,
        });

        // Find row where Title is "global" (case-insensitive, trimmed)
        const globalPage = response.results.find(page => {
            const titleProp = Object.values(page.properties).find(p => p.type === 'title');
            const titleText = titleProp?.title?.[0]?.plain_text?.trim()?.toLowerCase();
            return titleText === 'global' || titleText === 'site' || titleText === 'settings';
        });

        if (!globalPage) {
            if (process.env.NODE_ENV === 'development' && !warnLogged) {
                console.warn('[SiteSettings] No "global" row found in Notion settings DB.');
                warnLogged = true;
            }
            return null;
        }

        const props = globalPage.properties;

        if (process.env.NODE_ENV === 'development') {
            console.log('[SiteSettings] Raw Property Keys:', Object.keys(props));
            console.log('[SiteSettings] extracted youtube:', extractPropValue(props, PROPERTY_CANDIDATES.youtube));
        }

        const settings = {
            email: extractPropValue(props, PROPERTY_CANDIDATES.email) || DEFAULT_SITE_SETTINGS.email,
            phone_main: extractPropValue(props, PROPERTY_CANDIDATES.phone_main) || DEFAULT_SITE_SETTINGS.phone_main,
            phone_alt: extractPropValue(props, PROPERTY_CANDIDATES.phone_alt) || DEFAULT_SITE_SETTINGS.phone_alt,
            address: extractPropValue(props, PROPERTY_CANDIDATES.address) || DEFAULT_SITE_SETTINGS.address,
            sns: {
                instagram: normalizeUrl(extractPropValue(props, PROPERTY_CANDIDATES.instagram) || DEFAULT_SITE_SETTINGS.sns.instagram),
                youtube: normalizeUrl(extractPropValue(props, PROPERTY_CANDIDATES.youtube) || DEFAULT_SITE_SETTINGS.sns.youtube),
                facebook: normalizeUrl(extractPropValue(props, PROPERTY_CANDIDATES.facebook) || DEFAULT_SITE_SETTINGS.sns.facebook),
            },
            map_url: normalizeUrl(extractPropValue(props, PROPERTY_CANDIDATES.map_url) || DEFAULT_SITE_SETTINGS.map_url)
        };

        return settings;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[SiteSettings] Fetch failed:', error.message);
        }
        return null;
    }
}

/**
 * Main entry point with Next.js caching
 */
export const getSiteSettings = unstable_cache(
    async () => {
        const settings = await fetchGlobalSiteSettingsFromNotion();
        return settings || DEFAULT_SITE_SETTINGS;
    },
    ['site-settings-global'],
    {
        revalidate: process.env.NODE_ENV === 'development' ? 5 : 600,
        tags: ['site-settings']
    }
);
