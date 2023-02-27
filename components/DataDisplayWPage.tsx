import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react';
import { Badge, Button, Card, Center, createStyles, Paper, Text, Title, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Group } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { Link as LinkIcon } from 'tabler-icons-react';
import { ExternalLink } from 'tabler-icons-react';
import { ChevronRight } from 'tabler-icons-react';
import { Allotment, setSashSize } from "allotment";
import { ScrollArea } from '@mantine/core';
import { useScrollIntoView } from '@mantine/hooks';
import TablePane from './TablePane';
import InfoPane from './InfoPane';

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
        sectionCenter: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
            paddingBottom: theme.spacing.md,
            alignItems: 'center',
            alignContent: 'center',
        },
        label: {
            textTransform: 'uppercase',
            fontSize: theme.fontSizes.xs,
            fontWeight: 700,
        },

        header: {
            alignSelf: 'center'
        },
        pageTitle: {
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
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
        tableFilter: {
            paddingTop: 0,
        },
        nonSelectedRow: {
            backgroundColor: 'white',
            background: 'blue',
        }
    }
});

const LinkWrapper = ({ href, ...props }: {href: any}) => {
    if (href == "#") {
        return <button {...props}>Click Here</button>;
    }
    return (
        <Link href={href} {...props}>
            <Button>Click Here</Button>
        </Link>
    );
};

const printAndReturn = (theObj: any) => {
    console.log("printAndReturn");
    console.log(theObj);
    return theObj;
}

const allotmentSplit = [50, 50];

interface DataDisplayProps {
    entries: any,
    totalEntries: number,
    page: number,
    title: string,
    pageVar: string,
    filterVar: string | null,
    filterValues: any | null,
    filterData?: any | null,
    selectedFilter: string | null,
    colSpec: any,
    badgeSpec: any,
    infoSpec: any,
    dbRootPath: string
}

const DataDisplayWPage = ({ entries, totalEntries, page, title, pageVar, filterVar, filterValues, filterData = null, selectedFilter, colSpec, badgeSpec, infoSpec, dbRootPath }: DataDisplayProps) => {
    const { classes, theme } = useStyles();
    //const {selectedId, setSelectedId} = useContext(SelectionContext);
    const [selectedId, setSelectedId] = useLocalStorage({ key: 'selectedRegId', defaultValue: 'none' });
    if (typeof window !== 'undefined') {
        setSashSize(5);
    }
    // handle what happens on key press
    const handleKeyPress = useCallback((event: any) => {
        console.log(`Key pressed: ${event.key}`);
    }, []);

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
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
        <div className="container" style={{ flexGrow: 999, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Paper
              //withBorder
              radius="md"
              p={0}
              mb={7}
              className={classes.card}
              style={{ width: '100%', height: 'auto', borderTop: '0px solid gray', borderBottom: '0px solid gray' }}
            >
                <Center style={{ height: 40, width: '100%', alignSelf: 'stretch', borderTop: '1px solid rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(0,0,0,0.25)' }}>
                    <Title order={3} weight={700}>
                        {title}
                    </Title>
                </Center>
            </Paper>
            <div
                className="dataContainer"
                style={{ flexGrow: 999, display: 'flex', height: '60vh', flexDirection: 'row', width: '100%' }}
            >
                <Allotment defaultSizes={allotmentSplit}>
                    <Allotment.Pane minSize={200} preferredSize="50%">
                        {/* <div style={{ width: '50%', flexShrink: 0 }} className="reg-table"> */}
                        <TablePane entries={entries} totalEntries={totalEntries} selectedId={selectedId} setSelectedId={setSelectedId} page={page} filterVar={filterVar} filterValues={filterValues} filterData={filterData} selectedFilter={selectedFilter} colSpec={colSpec} dbRootPath={dbRootPath} customStyles={classes} />
                    </Allotment.Pane>
                    <Allotment.Pane minSize={250} preferredSize="50%">
                        <InfoPane entries={entries} selectedId={selectedId} currentPage={page} pageVar={pageVar} filterVar={filterVar} selectedFilter={selectedFilter} badgeSpec={badgeSpec} infoSpec={infoSpec} dbRootPath={dbRootPath} />
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
}

export default DataDisplayWPage;
