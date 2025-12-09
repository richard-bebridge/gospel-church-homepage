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

export const getVerse = (book, chapter, verse) => {
    const bible = loadBibleData();
    const key = `${book}:${chapter}:${verse}`;
    return bible.get(key);
};

export const extractBibleTags = (text) => {
    if (!text) return [];
    // Regex for #BookChapter:Verse (e.g., #신명기10:1 or #신명기 10:1)
    // Assumes Book is Korean characters
    const regex = /#([가-힣]+)\s*(\d+):(\d+)/g;
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
