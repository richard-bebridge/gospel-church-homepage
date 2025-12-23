import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

let bibleCacheKo = null;
let bibleCacheEn = null;

// Standard Protestant Canon Order (Abbreviations)
const BOOK_ORDER = [
    '창', '출', '레', '민', '신', '수', '삿', '룻', '삼상', '삼하',
    '왕상', '왕하', '대상', '대하', '스', '느', '에', '욥', '시', '잠',
    '전', '아', '사', '렘', '애', '겔', '단', '호', '욜', '암', '옵',
    '욘', '미', '나', '합', '습', '학', '슥', '말',
    '마', '막', '누', '요', '행', '롬', '고전', '고후', '갈', '엡',
    '빌', '골', '살전', '살후', '딤전', '딤후', '딛', '몬', '히', '약',
    '벧전', '벧후', '요일', '요이', '요삼', '유', '계'
];
// Map abbrev to number (1-based)
const BOOK_TO_NUMBER = BOOK_ORDER.reduce((acc, curr, idx) => {
    acc[curr] = idx + 1;
    return acc;
}, {});

// Korean Mapping (Name)
export const BOOK_MAPPING = {
    '창': '창세기', '출': '출애굽기', '레': '레위기', '민': '민수기', '신': '신명기',
    '수': '여호수아', '삿': '사사기', '룻': '룻기', '삼상': '사무엘상', '삼하': '사무엘하',
    '왕상': '열왕기상', '왕하': '열왕기하', '대상': '역대상', '대하': '역대하', '스': '에스라',
    '느': '느헤미야', '에': '에스더', '욥': '욥기', '시': '시편', '잠': '잠언',
    '전': '전도서', '아': '아가', '사': '이사야', '렘': '예레미야', '애': '예레미야애가',
    '겔': '에스겔', '단': '다니엘', '호': '호세아', '욜': '요엘', '암': '아모스',
    '옵': '오바댜', '욘': '요나', '미': '미가', '나': '나훔', '합': '하박국',
    '습': '스바냐', '학': '학개', '슥': '스가랴', '말': '말라기',
    '마': '마태복음', '막': '마가복음', '누': '누가복음', '눅': '누가복음', '요': '요한복음',
    '행': '사도행전', '롬': '로마서', '고전': '고린도전서', '고후': '고린도후서',
    '갈': '갈라디아서', '엡': '에베소서', '빌': '빌립보서', '골': '골로새서',
    '살전': '데살로니가전서', '살후': '데살로니가후서', '딤전': '디모데전서', '딤후': '디모데후서',
    '딛': '디도서', '몬': '빌레몬서', '히': '히브리서', '약': '야고보서',
    '벧전': '베드로전서', '벧후': '베드로후서', '요일': '요한1서', '요이': '요한2서',
    '요삼': '요한3서', '유': '유다서', '계': '요한계시록',
    // Aliases for user input
    '요한일서': '요한1서', '요한이서': '요한2서', '요한삼서': '요한3서',
};

