import { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { ActionIcon, Button, MediaQuery, Menu, Text } from '@mantine/core';
import { createStyles, Header, Autocomplete, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AboutModal from './AboutModal';
import HelpModal from './HelpModal';
import { useRouter } from 'next/router';
import { QuestionMark } from 'tabler-icons-react';
import { ChevronDown } from 'tabler-icons-react';


const useStyles = createStyles((theme) => ({
    activeLogo: {
        color: '#0070f3',
        //textShadow: '0 0 0.5px #0070f3'
    },
    header: {
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        marginBottom: 8,
        width: '100%',
    },
    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        // color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.md,
        fontWeight: 600,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
    activeLink: {
        color: '#0070f3',
        //textShadow: '0 0 1px #0070f3'
        //borderBottom: '1px dashed black',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
    inner: {
        height: 50,
        display: 'flex',
        // justifyContent: 'space-between',
        alignItems: 'center',
    },
    innerSplit: {
        height: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // links: {
    //     [theme.fn.smallerThan('md')]: {
    //         display: 'none',
    //     },
    // },
    logoLink: {
        fontSize: theme.fontSizes.lg
    },
    menuButton: {
        color: 'black',
        fontWeight: 600,
        fontSize: theme.fontSizes.md,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
        '&[data-expanded]': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }
    },
    search: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },
    
    aboutButton: {
        // color: 'black',
        // border: '1px solid black'
    },
    qButton: {
        background: '#0070f3'
    }
}));

const visibleLinks = [
    { label: 'Register', path: '/reg' },
    { label: 'Chronicle', path: '/chron' },
    { label: 'Letters', path: '/letters' },
];

const menuLinks = [
    { label: 'Notebooks', path: '/notes' },
    { label: 'Bookshelf', path: '/books' },
    { label: 'Glossary', path: '/gloss' },
];

function HeaderComponent() {
    const [aboutModalOpened, setAboutModalOpened] = useState(false);
    const [helpModalOpened, setHelpModalOpened] = useState(false);
    const router = useRouter();
    const { classes } = useStyles();
    const visibleItems = visibleLinks.map((link) => (
        <Link
            key={link.label}
            href={link.path}
            className={`${classes.link} ${router.pathname.startsWith(link.path) ? classes.activeLink : ''}`}
        // onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </Link>
    ));
    const menuItems = menuLinks.map((link) => (
        <Link
            key={link.label}
            href={link.path}
            className={`${classes.link} ${router.pathname.startsWith(link.path) ? classes.activeLink : ''}`}
        // onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </Link>
    ));
    return (
        <>
            <HelpModal opened={helpModalOpened} setOpened={setHelpModalOpened} />
            <AboutModal opened={aboutModalOpened} setOpened={setAboutModalOpened} />
        <Header height={50} className={classes.header}>
            <div className="header-content">
                <div className={classes.innerSplit}>
                    <Group spacing={3}>
                        <Link href="/" style={{ marginRight: 5 }}>
                            <Text style={{ fontWeight: 'bold' }} className={`${classes.logoLink} ${router.pathname === "/" ? classes.activeLogo : ''}`}>MarxDB</Text>
                        </Link>
                        {visibleItems}
                        <Menu trigger="hover" openDelay={0} closeDelay={200}>
                            <Menu.Target>
                                    <Button rightIcon={<ChevronDown />} variant="white" className={classes.menuButton}>More</Button>
                            </Menu.Target>
                                <Menu.Dropdown>
                            {menuItems}
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                    <Group mr={0}>
                        <ActionIcon variant='filled' radius="xl" className={classes.qButton} onClick={() => setHelpModalOpened(true)}>
                            <QuestionMark />
                        </ActionIcon>
                        <Button
                          onClick={() => setAboutModalOpened(true)}
                          variant="outline"
                          className={classes.aboutButton}
                        >
                            About
                        </Button>
                    </Group>
                </div>
            </div>
        </Header>
        </>
    );
}

export default HeaderComponent;