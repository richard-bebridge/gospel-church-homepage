import { NotionAPI } from 'notion-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Notion Page ID for Bulletin
const BULLETIN_PAGE_ID = '2bea986a264f8092af12d0d353387b0a';
// Notion Page ID for BulletinDB
const BULLETIN_DB_PAGE_ID = '2bea986a264f8076bf69ee682eacd02b';
// Notion Page IDs for Print (Booklet)
const PRINT_PART1_ID = '2bea986a264f8080affaf4344f4608d5'; // Pages 1,2,3, 6,7,8
const PRINT_PART2_ID = '2bea986a264f80a7ba07f5c5c2416536'; // Pages 4,5

const notion = new NotionAPI();

async function fetchData() {
    try {
        console.log(`Fetching Notion page: ${BULLETIN_PAGE_ID}...`);
        const recordMap = await notion.getPage(BULLETIN_PAGE_ID);
        const outputPath = path.join(__dirname, '../src/data/bulletin.json');
        fs.writeFileSync(outputPath, JSON.stringify(recordMap, null, 2));
        console.log(`Successfully saved Notion data to ${outputPath}`);

        console.log(`Fetching Notion page: ${BULLETIN_DB_PAGE_ID}...`);
        const dbRecordMap = await notion.getPage(BULLETIN_DB_PAGE_ID);
        const dbOutputPath = path.join(__dirname, '../src/data/bulletinDb.json');
        fs.writeFileSync(dbOutputPath, JSON.stringify(dbRecordMap, null, 2));
        console.log(`Successfully saved Notion data to ${dbOutputPath}`);

        console.log(`Fetching Print Part 1: ${PRINT_PART1_ID}...`);
        const print1RecordMap = await notion.getPage(PRINT_PART1_ID);
        const print1OutputPath = path.join(__dirname, '../src/data/printPart1.json');
        fs.writeFileSync(print1OutputPath, JSON.stringify(print1RecordMap, null, 2));

        console.log(`Fetching Print Part 2: ${PRINT_PART2_ID}...`);
        const print2RecordMap = await notion.getPage(PRINT_PART2_ID);
        const print2OutputPath = path.join(__dirname, '../src/data/printPart2.json');
        fs.writeFileSync(print2OutputPath, JSON.stringify(print2RecordMap, null, 2));
        console.log(`Successfully saved Print data`);

    } catch (error) {
        console.error('Error fetching Notion data:', error);
        process.exit(1);
    }
}

fetchData();
