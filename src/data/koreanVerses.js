import bibleData from './bible.json';

// Convert the object { "Gen1:1": "Text" } into an array [ { ref: "Gen1:1", text: "Text" } ]
const allVerses = Object.entries(bibleData).map(([ref, text]) => ({
    ref,
    text: text.trim()
}));

export const getKoreanVerses = (count = 20) => {
    // Shuffle array
    const shuffled = [...allVerses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const getAllKoreanVerses = () => allVerses;
