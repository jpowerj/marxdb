import { getEventsAll } from "@/pages/api/event";
import { Button, Flex, Grid, Table, Tabs, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowLeft, Download, InfoCircle } from "tabler-icons-react";
import { Code as CodeIcon } from "tabler-icons-react";
import { getBooksAll, getBooksOne } from "@/pages/api/book";
import { useEntryStyles } from "@/mdbGlobals";
import { loadStoredParam } from "@/mdbGlobals";
import _ from 'lodash';

export const getStaticProps = async (context: any) => {
    const entryId = context.params.bookId;
    const { bookData, error } = await getBooksOne(entryId);
    return {
        props: {
            bookId: entryId,
            bookData: bookData,
            error: error,
        }
    }
}

export const getStaticPaths = async () => {
    const allEventData = await getBooksAll();
    const allEvents = allEventData.books;
    const allIds = allEvents.map((x) => x.entry_id);
    const allPages = allIds.map((curId) => ({ params: { bookId: curId } }));
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

const BookEntryPage = ({ bookId, bookData }: { bookId: string, bookData: any }) => {
    const router = useRouter();
    const [prevPage, setPrevPage] = useState('notloaded');
    loadStoredParam('bookPage', prevPage, setPrevPage);
    const { classes, theme } = useEntryStyles();
    return (
        <>
            <div id="entryHeader" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Button leftIcon={<ArrowLeft size={18} />} variant="outline" size="xs" onClick={() => {
                    if (prevPage !== 'loadednull') {
                        router.push('/books/page/' + prevPage);
                    } else {
                        router.push('/books');
                    }
                }}>
                    Back to Bookshelf
                </Button>
                <Title className={`${classes.headerTitle} page-title`}>
                    {bookId}: {_.truncate(bookData.title, {'length':50})}
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
                        <Grid.Col span={3} className={classes.dataLabel}>Author: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{bookData.auth_full}</Grid.Col>
                        <Grid.Col span={3} className={classes.dataLabel}>Bookshelf: </Grid.Col>
                        <Grid.Col span={3} className={classes.dataEntry}>{bookData.who}</Grid.Col>
                        <Grid.Col span={3} className={classes.dataLabel}>Full Title: </Grid.Col>
                        <Grid.Col span={9} className={classes.dataEntry}>{bookData.title}</Grid.Col>
                    </Grid>
                </Tabs.Panel>
            </Tabs>
        </>
    );
}

export default BookEntryPage;
