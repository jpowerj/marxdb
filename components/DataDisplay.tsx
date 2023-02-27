import { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Badge, Button, Card, Center, createStyles, Paper, Text, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import { Group } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { Eye } from 'tabler-icons-react';
import { Edit } from 'tabler-icons-react';
import { Trash } from 'tabler-icons-react';
import { Heart } from 'tabler-icons-react';
import { Link as LinkIcon } from 'tabler-icons-react';
import { ExternalLink } from 'tabler-icons-react';
import { ChevronRight } from 'tabler-icons-react';
import { Allotment, setSashSize } from "allotment";
import SelectionContext from '@/contexts/selection';
import ScrollContext from '@/contexts/scroll';
import { ScrollArea } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';

const useStyles = createStyles((theme) => {
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

        section: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            padding: theme.spacing.md,
        },

        sectionBlank: {
            padding: theme.spacing.md,
        },

        sectionCenter: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
            paddingBottom: theme.spacing.md,
            alignItems: 'center',
            alignContent: 'center',
        },

        sectionStretch: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            padding: theme.spacing.md,
            flexGrow: 1,
            alignSelf: 'stretch'
        },

        linkIcon: {
            // color: theme.colors.red[6],
            color: 'black',
        },

        label: {
            textTransform: 'uppercase',
            fontSize: theme.fontSizes.xs,
            fontWeight: 700,
        },

        header: {
            alignSelf: 'center'
        },

        selectedRow: {
            backgroundColor: theme.fn.lighten(baseColor, 0.85) + '!important',
            // color: 'red',
            fontWeight: 600,
            strokeWidth: 4,
            // This works (to bold the id), but looks ugly
            // '& > td:first-of-type': {
            //     fontWeight: 700
            // }
        },

        nonSelectedRow: {
            backgroundColor: 'white',
            background: 'blue',
        }
    }
});

const PAGE_SIZE = 20;

const TablePane = ({ entries, totalEntries, selectedId, setSelectedId }: { entries: any, totalEntries: number, selectedId: any, setSelectedId: any }) => {
    const { classes, theme } = useStyles();
    //const {selectedId, setSelectedId} = useContext(SelectionContext);
    const [page, setPage] = useLocalStorage<number>({ key: 'regPage', defaultValue: 1});
    const [allRecords, setAllRecords] = useState(entries);
    const [visibleRecords, setVisibleRecords] = useState<any>(allRecords.slice(0, PAGE_SIZE));
    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        const recSlice = allRecords.slice(from, to)
        setVisibleRecords(recSlice);
    }, [page, allRecords]);
    const updatePage = (p: number) => {
        // If they're going to a new page, have to load the records
        setPage(p);
    };
    // const [pr, setPR] = useState(false);
    // useEffect(() => {
    //     if (!pr) {
    //         console.log("totalEntries: " + totalEntries);
    //         setPR(true);
    //     }
    // }, [])
    //const { scrollRef } = useContext(ScrollContext);
    // https://stackoverflow.com/questions/64052148/how-to-change-scroll-behavior-while-going-back-in-next-js
    useEffect(() => {
        const scrollArea = document.getElementsByClassName("mantine-ScrollArea-root")[0];
        const handleScroll = () => {
            console.log("handleScroll");
            //console.log(eventData);
        }
        scrollArea.addEventListener('scroll', handleScroll, false);
        return () => {
            scrollArea.removeEventListener("scroll", handleScroll, false);
        };
    }, []);
    return (
        /*
        <Card withBorder radius="md" p="md" className={classes.card}>
        */
        <DataTable
            textSelectionDisabled
            withBorder
            borderRadius="md"
            highlightOnHover
            // shadow="xs"
            totalRecords={totalEntries}
            recordsPerPage={PAGE_SIZE}
            page={page}
            onPageChange={(p) => updatePage(p)}
            style={{ height: '100%' }}
            // sx={{ ["& tr"]: { backgroundColor: undefined } }}
            rowClassName={({ id }) => {
                // if (id === selectedId) {
                //     console.log("id === selectedId = " + selectedId);
                // }
                return (id === selectedId ? classes.selectedRow : classes.nonSelectedRow)
            }}
            columns={[
                { accessor: 'id' },
                { accessor: 'title' },
                {
                    accessor: 'actions',
                    title: <Text mr="xs"></Text>,
                    textAlignment: 'right',
                    render: (entry: any) => (
                        <Group spacing={4} position="right" noWrap>
                            <ChevronRight size={16} strokeWidth={2} />
                        </Group>
                    ),
                },
            ]}
            records={visibleRecords}
            onRowClick={(entry, rowIndex) => {
                console.log("Row clicked. " + rowIndex + ", entry id = " + entry.id);
                setSelectedId(entry.id);
            }}
            // uncomment the next line to use a custom pagination text
            paginationText={({ from, to, totalRecords }) => `${from}-${to} of ${totalRecords}`}
            // uncomment the next line to use a custom pagination size
            paginationSize="xs"
        />
        /*
        </Card>
        */
    );
}

