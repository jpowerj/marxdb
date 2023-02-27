// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const whichDB = process.env.WHICH_DB;
const whichFulltext = process.env.WHICH_FULLTEXT;
// Airtable
const Airtable = require('airtable');
const atBaseKey = "appnZn2NYRxLtEvsT";
const atBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(atBaseKey);
import { glossFields, glossTableName, allGlossCats } from '@/mdbGlobals';

const debug = false;

export async function getGlossEntriesAll() {
    if (allGlossEntries.length === 0) {
        await initGlossEntries();
    } else {
        if (debug) {
            console.log("" + allGlossEntries.length + " entries");
            console.log("Keys: " + Object.keys(allGlossEntries[0]));
        }
    }
    return {
        events: allGlossEntries,
        totalEvents: allGlossEntries.length,
    }
}

export async function getGlossEntriesOne(entryId: string) {
    if (allGlossEntries.length === 0) {
        await initGlossEntries();
    }
    const results = allGlossEntries.filter((ent) => ent.entry_id === entryId);
    if (results.length === 0) {
        return {
            glossEntryData: null,
            error: 'Entry with ID ' + entryId + ' not found.',
        }
    }
    return {
        glossEntryData: results[0],
        error: null,
    }
}

export async function getGlossEntriesCats() {
    if (allGlossEntries.length === 0) {
        await initGlossEntries();
    }
    //airtableTotals[gridName] = totalFound;
    const glossCats = allGlossEntries.map((ent: any) => ent.category.toLowerCase());
    //console.log("entryAuths: " + entryAuths);
    const uniqueCats = [...new Set<string>(glossCats)];
    //console.log("uniqueCats: " + uniqueCats);
    const partition = Object.fromEntries(uniqueCats.map((cat) => [cat, allGlossEntries.filter((subElt: any) => subElt.category.toLowerCase() === cat)]));
    //console.log("partition keys:");
    //console.log(Object.keys(partition));
    // And add in the "all" category
    partition['all'] = allGlossEntries;
    let catCounts: any = {};
    Object.keys(partition).forEach(function (key, index) {
        catCounts[key] = partition[key].length;
    });
    //console.log("catCounts[all]: " + catCounts['all']);
    return {
        //totalCount: allDocinfo.length,
        //documents: allDocinfo,
        catCounts: catCounts,
        catDocs: partition,
    };
}

let allGlossEntries: any[] = [];
export async function initGlossEntries() {
    //let pipeline = [{ $limit: 100 }];
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/
    //console.log(request);
    let results = await atBase(glossTableName).select({
        fields: glossFields,
        sort: [{ field: "entry_id", direction: "asc" }],
    }).all();
    let resultsFields = results.map((x: any) => x.fields);
    allGlossEntries = resultsFields;
}