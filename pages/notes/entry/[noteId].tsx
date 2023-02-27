import { getEventsAll } from "@/pages/api/event";
import { Button, Flex, Grid, Table, Tabs, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowLeft, Download, InfoCircle } from "tabler-icons-react";
import { Code as CodeIcon } from "tabler-icons-react";
import { getNotesAllIds, getNotesOne } from "@/pages/api/note";
import { useEntryStyles } from "@/mdbGlobals";
import { loadStoredParam } from "@/mdbGlobals";

export const getStaticProps = async (context: any) => {
    const noteId = context.params.noteId;
    const { noteData, error } = await getNotesOne(noteId);
    return {
        props: {
            noteId: noteId,
            noteData: noteData,
            error: error,
        }
    }
}

export const getStaticPaths = async () => {
    const allNoteIdData = await getNotesAllIds();
    const allNoteIds = allNoteIdData.noteIds;
    const allPages = allNoteIds.map((curId) => ({ params: { noteId: curId } }));
    const returnObj = {
        paths: allPages,
        fallback: false, // can also be true or 'blocking'
    }
    //console.log("[entryId].tsx, returnObj:");
    //console.log(JSON.stringify(returnObj));
    return returnObj;
}

const largeHeader = '18pt';
const smallHeader = '14pt';
const getHeaderSize = (headerStr: string) => {
    if (headerStr.length > 20) {
        return smallHeader;
    } else {
        return largeHeader;
    }
}



const ChronEntryPage = ({ noteId, noteData }: { noteId: any, noteData: any }) => {
    const router = useRouter();
    const [prevPage, setPrevPage] = useState('notloaded');
    loadStoredParam('notesPage', prevPage, setPrevPage);
    const headerStyle = {
        flexGrow: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        // height: '100%',
        //fontSize: getHeaderSize(entryData.header_parsed),
        fontWeight: 'bold',
        display: 'table-cell',
    };
    const { classes, theme } = useEntryStyles();
    return (
        <>
            <div id="entryHeader" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Button leftIcon={<ArrowLeft size={18} />} variant="outline" size="xs" onClick={() => {
                    if (prevPage !== 'loadednull') {
                        router.push('/notes/page/' + prevPage);
                    } else {
                        router.push('/notes');
                    }
                }}>
                    Back to Notebooks
                </Button>
                <Title className={`${classes.headerTitle} page-title`}>
                    {noteId}: {noteData.text_name_final}
                </Title>
                <Button style={{ visibility: 'hidden' }}>
                    Download Fulltext
                </Button>
            </div>
            {/* <Divider my="sm" /> */}
            <Tabs defaultValue="eventinfo">
                <Tabs.List position="center">
                    <Tabs.Tab value="eventinfo" icon={<InfoCircle size={14} />}>Entry Info</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="eventinfo" pt="xs">
                    <Grid style={{ alignSelf: 'center', flexBasis: '90%' }}>
                        <Grid.Col span={3} className={classes.dataLabel}>Who: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{noteData.who}</Grid.Col>
                        <Grid.Col span={3} className={classes.dataLabel}>Year (Estimated): </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{noteData.year_est}</Grid.Col>
                        {noteData.hasOwnProperty('iish_code') &&
                        <>
                        <Grid.Col span={3} className={classes.dataLabel}>IISH Code: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{noteData.iish_code}</Grid.Col>
                        </>
                        }
                    </Grid>
                </Tabs.Panel>
            </Tabs>
        </>
    );
}

export default ChronEntryPage;
