import { Button, Flex, Grid, Table, Tabs, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowLeft, Download, InfoCircle } from "tabler-icons-react";
import { Code as CodeIcon } from "tabler-icons-react";
import { useEntryStyles } from "@/mdbGlobals";
import { loadStoredParam } from "@/mdbGlobals";
import { getLettersAll, getLettersOne } from "@/pages/api/letter";

export const getStaticProps = async (context: any) => {
    const entryId = context.params.letterId;
    const { letterData, error } = await getLettersOne(entryId);
    return {
        props: {
            letterId: entryId,
            letterData: letterData,
            error: error,
        }
    }
}

export const getStaticPaths = async () => {
    const allLetterData = await getLettersAll();
    const allLetters = allLetterData.letters;
    const allIds = allLetters.map((x) => x.entry_id);
    const allPages = allIds.map((curId) => ({ params: { letterId: curId } }));
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

const LetterEntryPage = ({ letterId, letterData }: { letterId: any, letterData: any }) => {
    const router = useRouter();
    const [prevPage, setPrevPage] = useState('notloaded');
    loadStoredParam('glossPage', prevPage, setPrevPage);
    const [prevFilter, setPrevFilter] = useState('notloaded');
    loadStoredParam('glossFilter', prevFilter, setPrevFilter);
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
                    if (prevPage !== 'loadednull' && prevFilter !== 'loadednull') {
                        router.push('/gloss/' + prevFilter + '/page/' + prevPage);
                    } else {
                        router.push('/gloss');
                    }
                }}>
                    Back to Chronicle
                </Button>
                <Title className={`${classes.headerTitle} page-title`}>
                    {letterId}
                </Title>
                <Button style={{ visibility: 'hidden' }}>Download Fulltext</Button>
            </div>
            {/* <Divider my="sm" /> */}
            <Tabs defaultValue="eventinfo">
                <Tabs.List position="center">
                    <Tabs.Tab value="eventinfo" icon={<InfoCircle size={14} />}>Event Info</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="eventinfo" pt="xs">
                    <Grid style={{ alignSelf: 'center', flexBasis: '90%' }}>
                        <Grid.Col span={3} className={classes.dataLabel}>Date: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataLabel}>{letterData.date_full}</Grid.Col>
                        <Grid.Col span={3} className={classes.dataLabel}>From: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{letterData.from}</Grid.Col>
                        <Grid.Col span={3} className={classes.dataLabel}>To: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{letterData.to_parsed_linked}</Grid.Col>
                    </Grid>
                </Tabs.Panel>
            </Tabs>
        </>
    );
}

export default LetterEntryPage;