// https://github.com/mantinedev/ui.mantine.dev/blob/master/components/BadgeCard/BadgeCard.tsx
const InfoPane = ({ entries, selectedId, setSelectedId }: {entries: any, selectedId: any, setSelectedId: any}) => {
    const { classes, theme } = useStyles();
    const router = useRouter();
    const features = (
        <Badge>
            Custom Badge
        </Badge>
    )
    return (
        <Card
            withBorder
            radius="md"
            className={classes.card}
        //   shadow="xs"
        >
            <Card.Section mt="md" className={selectedId >= 1 ? classes.section : classes.sectionBlank}>
                <Group position="apart">
                    <Text size="lg" weight={500}>
                        {selectedId >= 1
                          ? selectedId + ": " + entries[selectedId-1].title
                          : "Select an entry to view details!"
                        }
                    </Text>
                </Group>
                <Text size="sm" mt="xs">
                    {selectedId >= 1 ? "May 5, 1842" : ""}
                </Text>
            </Card.Section>

            <Card.Section className={classes.sectionStretch}>
                {selectedId >= 1 && entries[selectedId-1].body}
            </Card.Section>

            <Card.Section className={classes.section}>
                <Group spacing={7}>
                    {features}
                </Group>
            </Card.Section>

            <Group mt="xs" mb="0">
                <Link
                  style={{ flex: 1 }}
                  href={router.route + '/' + selectedId}
                  //target="_blank"
                  //rel="noopener noreferrer"
                  //href="#"
                  passHref>
                    <Button
                      style={{ width: '100%' }}
                      // onClick={() => (console.log(router.asPath))}
                    >
                        <ExternalLink size={18} />
                        <Text ml={3}>More details</Text>
                    </Button>
                </Link>
                <Tooltip
                    label="Copy Link"
                    color="black"
                    withArrow
                >
                <ActionIcon variant="default" radius="md" size={36}>
                    <LinkIcon size={18} className={classes.linkIcon} />
                </ActionIcon>
                </Tooltip>
            </Group>
        </Card>
    );
}

const DataDisplay = ({ entries, totalEntries, title }: { entries: any, totalEntries: number, title: string }) => {
    const { classes, theme } = useStyles();
    //const {selectedId, setSelectedId} = useContext(SelectionContext);
    const [selectedId, setSelectedId] = useLocalStorage({ key: 'selectedRegId', defaultValue: -1 });
    if (typeof window !== 'undefined') {
        setSashSize(5);
    }
    // check theme on component mount
    // useEffect(() => {
    //     selectionCheck();
    // }, []);
    // check and reset theme
    // const selectionCheck = () => {
    //     const storageResult = localStorage.getItem("selectedRegId");
    //     if ((storageResult !== null) && (storageResult !== selectedId)) {
    //         console.log("Restoring selected id from localStorage: " + storageResult);
    //         setSelectedId(storageResult);
    //     }
    // }
    return (
        <div className="container" style={{ flexGrow: 999, display: 'flex', flexDirection: 'column' }}>
            <Paper withBorder radius="md" p={0} className={classes.card} style={{ width: '100%', height: 'auto' }}>
                <Center style={{ height: 40, width: '100%', alignSelf: 'stretch' }}>
                    <Text size="xl" weight={500}>
                        {title}
                    </Text>
                </Center>
            </Paper>
            <div
                className="dataContainer"
                style={{ flexGrow: 999, display: 'flex', height: '60vh', flexDirection: 'row' }}
            >
                <Allotment defaultSizes={[34, 66]}>
                    <Allotment.Pane minSize={200} preferredSize="50%">
                        {/* <div style={{ width: '50%', flexShrink: 0 }} className="reg-table"> */}
                        <TablePane entries={entries} totalEntries={totalEntries} selectedId={selectedId} setSelectedId={setSelectedId} />
                    </Allotment.Pane>
                    {/* </div> */}
                    {/* <div className="sash" style={{ width: "3pt", flexShrink: 1 }}></div> */}
                    <Allotment.Pane minSize={200} preferredSize="50%">
                        <InfoPane entries={entries} selectedId={selectedId} setSelectedId={setSelectedId} />
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
}

export default DataDisplay;

{/*
            {docInfos.map(docInfo => (
                <Link href={'/reg/' + docInfo.id} key={docInfo.id} className={styles.single}>
                    <h3>{ docInfo.name }</h3>
                </Link>
            ))}
*/}