const loadBibleDataKo = () => {
    if (bibleCacheKo) return bibleCacheKo;
    const csvPath = path.join(process.cwd(), 'src/data/bible_kor.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true, trim: true, from_line: 6 });
    const map = new Map();
    records.forEach(record => {
        // Key: "BookName:Chapter:Verse" (Using Full Korean Name)
        if (record['Book Name'] && record['Chapter'] && record['Verse']) {
            map.set(`${record['Book Name']}:${record['Chapter']}:${record['Verse']}`, record['Text']);
        }
    });
    bibleCacheKo = map;
    return map;
};

const loadBibleDataEn = () => {
    if (bibleCacheEn) return bibleCacheEn;
    const csvPath = path.join(process.cwd(), 'src/data/bible_en.csv');
    if (!fs.existsSync(csvPath)) return new Map();

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    // English CSV headers: "Verse ID","Book Name","Book Number",Chapter,Verse,Text
    const records = parse(fileContent, { columns: true, skip_empty_lines: true, trim: true, from_line: 6 });

    const map = new Map();
    records.forEach(record => {
        // Key: "BookNumber:Chapter:Verse" (Language Agnostic Key)
        const bNum = record['Book Number'];
        const ch = record['Chapter'];
        const v = record['Verse'];
        if (bNum && ch && v) {
            map.set(`${bNum}:${ch}:${v}`, record['Text']);
        }
    });
    bibleCacheEn = map;
    return map;
};

export const getVerse = (book, chapter, verse) => {
    const bible = loadBibleDataKo();
    let fullBookName = BOOK_MAPPING[book] || book;

    // Try Full Name Key
    let text = bible.get(`${fullBookName}:${chapter}:${verse}`);

    // Fallback: If 'book' was already full name or alias?
    if (!text && book !== fullBookName) {
        text = bible.get(`${book}:${chapter}:${verse}`);
    }

    // Fallback 2: Try stripping spaces from book name
    if (!text) {
        const cleanBook = book.replace(/\s+/g, '');
        fullBookName = BOOK_MAPPING[cleanBook] || cleanBook;
        text = bible.get(`${fullBookName}:${chapter}:${verse}`);
    }

    return text;
};

// Invert mapping for Name -> Number lookup
const NAME_TO_NUMBER = {};
// 1. Add Abbreviations
Object.entries(BOOK_TO_NUMBER).forEach(([abbrev, num]) => {
    NAME_TO_NUMBER[abbrev] = num;
});
// 2. Add Full Names
Object.entries(BOOK_MAPPING).forEach(([abbrev, fullName]) => {
    const num = BOOK_TO_NUMBER[abbrev];
    if (num) {
        NAME_TO_NUMBER[fullName] = num;
    }
});

const getBookNumber = (name) => {
    if (!name) return null;
    // Check direct match (Abbrev or Full or Alias present in NAME_TO_NUMBER from BOOK_MAPPING)
    if (NAME_TO_NUMBER[name]) return NAME_TO_NUMBER[name];

    // Check aliases manually added in BOOK_MAPPING
    let mappedName = BOOK_MAPPING[name];
    if (mappedName && NAME_TO_NUMBER[mappedName]) {
        return NAME_TO_NUMBER[mappedName];
    }

    // Try stripping spaces (e.g. "요한 1서" -> "요한1서")
    const cleanName = name.replace(/\s+/g, '');
    if (NAME_TO_NUMBER[cleanName]) return NAME_TO_NUMBER[cleanName];

    mappedName = BOOK_MAPPING[cleanName];
    if (mappedName && NAME_TO_NUMBER[mappedName]) {
        return NAME_TO_NUMBER[mappedName];
    }

    return null;
};

export const getVerseEn = (bookIdentity, chapter, verse) => {
    // 1. Resolve Name/Abbrev to Number
    // bookIdentity could be '요한1서' (from regex) or '요일' (from tag) or '요한일서' (alias)
    let bNum = getBookNumber(bookIdentity);

    // Legacy handle for '눅' if not covered (it is covered if BOOK_MAPPING has it or if we add it)
    if (!bNum && bookIdentity === '눅') bNum = BOOK_TO_NUMBER['누'];

    if (!bNum) return null;

    const bible = loadBibleDataEn();
    return bible.get(`${bNum}:${chapter}:${verse}`);
};

export const getScripture = (reference) => {
    // Expected: "고전 13:4"
    const tags = extractBibleTags('#' + reference.trim());
    if (tags.length === 0) return { text: null, textEn: null };

    const tag = tags[0];
    const textKo = getVerse(tag.book, tag.chapter, tag.verse);
    const textEn = getVerseEn(tag.book, tag.chapter, tag.verse);
    const fullBookName = BOOK_MAPPING[tag.book] || tag.book;

    return {
        text: textKo || null,
        textEn: textEn || null,
        normalizedReference: `${fullBookName} ${tag.chapter}:${tag.verse}`,
        ref: tag // return raw components if needed
    };
};

export const extractBibleTags = (text) => {
    if (!text) return [];
    const regex = /(?:#|\()([가-힣]+)\s*(\d+):(\d+)(?:\))?/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push({
            full: match[0],
            book: match[1],
            chapter: match[2],
            verse: match[3]
        });
    }
    return matches;
};

export const extractPlainBibleReferences = (text) => {
    if (!text) return [];
    // Modified regex to allow:
    // 1. Alphanumeric + Korean
    // 2. Spaces within book name (e.g. "1 John", "요한 1서")
    // Captures: "Book Name" (Group 1), Chapter (Group 2), Verse (Group 3), EndVerse (Group 4)
    // Modified regex to allow spaces but prevent the Chapter number from being consumed as part of the Book Name.
    // We ensure that the subsequent parts of the Book Name are NOT pure digits followed by space/colon/end.
    const regex = /([가-힣a-zA-Z0-9]+(?:(?:\s+)(?![0-9]+(?:\s|:|$))[가-힣a-zA-Z0-9]+)*)\s*(\d+)\s*:\s*(\d+)(?:\s*[-–—~]\s*(\d+))?/g;

    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        // Filter out if book is ONLY digits
        if (!isNaN(match[1])) continue;

        matches.push({
            full: match[0],
            book: match[1], // e.g. "요한 1서", "1 John"
            chapter: match[2],
            verse: match[3],
            endVerse: match[4] || null
        });
    }
    return matches;
};
