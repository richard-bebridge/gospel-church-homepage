export const verses = [
    { text: "LOVE NEVER FAILS.", ref: "1 Corinthians 13:8" },
    { text: "IF I SPEAK IN THE TONGUES OF MEN AND OF ANGELS,", ref: "1 Corinthians 13:1" },
    { text: "BUT HAVE NOT LOVE,", ref: "1 Corinthians 13:1" },
    { text: "I AM A NOISY GONG OR A CLANGING CYMBAL.", ref: "1 Corinthians 13:1" },
    { text: "AND IF I HAVE PROPHETIC POWERS,", ref: "1 Corinthians 13:2" },
    { text: "AND UNDERSTAND ALL MYSTERIES AND ALL KNOWLEDGE,", ref: "1 Corinthians 13:2" },
    { text: "AND IF I HAVE ALL FAITH,", ref: "1 Corinthians 13:2" },
    { text: "SO AS TO REMOVE MOUNTAINS,", ref: "1 Corinthians 13:2" },
    { text: "BUT HAVE NOT LOVE, I AM NOTHING.", ref: "1 Corinthians 13:2" },
    { text: "IF I GIVE AWAY ALL I HAVE,", ref: "1 Corinthians 13:3" },
    { text: "AND IF I DELIVER UP MY BODY TO BE BURNED,", ref: "1 Corinthians 13:3" },
    { text: "BUT HAVE NOT LOVE, I GAIN NOTHING.", ref: "1 Corinthians 13:3" },
    { text: "LOVE IS PATIENT AND KIND;", ref: "1 Corinthians 13:4" },
    { text: "LOVE DOES NOT ENVY OR BOAST;", ref: "1 Corinthians 13:4" },
    { text: "IT IS NOT ARROGANT OR RUDE.", ref: "1 Corinthians 13:5" },
    { text: "IT DOES NOT INSIST ON ITS OWN WAY;", ref: "1 Corinthians 13:5" },
    { text: "IT IS NOT IRRITABLE OR RESENTFUL;", ref: "1 Corinthians 13:5" },
    { text: "IT DOES NOT REJOICE AT WRONGDOING,", ref: "1 Corinthians 13:6" },
    { text: "BUT REJOICES WITH THE TRUTH.", ref: "1 Corinthians 13:6" },
    { text: "LOVE BEARS ALL THINGS,", ref: "1 Corinthians 13:7" },
    { text: "BELIEVES ALL THINGS,", ref: "1 Corinthians 13:7" },
    { text: "HOPES ALL THINGS,", ref: "1 Corinthians 13:7" },
    { text: "ENDURES ALL THINGS.", ref: "1 Corinthians 13:7" },
    { text: "LOVE NEVER ENDS.", ref: "1 Corinthians 13:8" },
    { text: "AS FOR PROPHECIES, THEY WILL PASS AWAY;", ref: "1 Corinthians 13:8" },
    { text: "AS FOR TONGUES, THEY WILL CEASE;", ref: "1 Corinthians 13:8" },
    { text: "AS FOR KNOWLEDGE, IT WILL PASS AWAY.", ref: "1 Corinthians 13:8" },
    { text: "FOR WE KNOW IN PART AND WE PROPHESY IN PART,", ref: "1 Corinthians 13:9" },
    { text: "BUT WHEN THE PERFECT COMES,", ref: "1 Corinthians 13:10" },
    { text: "THE PARTIAL WILL PASS AWAY.", ref: "1 Corinthians 13:10" },
    { text: "WHEN I WAS A CHILD, I SPOKE LIKE A CHILD,", ref: "1 Corinthians 13:11" },
    { text: "I THOUGHT LIKE A CHILD, I REASONED LIKE A CHILD.", ref: "1 Corinthians 13:11" },
    { text: "WHEN I BECAME A MAN, I GAVE UP CHILDISH WAYS.", ref: "1 Corinthians 13:11" },
    { text: "FOR NOW WE SEE IN A MIRROR DIMLY,", ref: "1 Corinthians 13:12" },
    { text: "BUT THEN FACE TO FACE.", ref: "1 Corinthians 13:12" },
    { text: "NOW I KNOW IN PART;", ref: "1 Corinthians 13:12" },
    { text: "THEN I SHALL KNOW FULLY, EVEN AS I HAVE BEEN FULLY KNOWN.", ref: "1 Corinthians 13:12" },
    { text: "SO NOW FAITH, HOPE, AND LOVE ABIDE, THESE THREE;", ref: "1 Corinthians 13:13" },
    { text: "BUT THE GREATEST OF THESE IS LOVE.", ref: "1 Corinthians 13:13" }
];

// Simple seeded random number generator
const mulberry32 = (a) => {
    return () => {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

export const getDailyVerses = () => {
    // Create a seed from the current date (YYYYMMDD)
    const now = new Date();
    const seed = parseInt(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);

    const rng = mulberry32(seed);

    // Fisher-Yates shuffle using the seeded RNG
    const shuffled = [...verses];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};
