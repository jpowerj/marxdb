import Link from 'next/link';
import styles from '../styles/HomeGrid.module.css'
import { Book2 } from 'tabler-icons-react';
import { CalendarEvent } from 'tabler-icons-react';
import { Mail } from 'tabler-icons-react';
import { Notebook } from 'tabler-icons-react';
import { Books } from 'tabler-icons-react';
import { ZoomQuestion } from 'tabler-icons-react';
import { createStyles, SimpleGrid } from '@mantine/core';
import { Flex } from '@mantine/core';
import useFitText from "use-fit-text";

const useStyle = createStyles((theme) => {
    return {
        gridIcon: {
            verticalAlign: 'middle',
            marginRight: '4px',
            alignContent: 'center',
            alignSelf: 'center',
            height: '100%'
        },
        gridHeader: {
            display: 'inline-flex',
            alignItems: 'center'
        },
        gridTotal: {
            fontStyle: 'italic',
            //fontWeight: 'bold',
            //textDecoration: 'underline',
            borderBottom: '1px dashed black',
            //backgroundColor: 'rgba(0,112,243,0.25)',
            //backgroundColor: 'rgba(231,245,255,1.0)',
            //paddingLeft: '6px',
            //paddingRight: '3px',
        }
    }
})

const useGridData = (classes: any, ftArray: any[]) => {
    return [
    {
        title: 'Register',
        path: '/reg',
        desc: 'A listing of every work, original and in translation, attributed to Marx and/or Engels',
        total: '2,560 works',
        icon: <Book2 className={classes.gridIcon} />,
        ftObj: ftArray[0],
    },
    {
        title: 'Chronicle',
        path: '/chron',
        desc: 'A daily account of Marx and Engels\' travels, readings, and writings, 1818-1895.',
        total: '7,445 events',
        icon: <CalendarEvent className={classes.gridIcon} />,
        ftObj: ftArray[1],
    },
    {
        title: 'Correspondence',
        path: '/letters',
        desc: 'All known letters sent to or from Marx and Engels',
        total: '3,948 letters',
        icon: <Mail className={classes.gridIcon} />,
        ftObj: ftArray[2],
    },
    {
        title: 'Notebooks',
        path: '/notes',
        desc: 'A catalog of Marx and Engels\' 198 surviving notebooks.',
        total: '1,767 notebook entries',
        icon: <Notebook className = { classes.gridIcon } />,
        ftObj: ftArray[3],
    },
    {
        title: 'Bookshelf',
        path: '/books',
        desc: 'Every book in Marx or Engels\' bookshelves (with inscriptions, marginalia, etc.)',
        total: '1,450 books',
        icon: <Books className={classes.gridIcon} />,
        ftObj: ftArray[4],
    },
    {
        title: 'Glossary',
        path: '/gloss',
        desc: 'All people, places, and events mentioned across MarxDB.',
        total: '3,589 entries',
        icon: <ZoomQuestion className={classes.gridIcon} />,
        ftObj: ftArray[5],
    }
    ];
}

// https://tabler-icons-react.vercel.app/
const HomeGrid = () => {
    const { classes, theme } = useStyle();
    // This should work but... wcyd
    //const ftArray = Array.from({ length: 6 }, (_, i) => useFitText());
    const ftOptions = {minFontSize: 30, maxFontSize: 125};
    const ftArray = [useFitText(ftOptions), useFitText(ftOptions), useFitText(ftOptions), useFitText(ftOptions), useFitText(ftOptions), useFitText(ftOptions)];
    const gridData = useGridData(classes, ftArray);
    return (
        <Flex direction="column" style={{ flexGrow: 1 }}>
        <h1 className={styles.title}>
            Welcome to MarxDB: The Marx-Engels Digital Encyclopedia!
        </h1>
        <p className={styles.description}>
            Choose a database below to get started
        </p>
        <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs" style={{ flexGrow: 1 }}>
            {gridData.map((curData: any) => (
                <Link href={curData.path} className={styles.card} key={curData.title}>
                    <h2 className={classes.gridHeader}>
                        {curData.icon}
                        {curData.title} &rarr;
                    </h2>
                    <div ref={curData.ftObj.ref} style={{ fontSize: curData.ftObj.fontSize}}>
                        {curData.desc}&nbsp;<span className={classes.gridTotal}>{curData.total}</span>
                    </div>
                </Link>
            ))}
        </SimpleGrid>
        </Flex>
    );
}

export default HomeGrid;
