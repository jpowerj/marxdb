// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require('axios');
const whichDB = process.env.WHICH_DB;
const whichFulltext = process.env.WHICH_FULLTEXT;
// Airtable
const Airtable = require('airtable');
const atBaseKey = "appnZn2NYRxLtEvsT";
const atBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(atBaseKey);
//const regTableName = "M00_Register";
import { booksFields, booksTableName } from '@/mdbGlobals';

const debug = false;

export async function getBooksAll() {
    if (allBooks.length === 0) {
        await initBooks();
    } else {
        if (debug) {
            console.log("" + allBooks.length + " books");
            console.log("Keys: " + Object.keys(allBooks[0]))
        }
    }
    return {
        books: allBooks,
        totalBooks: allBooks.length,
    }
}

export async function getBooksOne(entryId: string) {
    if (allBooks.length === 0) {
        await initBooks();
    }
    const results = allBooks.filter((book) => book.entry_id === entryId);
    if (results.length === 0) {
        return {
            bookData: null,
            error: 'Entry with ID ' + entryId + ' not found.',
        }
    }
    return {
        bookData: results[0],
        error: null,
    }
}

let allBooks: any[] = [];
export async function initBooks() {
    //let pipeline = [{ $limit: 100 }];
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/
    //console.log(request);
    let results = await atBase(booksTableName).select({
        //view: authView,
        //filterByFormula: "{entry_num} >= " + startEntryNum,
        //maxRecords: 261,
        fields: booksFields,
        sort: [{ field: "entry_id", direction: "asc" }],
    }).all();
    let resultsFields = results.map((x: any) => x.fields);
    allBooks = resultsFields;
}