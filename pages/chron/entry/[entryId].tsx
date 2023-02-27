import { getEventsAll } from "@/pages/api/event";
import { Button, Flex, Grid, Table, Tabs, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowLeft, Download, InfoCircle } from "tabler-icons-react";
import { Code as CodeIcon } from "tabler-icons-react";
import { getEventsOne } from "@/pages/api/event";
import { useEntryStyles } from "@/mdbGlobals";
import { loadStoredParam } from "@/mdbGlobals";

const PAGE_SIZE = 20;
export const getStaticProps = async (context: any) => {
    //const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    // console.log("getStaticProps():");
    // console.log(Object.keys(context.params));
    const entryId = context.params.entryId;
    const { eventData, error } = await getEventsOne(entryId);
    return {
        props: {
            entryId: entryId,
            entryData: eventData,
            error: error,
        }
    }
}

export const getStaticPaths = async () => {
    const allEventData = await getEventsAll();
    const allEvents = allEventData.events;
    const allIds = allEvents.map((x) => x.entry_id);
    const allPages = allIds.map((curId) => ({ params: { entryId: curId } }));
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



const ChronEntryPage = ({ entryId, entryData }: { entryId: any, entryData: any }) => {
    const router = useRouter();
    const [prevPage, setPrevPage] = useState('notloaded');
    loadStoredParam('chronPage', prevPage, setPrevPage);
    const [prevYear, setPrevYear] = useState('notloaded');
    loadStoredParam('chronYear', prevYear, setPrevYear);
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
                    if (prevPage !== 'loadednull' && prevYear !== 'loadednull') {
                        router.push('/chron/' + prevYear + '/page/' + prevPage);
                    } else {
                        router.push('/chron');
                    }
                }}>
                    Back to Chronicle
            </Button>
            <Title className={`${classes.headerTitle} page-title`}>
                    {entryId}: {entryData.header_parsed}
            </Title>
            <Button style={{ visibility: 'hidden' }}>Download Fulltext</Button>
        </div>
        {/* <Divider my="sm" /> */}
        <Tabs defaultValue="eventinfo">
            <Tabs.List position="center">
                    <Tabs.Tab value="eventinfo" icon={<InfoCircle size={14} />}>Event Info</Tabs.Tab>
                    <Tabs.Tab value="rawentry" icon={<CodeIcon size={14} />}>Raw Text Entry</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="eventinfo" pt="xs">
                <Grid style={{ alignSelf: 'center', flexBasis: '90%' }}>
                    <Grid.Col span={3} className={classes.dataLabel}>Date: </Grid.Col>
                    <Grid.Col span={3} className={classes.dataEntry}>{entryData.date_final}</Grid.Col>
                    <Grid.Col span={3} className={classes.dataLabel}>Who: </Grid.Col>
                    <Grid.Col span={3} className={classes.dataEntry}>{entryData.who}</Grid.Col>
                </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="rawentry">
                <Flex
                    mih={50}
                    gap="md"
                    justify="center"
                    align="center"
                    direction="row"
                    pt={5}
                // wrap="nowrap"
                // style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                >
                    <Prism
                        language="less"
                        style={{ flexGrow: 0, flexBasis: '80%', maxWidth: '80%', alignSelf: 'center', wordWrap: 'normal', fontSize: '12pt' }}
                        copyLabel="Copy to clipboard"
                        copiedLabel="Copied to clipboard"
                        className="pre-with-wrap"
                    >
                        {entryData.text}
                    </Prism>
                </Flex>
            </Tabs.Panel>
        </Tabs>
        </>
    );
}

export default ChronEntryPage;
