import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ExternalLink } from "tabler-icons-react";
import { Link as LinkIcon } from "tabler-icons-react";
import { InfoCircle } from "tabler-icons-react";
import { ArrowNarrowRight } from 'tabler-icons-react';
import { CopyButton, createStyles, Grid } from "@mantine/core";
import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Group,
    ScrollArea,
    Text,
    Tooltip,
UnstyledButton } from "@mantine/core";
import { Check } from "tabler-icons-react";
import { Copy } from "tabler-icons-react";
import DubiousBadge from "./DubiousBadge";
import { useEffect } from "react";
import { getIISHLink } from "@/mdbGlobals";
import { InfoSquare } from 'tabler-icons-react';

const useStyles = createStyles((theme) => {
    const baseColor = theme.colors[theme.primaryColor][6];
    //console.log("baseColor: " + baseColor);
    return {
        badgeSection: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            padding: theme.spacing.sm / 2,
            //flexGrow: 0,
        },
        card: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
            alignContent: 'stretch',
            height: '100%',
            borderWidth: 1,
        },
        linkIcon: {
            // color: theme.colors.red[6],
            color: 'black',
        },
        section: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            padding: theme.spacing.sm,
            flexGrow: 0,
            flexShrink: 1,
        },
        sectionHeader: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            margin: 0,
            padding: theme.spacing.sm,
            alignSelf: 'auto',
        },
        sectionStretch: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
            padding: 0,
            flexGrow: 999,
            alignSelf: 'stretch',
        },
        sectionBlank: {
            padding: theme.spacing.sm,
            flexGrow: 0,
        },
    }
});

const LinkButton = ({ isDisabled, href, buttonOnClick, children, ...props }: { isDisabled: boolean, href: string, buttonOnClick: any, children: any }) => {
    const buttonStyle = isDisabled ? { flex: 1 } : { width: '100%' }
    const theButton = (
        <Button
            style={buttonStyle}
            onClick={(event) => {
                if (isDisabled) {
                    return event.preventDefault();
                } else {
                    return buttonOnClick();
                }
            }}
            disabled={isDisabled}
            rightIcon={<ArrowNarrowRight size={18} />}
            {...props}
        >
            {children}
        </Button>
    );
    if (isDisabled) {
        return theButton;
    }
    return (
        <Link
            style={{ flex: 1 }}
            href={href}
            //target="_blank"
            //rel="noopener noreferrer"
            //href="#"
            passHref={!isDisabled}>
            {theButton}
        </Link>
    );
}

const getEntryWithId = (entryId: string, allEntries: any) => {
    const result = allEntries.filter((entry: any) => (entry.entry_id === entryId));
    if (result.length > 0) {
        //console.log("[getEntryWithId] Found entry with id " + entryId + ": " + result[0].title)
        return result[0];
    }
    return null;
}

const badgeColorMap: any = {
    German: 'blue',
    French: 'red',
    English: 'green',
}
const getLangBadgeColor = (lang: string) => {
    let badgeColor = 'gray';
    if (lang in badgeColorMap) {
        badgeColor = badgeColorMap[lang];
    }
    //console.log("getLangBadgeColor: returning " + badgeColor);
    return badgeColor;
}

const printThenCall = (fn: any) => {
    console.log("printThenCall");
    return fn;
}

const getEntryTitle = (selectedId: any, entries: any, infoSpec: any) => {
    let truncated = false;
    let mainTitleStr = getEntryWithId(selectedId, entries)[infoSpec.titleVar];
    if (mainTitleStr.length > 150) {
        truncated = true;
        mainTitleStr = mainTitleStr.substring(0,150)
    }
    let titleSep = '';
    let subtitleStr = '';
    if (infoSpec.hasOwnProperty('subtitleVar') && infoSpec.subtitleVar !== null) {
        // Get the separator
        titleSep = ': ';
        if (infoSpec.hasOwnProperty('titleSep')) {
            titleSep = infoSpec.titleSep;
        }
        subtitleStr += getEntryWithId(selectedId, entries)[infoSpec.subtitleVar];
    }
    return {
        titleStr: mainTitleStr + titleSep + subtitleStr,
        titleTruncated: truncated,
    };
}

const getBadgeVals: any = (selectedId: string, entries: any, varName: string) => {
    const entry = getEntryWithId(selectedId, entries)[varName];
    if (typeof entry === 'string') {
        return [entry];
    } else {
        return entry;
    }
}

