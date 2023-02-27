import { createStyles } from "@mantine/core";
import _ from 'lodash';

// General
export const pageSize = 20;
export const modalScrollHeight = "250px";

export const useEntryStyles = createStyles((theme) => {
    const baseColor = theme.colors[theme.primaryColor][6];
    //console.log("baseColor: " + baseColor);
    return {
        card: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderWidth: 1,
        },
        dataEntry: {
            minWidth: '80px',
        },
        dataLabel: {
            minWidth: '100px',
            fontWeight: 'bold',
            verticalAlign: 'middle'
        },
        headerTitle: {
            flexGrow: 1,
            textAlign: 'center',
            verticalAlign: 'middle',
            // height: '100%',
            //fontSize: getHeaderSize(entryData.header_parsed),
            fontWeight: 'bold',
            display: 'table-cell',
        }
    }
});

const largeHeader = '18pt';
const smallHeader = '14pt';
export const getHeaderSize = (headerStr: string) => {
    if (headerStr.length > 20) {
        return smallHeader;
    } else {
        return largeHeader;
    }
}

//-------------
// 00: Register
//-------------
export const regAuths = [
    {label: 'Marx', value: 'm'},
    {label: 'Engels', value: 'e'},
    {label: 'Joint Works', value: 'me'},
    {label: 'Sources', value: 'st'},
];
export const regTableName = "M00_Register";
export const regAuthsDefaultValue = 'm';
export const regFields = ['entry_id', 'date_final', 'title', 'full_text', 'lang_orig', 'reg_section', 'dubious', 'source','published','more_info','german_title'];

//--------------
// 01. Chronicle
//--------------
// export const chronAuths = [
//     {label: 'Marx', value: 'm'},
//     {label: 'Engels', value: 'e'},
// ];
export const chronTableName = "M01_Chronicle_mini";
export const chronYears = ['all'].concat(_.range(1818, 1896, 1).map((yearNum: number) => String(yearNum)));
export const chronYearsDefault = 'all';
export const chronFields = ['entry_id','text','M','E','who','header_parsed','category','date_final','year'];

//------------
// 02. Letters
//------------
// export const letterAuths = [
//     {label: 'Both', value: 'all'},
//     {label: 'Marx', value: 'm'},
//     {label: 'Engels', value: 'e'},
// ];
export const lettersTableName = "M02_Letters";
export const lettersFields = ['entry_id','year','date_full','date_short','from','to_parsed_linked','from_to_str'];

//--------------
// 03. Notebooks
//--------------
export const notesTableName = "M03_Notebooks";
export const notesFields = ['entry_id','who','year_est','iish_code','text_name_final','genres_specific'];

//--------------
// 04. Bookshelf
//--------------
export const booksTableName = "M04_Bookshelf";
export const booksFields = ['entry_id','last','first','title','who','langs','people_ref_linked','auth_last','auth_first','auth_full'];

//-------------
// 05. Glossary
//-------------
export const allGlossCats = [
    { name: 'all', include: true},
    { name: 'people', include: true },
    { name: 'places', include: true },
    { name: 'events', include: true },
    { name: 'orgs', include: true },
    { name: 'other', include: false },
];
export const glossTableName = "M05_Glossary";
export const glossCatsDefaultValue = 'all';
export const glossFields = ['entry_id','category','subcategory','glossary_desc','desc_final','full_name'];

//----------
// Functions
//----------

export const getIISHLink = (notebookCode: string) => {
    const cleanCode = notebookCode.replace("B0","B").replace("B","B_");
    return "https://access.iisg.amsterdam/universalviewer/#?manifest=https://hdl.handle.net/10622/ARCH00860." + cleanCode + "?locatt=view:manifest";
}

export const loadStoredParam = (keyName: string, curKeyVal: string, keySetter: any) => {
    // Check if it's in localStorage
    if (typeof window !== 'undefined' && curKeyVal === 'notloaded') {
        const storedVal = window.localStorage.getItem(keyName);
        if (storedVal !== null) {
            keySetter(storedVal);
        } else {
            keySetter('loadednull');
        }
    }
}