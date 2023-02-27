import { Box, Button, Code, createStyles, Divider, Flex, Grid, Table, Tabs, Text, Title, Tooltip } from "@mantine/core";
import { useRouter } from "next/router";
import { getDocinfoAll, getDocinfoOne, getDocinfoAuths, getDocinfoIdsAirtable } from "@/pages/api/docinfo";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import { ArrowLeft, MessageCircle, Photo, Settings } from "tabler-icons-react";
import { Download } from 'tabler-icons-react';
import { InfoCircle } from "tabler-icons-react";
import { Code as CodeIcon } from 'tabler-icons-react';
import { Prism } from "@mantine/prism";
import DubiousBadge from "@/components/DubiousBadge";
import { getHeaderSize, loadStoredParam, useEntryStyles } from "@/mdbGlobals";

const regToAuth: {[key: string]: string} = {
    E: "Engels",
    M: "Marx",
    ME: "Marx and Engels",
    ST: "[Sources/Translations]"
}
const getAuthName = (regSection: string) => {
    return regToAuth[regSection];
}

export const getStaticProps = async (context: any) => {
    //const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    // console.log("getStaticProps():");
    // console.log(Object.keys(context.params));
    const entryId = context.params.entryId;
    // And get the actual info
    const { docinfo, error } = await getDocinfoOne(entryId);
    return {
        props: {
            entryId: entryId,
            entryData: docinfo,
        }
    }
}

export const getStaticPaths = async () => {
    const allData = await getDocinfoAll();
    const allDocs = allData.documents;
    const allIds = allDocs.map((x) => x.entry_id);
    const allPages = allIds.map((curId) => ({params: {entryId: curId}}));
    const returnObj = {
        paths: allPages,
        fallback: false, // can also be true or 'blocking'
    }
    //console.log("[entryId].tsx, returnObj:");
    //console.log(JSON.stringify(returnObj));
    return returnObj;
}



const RegEntryPage = ({ entryId, entryData }: { entryId: any, entryData: any }) => {
    const router = useRouter();
    const [prevPage, setPrevPage] = useState('notloaded');
    loadStoredParam('regPage', prevPage, setPrevPage);
    const [prevAuth, setPrevAuth] = useState('notloaded');
    loadStoredParam('regAuth', prevAuth, setPrevAuth);
    const { classes, theme } = useEntryStyles();
    const headerStyle = {
        flexGrow: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        // height: '100%',
        fontSize: getHeaderSize(entryData.title),
        fontWeight: 'bold',
        display: 'table-cell',
    };
    const fulltextAvailable = false;
    return (
        <>
        <div id="entryHeader" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Button leftIcon={<ArrowLeft size={18} />} variant="outline" size="xs" onClick={() => {
                if (prevPage !== 'loadednull' && prevAuth !== 'loadednull') {
                    router.push('/reg/' + prevAuth + '/page/' + prevPage);
                } else {
                    router.push('/reg');
                }
                }}>
                Back to Register
            </Button>
                <Title className={`${classes.headerTitle} page-title`}>
            {entryId}: {entryData.title}
            </Title>
            <Tooltip label="Fulltext for this document is not available" position="bottom">
            <Button
              rightIcon={<Download size={18} />}
              variant="filled"
              size="xs"
              data-disabled={!fulltextAvailable}
              sx={{ '&[data-disabled]': { pointerEvents: 'all' } }}
              onClick={() => {
                console.log("fulltext");
                return true;
              }}
            >
                {fulltextAvailable ? "Download Fulltext" : "Fulltext Not Available"}
            </Button>
            </Tooltip>
        </div>
        {/* <Divider my="sm" /> */}
        <Tabs defaultValue="docinfo">
            <Tabs.List position="center">
                <Tabs.Tab value="docinfo" icon={<InfoCircle size={14} />}>Document Info</Tabs.Tab>
                <Tabs.Tab value="rawentry" icon={<CodeIcon size={14} />}>Raw Text Entry</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="docinfo" pt="xs">
                <Grid style={{ alignSelf: 'center', flexBasis: '90%', tableLayout: 'fixed' }}>
                    <Grid.Col span={3} className={classes.dataLabel}>Author: </Grid.Col>
                    <Grid.Col span={3} className={classes.dataEntry}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center', verticalAlign: 'middle' }}>
                            <div style={{ flexGrow: 999 }}>
                                {getAuthName(entryData.reg_section)}
                            </div>
                            {entryData.dubious && 
                                <div style={{ paddingLeft: 10 }}>
                                    {entryData.dubious && <DubiousBadge />}
                                </div>
                            }
                        </div>
                    </Grid.Col>
                    <Grid.Col span={3} className={classes.dataLabel}>Original Language: </Grid.Col>
                    <Grid.Col span={3}>{entryData.lang_orig}</Grid.Col>
                    <Grid.Col span={3} className={classes.dataLabel}>Writing Date: </Grid.Col>
                    <Grid.Col span={3}>
                        {entryData.date_final}
                    </Grid.Col>
                    <Grid.Col span={3} className={classes.dataLabel}>Publication Date: </Grid.Col>
                    <Grid.Col span={3}>
                        {entryData.date_final}
                    </Grid.Col>
                    <Grid.Col span={3} className={classes.dataLabel}>Source: </Grid.Col>
                    <Grid.Col span={3}>{entryData.source}</Grid.Col>
                    {entryData.hasOwnProperty('written') &&
                        <>
                        <Grid.Col span={3} className={classes.dataLabel}>Written: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{entryData.written}</Grid.Col>
                        </>
                    }
                    <Grid.Col span={3} className={classes.dataLabel}>Published: </Grid.Col>
                    <Grid.Col span={3}>{entryData.published}</Grid.Col>
                    {/* Title in original language */}
                    {entryData.hasOwnProperty('german_title') &&
                        <>
                        <Grid.Col span={3} className={classes.dataLabel}>German Title: </Grid.Col>
                        <Grid.Col span={3}>{entryData.german_title}</Grid.Col>
                        </>
                    }
                    {entryData.hasOwnProperty('french_title') &&
                        <>
                        <Grid.Col span={3} className={classes.dataLabel}>French Title: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataLabel}>{entryData.french_title}</Grid.Col>
                        </>
                    }
                    {entryData.hasOwnProperty('more_info') &&
                        <>
                        <Grid.Col span={3} className={classes.dataLabel}>Additional Info: </Grid.Col>
                        <Grid.Col span={9}>{entryData.more_info}</Grid.Col>
                        </>
                    }
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
                              style={{ flexGrow: 0, flexBasis: '90%', maxWidth: '80%', alignSelf: 'center', wordWrap: 'normal', fontSize: '12pt' }}
                              copyLabel="Copy to clipboard"
                              copiedLabel="Copied to clipboard!"
                              className="pre-with-wrap"
                            >
                                {entryData.full_text}
                            </Prism>
                    </Flex>
            </Tabs.Panel>
        </Tabs>
        </>
    );
}

export default RegEntryPage;
