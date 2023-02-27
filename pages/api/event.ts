// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require('axios');
const whichDB = process.env.WHICH_DB;
const whichFulltext = process.env.WHICH_FULLTEXT;
// Airtable
const Airtable = require('airtable');
const atBaseKey = "appnZn2NYRxLtEvsT";
const atBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(atBaseKey);
import { chronFields, chronTableName, chronYears } from '@/mdbGlobals';

const debug = false;

export async function getEventsAll() {
    if (allEvents.length === 0) {
        await initEvents();
    } else {
        if (debug) {
            console.log("" + allEvents.length + " events");
            console.log("Keys: " + Object.keys(allEvents[0]));
        }
    }
    return {
        events: allEvents,
        totalEvents: allEvents.length,
    }
}

export async function getEventsOne(entryId: string) {
    if (allEvents.length === 0) {
        await initEvents();
    }
    const results = allEvents.filter((ev) => ev.entry_id === entryId);
    if (results.length === 0) {
        return {
            eventData: null,
            error: 'Entry with ID ' + entryId + ' not found.',
        }
    }
    return {
        eventData: results[0],
        error: null,
    }
}

export async function getEventsYears() {
    if (allEvents.length === 0) {
        await initEvents();
    }
    let yearEvents: { [key:string]: any[] } = {};
    let yearCounts: { [key:string]: number } = {};
    //console.log(allEvents[0]);
    //console.log(allEvents.map((evt) => String(evt.year)));
    //console.log(allEvents.filter((evt) => String(evt.year) == '1818'));
    chronYears.forEach((curYear, index) => {
        const curYearEvents = allEvents.filter((evt) => String(evt.year) == String(curYear));
        yearEvents[curYear] = curYearEvents;
        yearCounts[curYear] = curYearEvents.length;
    })
    // But, replace the "all" year (which shouldn't match anything) with all events
    yearEvents['all'] = allEvents;
    yearCounts['all'] = allEvents.length;
    //console.log("getEventsYears(): " + Object.keys(yearCounts));
    //console.log(yearCounts);
    return {
        yearCounts: yearCounts,
        yearEvents: yearEvents,
    };
}

// export async function getEventsAuths() {
//     if (allEvents.length === 0) {
//         await initEvents();
//     } else {
//         console.log("" + allEvents.length + " events");
//         console.log("Keys: " + Object.keys(allEvents[0]))
//     }
//     //airtableTotals[gridName] = totalFound;
//     const entriesM = allEvents.map((evt) => evt.M);
//     const entriesE = allEvents.map((evt) => evt.E);
//     console.log("entryAuths: " + entryAuths);
//     const uniqueAuths = [...new Set<string>(entryAuths)];
//     console.log("uniqueAuths: " + uniqueAuths);
//     const partition = Object.fromEntries(uniqueAuths.map((auth) => [auth, allDocinfo.filter((subElt) => subElt.reg_section.toLowerCase() === auth)]));
//     console.log("partition keys:");
//     console.log(Object.keys(partition));
//     let authCounts: any = {};
//     Object.keys(partition).forEach(function (key, index) {
//         authCounts[key] = partition[key].length;
//     });
//     console.log("authCounts: " + authCounts['m']);
//     return {
//         //totalCount: allDocinfo.length,
//         //documents: allDocinfo,
//         authCounts: authCounts,
//         authDocs: partition,
//     };
// }

let allEvents: any[] = [];
export async function initEvents() {
    //let pipeline = [{ $limit: 100 }];
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/
    //console.log(request);
    let results = await atBase(chronTableName).select({
        fields: chronFields,
        sort: [{ field: "entry_id", direction: "asc" }],
    }).all();
    let resultsFields = results.map((x: any) => x.fields);
    allEvents = resultsFields;
}