// https://github.com/mantinedev/ui.mantine.dev/blob/master/components/BadgeCard/BadgeCard.tsx
const InfoPane = ({ entries, selectedId, currentPage, pageVar, filterVar, selectedFilter, badgeSpec, infoSpec, dbRootPath }: { entries: any, selectedId: string, currentPage: any, pageVar: string, filterVar: string|null, selectedFilter: string|null, badgeSpec: any, infoSpec: any, dbRootPath: string }) => {
    const router = useRouter();
    const { classes, theme } = useStyles();
    return (
        <Card
            withBorder
            radius="md"
            className={classes.card}
            p={0}
        >
            <Card.Section className={selectedId !== 'none' ? classes.sectionHeader : classes.sectionBlank}>
                <Group position="apart" style={{ flexWrap: 'nowrap' }}>
                    <Text size="lg" weight={500} key="entryTitle">
                        {(selectedId !== 'none') && (getEntryWithId(selectedId, entries) !== null)
                            ? (<><span>
                                {getEntryTitle(selectedId, entries, infoSpec).titleStr}
                                </span>
                                {getEntryTitle(selectedId, entries, infoSpec).titleTruncated &&
                                <Tooltip
                                   label={"(Click \"More Details\" below for full title)"}
                                   
                                >
                                  <span style={{ border: '1px dashed black', cursor: 'help' }}>&nbsp;[...]&nbsp;</span>
                                </Tooltip>
                                }
                            </>)
                            : "Select an entry to view details!"
                        }
                    </Text>
                    { getEntryWithId(selectedId, entries) !== null && 
                    <div style={{ alignSelf: 'flex-start'}}>
                    <CopyButton value="test" timeout={2000} key="copyButton">
                    {({ copied, copy }) => (
                        <Tooltip
                            label={copied ? 'Link Copied!' : 'Copy Link'}
                            color="black"
                            withArrow
                        >
                            <ActionIcon
                              variant="default"
                              radius="md"
                              size={36}
                              color={copied ? 'teal' : 'black'}
                              onClick={copy}
                            >
                                {copied ? <Check size={18} /> : <LinkIcon size={18} className={classes.linkIcon} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                    </CopyButton>
                        </div>
                }
                </Group>
                {infoSpec.underTitleVar !== "" && getEntryWithId(selectedId, entries) !== null && getEntryWithId(selectedId, entries)[infoSpec.underTitleVar] != "N/A" &&
                <Text size="sm" mt="xs">
                    {getEntryWithId(selectedId, entries)[infoSpec.underTitleVar]}
                </Text>
                }
            </Card.Section>

            {(getEntryWithId(selectedId, entries) !== null && getEntryWithId(selectedId, entries).dubious) &&
            <Card.Section className={classes.badgeSection} style={{ alignItems: 'center' }}>
                <DubiousBadge classes={classes} />
            </Card.Section>
            }

            { (getEntryWithId(selectedId, entries) !== null && badgeSpec !== null
            && badgeSpec.hasOwnProperty('upper') && badgeSpec.upper !== null &&
              getEntryWithId(selectedId, entries)[badgeSpec.upper.varName] !== undefined) &&
            <Card.Section className={classes.badgeSection} style={{ alignItems: 'center'}}>
                <Group spacing={7} style={{ verticalAlign: 'middle' }}>
                <Text size="sm" inline key="langHeader">{badgeSpec.upper.header}: </Text>
                <Tooltip label="Click to open in new window">
                <Button
                  compact
                  radius="xl"
                  rightIcon={badgeSpec.upper.icon}
                  component="a"
                  href={getIISHLink(getEntryWithId(selectedId, entries).iish_code)}
                  target="_blank"
                >
                    {getEntryWithId(selectedId, entries)[badgeSpec.upper.varName]}
                </Button>
                </Tooltip>
                </Group>
            </Card.Section>
            }

            <Card.Section style={{ flexGrow: 1 }} className={classes.sectionStretch} component={ScrollArea}>
                <div style={{ overflowY: 'auto', paddingLeft: '5px', paddingRight: '5px', paddingTop: '6px', paddingBottom: '3px' }}>
                    {((selectedId !== 'none') && (getEntryWithId(selectedId, entries) !== null)) && getEntryWithId(selectedId, entries)[infoSpec.textVar]}
                </div>
            </Card.Section>

            {badgeSpec !== null && badgeSpec.hasOwnProperty('lower') &&
             getEntryWithId(selectedId, entries) !== null &&
             getEntryWithId(selectedId, entries)[badgeSpec.lower.varName] !== undefined &&
            <Card.Section className={classes.badgeSection}>
                <Group spacing={7} style={{ verticalAlign: 'middle' }}>
                    <Text size="sm" inline key="langHeader">{badgeSpec.lower.header}: </Text>
                        {getBadgeVals(selectedId, entries, badgeSpec.lower.varName).map((curVal: string) => {
                            return (
                                <Badge key={curVal} color={getLangBadgeColor(curVal)}>
                                    {curVal}
                                </Badge>
                            )
                        })
                    }
                </Group>
            </Card.Section>
            }
            <Card.Section className={classes.section}>
            <Group mt="xs" mb="0" p={0} style={{ minHeight: '35px', maxHeight: '35px', height: '35px', marginTop: 'auto' }}>
                <LinkButton
                  isDisabled={getEntryWithId(selectedId, entries) === null}
                  href={router.route + dbRootPath + 'entry/' + selectedId}
                  buttonOnClick={(event: any) => {
                    console.log("Button clicked, current page = " + currentPage);
                    if (typeof window !== 'undefined') {
                        console.log("Setting localStorage: " + pageVar + " = " + currentPage);
                        window.localStorage.setItem(pageVar, currentPage);
                        if (selectedFilter !== null && filterVar !== null) {
                            console.log("Setting localStorage: filterVar (" + filterVar + ") = " + selectedFilter);
                            window.localStorage.setItem(filterVar, selectedFilter);
                        }
                        return true;
                    }
                  }}
                >
                    <Text>More details</Text>
                </LinkButton>
            </Group>
            </Card.Section>
        </Card>
    );
}

export default InfoPane;