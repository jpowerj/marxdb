// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const whichDB = process.env.WHICH_DB;
const whichFulltext = process.env.WHICH_FULLTEXT;
// Airtable
const Airtable = require('airtable');
const atBaseKey = "appnZn2NYRxLtEvsT";
const atBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(atBaseKey);
import { lettersFields, lettersTableName } from '@/mdbGlobals';

export async function getLettersAll() {
    if (allLetters.length === 0) {
        await initLetters();
    }
    return {
        letters: allLetters,
        totalLetters: allLetters.length,
    }
}

export async function getLettersOne(entryId: string) {
    if (allLetters.length === 0) {
        await initLetters();
    }
    const results = allLetters.filter((letter) => letter.entry_id === entryId);
    if (results.length === 0) {
        return {
            letterData: null,
            error: 'Entry with ID ' + entryId + ' not found.',
        }
    }
    return {
        letterData: results[0],
        error: null,
    }
}

let allLetters: any[] = [];
export async function initLetters() {
    //let pipeline = [{ $limit: 100 }];
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/
    //console.log(request);
    let results = await atBase(lettersTableName).select({
        fields: lettersFields,
        sort: [{ field: "entry_id", direction: "asc" }],
    }).all();
    let resultsFields = results.map((x: any) => x.fields);
    allLetters = resultsFields;
}
