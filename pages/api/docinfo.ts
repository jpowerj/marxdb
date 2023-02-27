// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require('axios');
const whichDB = process.env.WHICH_DB;
const whichFulltext = process.env.WHICH_FULLTEXT;
// Airtable
const Airtable = require('airtable');
const atBaseKey = "appnZn2NYRxLtEvsT";
const atBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(atBaseKey);
import { regTableName } from '@/mdbGlobals';
import { regFields } from '@/mdbGlobals';

type Data = {
    documents: any,
    showCount: number,
    totalCount: number
}

type MyError = {
    msg: string
}

const debug = false;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data|MyError|null>
) {
    // Get the data object
    try {
        //const atBaseKey = "appnZn2NYRxLtEvsT";
        //const atBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(atBaseKey);
        //const regBaseName = "M00_Register";
        //console.log(process.env.AIRTABLE_API_KEY);
        //atBase(regBaseName).select().firstPage().then((result: any) => { console.log(result) })
        const allDocinfo = await getDocinfoPage('marx', 10, 1);
        res.status(200).json(allDocinfo);
        //res.status(200).json(null);
    } catch (err) {
        res.status(500).send({ msg: 'failed to fetch data: ' + err })
    }
    //res.status(200).json({ name: 'John Doe' })
}

let regSectionDict: { [key: string]: string } = {
    "marx": "M",
    "engels": "E",
    "me": "ME",
    "st": "ST",
}
function authNameToRegSection(authName: string): string {
    // Special case for ST
    return regSectionDict[authName];
}

export async function getDocinfoAll() {
    if (allDocinfo.length === 0) {
        await initDocinfo();
    }
    //airtableTotals[gridName] = totalFound;
    return {
        totalCount: allDocinfo.length,
        documents: allDocinfo,
    };
}

export async function getDocinfoOne(entryId: string) {
    if (allDocinfo.length === 0) {
        await initDocinfo();
    }
    const results = allDocinfo.filter((di) => di.entry_id === entryId);
    if (results.length === 0) {
        return {
            docinfo: null,
            error: 'Entry with ID ' + entryId + ' not found.',
        }
    }
    return {
        docinfo: results[0],
        error: null,
    }
}

export async function getDocinfoAuths() {
    if (allDocinfo.length === 0) {
        await initDocinfo();
    } else {
        if (debug) {
            console.log("" + allDocinfo.length + " docs");
            console.log("Keys: " + Object.keys(allDocinfo[0]));
        }
    }
    //airtableTotals[gridName] = totalFound;
    const entryAuths = allDocinfo.map((di) => di.reg_section.toLowerCase());
    //console.log("entryAuths: " + entryAuths);
    const uniqueAuths = [...new Set<string>(entryAuths)];
    //console.log("uniqueAuths: " + uniqueAuths);
    const partition = Object.fromEntries(uniqueAuths.map((auth) => [auth, allDocinfo.filter((subElt) => subElt.reg_section.toLowerCase() === auth)]));
    //console.log("partition keys:");
    //console.log(Object.keys(partition));
    let authCounts: any = {};
    Object.keys(partition).forEach(function (key, index) {
        authCounts[key] = partition[key].length;
    });
    //console.log("authCounts: " + authCounts['m']);
    return {
        //totalCount: allDocinfo.length,
        //documents: allDocinfo,
        authCounts: authCounts,
        authDocs: partition,
    };
}

export async function getDocinfoPageTotalAirtable(regSection: string) {
    let filterFormula = "{reg_section} = '" + regSection + "'"
    //console.log("Getting airtable count with formula:");
    //console.log(filterFormula);
    let result = await atBase(regTableName).select({
        view: 'all_grid',
        fields: [],
        filterByFormula: filterFormula
    }).all();
    return result.length;
}

export async function getDocinfoIdsAirtable() {
    //let filterFormula = "{reg_section} = '" + regSection + "'"
    //console.log("Getting airtable count with formula:");
    //console.log(filterFormula);
    let result = await atBase(regTableName).select({
        view: 'all_grid',
        fields: ['entry_id'],
        //filterByFormula: filterFormula
    }).all();
    let resultFields = result.map((x: any) => x.fields);
    // And, since we only want entry_ids, extract just this field
    // as well
    let resultIds = resultFields.map((x: any) => x.entry_id);
    return resultIds;
}

let airtableData: { [key: string]: any } = {};
let airtableTotals: { [key: string]: number } = {};
export async function getDocinfoPageAirtable(
    authName: string, perPage: number, pageNum: number
) {
    //console.log("[docinfo.server] authName=" + authName + " perPage=" + perPage + " pageNum=" + pageNum);
    let gridName = authNameToRegSection(authName).toLowerCase();
    if (gridName in airtableData) {
        //console.log("Using cached data");
        // Use cached data
        let gridData = airtableData[gridName];
        let resultsFields = gridData.map((x: any) => x.fields);
        let totalFound = airtableTotals[gridName];
        // Now return the range requested
        let startIndex = pageNum * perPage;
        let endIndex = (pageNum + 1) * perPage;
        let requestedData = resultsFields.slice(startIndex, endIndex);
        return {
            showCount: gridData.length,
            totalCount: totalFound,
            documents: requestedData
        };
    } else {
        // For debugging
        //perPage = 100;
        //console.log("[docinfo.ts] else statement");
        let authView = gridName + "_grid";
        let results = await atBase(regTableName).select({
            view: authView,
            //filterByFormula: "{entry_num} >= " + startEntryNum,
            maxRecords: 100,
        }).all();
        //console.log("[docinfo.ts] finished at query");
        //console.log(results);
        //airtableData[gridName] = results;
        // But, we need to extract just the "fields" attribute from each
        let resultsFields = results.map((x: any) => x.fields);
        let regSection = authNameToRegSection(authName);
        let totalFound = await getDocinfoPageTotalAirtable(regSection);
        //airtableTotals[gridName] = totalFound;
        // Now save the full data to the cache, and only return the current
        // page for now
        let startIndex = pageNum * perPage;
        let endIndex = (pageNum + 1) * perPage;
        let requestedData = resultsFields.slice(startIndex, endIndex);
        return {
            showCount: results.length,
            totalCount: totalFound,
            documents: requestedData
        };
    }
}

export async function getDocinfoPage(authName: string, perPage: number, pageNum: number) {
    if (whichDB === "airtable") {
        //console.log(process.env.WHICH_DB);
        //console.log("Getting page via airtable");
        return getDocinfoPageAirtable(authName, perPage, pageNum);
    } else {
        //return getDocinfoPageMongo(authName, perPage, pageNum);
        return null;
    }
}

let allDocinfo: any[] = [];
export async function initDocinfo() {
    //let pipeline = [{ $limit: 100 }];
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/
    //console.log(request);
    let results = await atBase(regTableName).select({
        //view: authView,
        //filterByFormula: "{entry_num} >= " + startEntryNum,
        //maxRecords: 261,
        fields: regFields,
        sort: [{ field: "entry_id", direction: "asc" }],
    }).all();
    let resultsFields = results.map((x: any) => x.fields);
    allDocinfo = resultsFields;
}