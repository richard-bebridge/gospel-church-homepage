import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

let bibleCache = null;

const loadBibleData = () => {
    if (bibleCache) return bibleCache;

    const csvPath = path.join(process.cwd(), 'src/data/bible_kor.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');

    // Parse CSV
    // Columns: "Verse ID","Book Name","Book Number",Chapter,Verse,Text
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        from_line: 6
    });

    const map = new Map();

    records.forEach(record => {
        // Create key: "BookName:Chapter:Verse"
        // Remove quotes if present (csv-parse handles this but just in case)
        const book = record['Book Name'];
        const chapter = record['Chapter'];
        const verse = record['Verse'];
        const text = record['Text'];

        if (book && chapter && verse) {
            const key = `${book}:${chapter}:${verse}`;
            map.set(key, text);
        }
    });

    bibleCache = map;
    return map;
};

// New helper to support "Book Chapter:Verse" string lookup
export const getScripture = (reference) => {
    // Expected format: "Book Chapter:Verse" or "BookChapter:Verse"
    // e.g. "신 8:3", "신명기 8:3", "신명기8:3"
    // We prepend '#' to reuse extractBibleTags logic which expects a tag marker or parentheses
    const tags = extractBibleTags('#' + reference.trim());
    if (tags.length === 0) return { text: null };

    const tag = tags[0];
    const text = getVerse(tag.book, tag.chapter, tag.verse);
    const fullBookName = BOOK_MAPPING[tag.book] || tag.book;

    return {
        text: text || null,
        normalizedReference: `${fullBookName} ${tag.chapter}:${tag.verse}`
    };
};

export const BOOK_MAPPING = {
    '창': '창세기',
    '출': '출애굽기',
    '레': '레위기',
    '민': '민수기',
    '신': '신명기',
    '수': '여호수아',
    '삿': '사사기',
    '룻': '룻기',
    '삼상': '사무엘상',
    '삼하': '사무엘하',
    '왕상': '열왕기상',
    '왕하': '열왕기하',
    '대상': '역대상',
    '대하': '역대하',
    '스': '에스라',
    '느': '느헤미야',
    '에': '에스더',
    '욥': '욥기',
    '시': '시편',
    '잠': '잠언',
    '전': '전도서',
    '아': '아가',
    '사': '이사야',
    '렘': '예레미야',
    '애': '예레미야애가',
    '겔': '에스겔',
    '단': '다니엘',
    '호': '호세아',
    '욜': '요엘',
    '암': '아모스',
    '옵': '오바댜',
    '욘': '요나',
    '미': '미가',
    '나': '나훔',
    '합': '하박국',
    '습': '스바냐',
    '학': '학개',
    '슥': '스가랴',
    '말': '말라기',
    '마': '마태복음',
    '막': '마가복음',
    '누': '누가복음',
    '눅': '누가복음',
    '요': '요한복음',
    '행': '사도행전',
    '롬': '로마서',
    '고전': '고린도전서',
    '고후': '고린도후서',
    '갈': '갈라디아서',
    '엡': '에베소서',
    '빌': '빌립보서',
    '골': '골로새서',
    '살전': '데살로니가전서',
    '살후': '데살로니가후서',
    '딤전': '디모데전서',
    '딤후': '디모데후서',
    '딛': '디도서',
    '몬': '빌레몬서',
    '히': '히브리서',
    '약': '야고보서',
    '벧전': '베드로전서',
    '벧후': '베드로후서',
    '요일': '요한1서',
    '요이': '요한2서',
    '요삼': '요한3서',
    '유': '유다서',
    '계': '요한계시록',
};

export const getVerse = (book, chapter, verse) => {
    const bible = loadBibleData();
    // Resolve abbreviation
    const fullBookName = BOOK_MAPPING[book] || book;
    const key = `${fullBookName}:${chapter}:${verse}`;
    return bible.get(key);
};

export const extractBibleTags = (text) => {
    if (!text) return [];
    // Regex for #BookChapter:Verse or (BookChapter:Verse)
    // Matches: #신명기10:1, #신명기 10:1, (신명기10:1), (신명기 10:1)
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
