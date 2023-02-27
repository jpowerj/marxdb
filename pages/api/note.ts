// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const whichDB = process.env.WHICH_DB;
const whichFulltext = process.env.WHICH_FULLTEXT;
// Airtable
const Airtable = require('airtable');
const atBaseKey = "appnZn2NYRxLtEvsT";
const atBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(atBaseKey);
import { notesFields, notesTableName } from '@/mdbGlobals';

export async function getNotesAll() {
    if (allNotes.length === 0) {
        await initNotes();
    }
    return {
        notes: allNotes,
        totalNotes: allNotes.length,
    }
}

export async function getNotesCount() {
    if (allNotes.length === 0) {
        await initNotes();
    }
    return allNotes.length;
}

export async function getNotesAllIds() {
    if (allNotes.length === 0) {
        await initNotes();
    }
    const allNoteIds = allNotes.map((note) => note.entry_id);
    return {
        noteIds: allNoteIds,
        totalNoteIds: allNoteIds.length,
    }
}

export async function getNotesOne(entryId: string) {
    if (allNotes.length === 0) {
        await initNotes();
    }
    const results = allNotes.filter((note) => note.entry_id === entryId);
    if (results.length === 0) {
        return {
            noteData: null,
            error: 'Entry with ID ' + entryId + ' not found.',
        }
    }
    return {
        noteData: results[0],
        error: null,
    }
}

let allNotes: any[] = [];
export async function initNotes() {
    //let pipeline = [{ $limit: 100 }];
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/
    //console.log(request);
    let results = await atBase(notesTableName).select({
        fields: notesFields,
        sort: [{ field: "entry_id", direction: "asc" }],
    }).all();
    let resultsFields = results.map((x: any) => x.fields);
    allNotes = resultsFields;
}