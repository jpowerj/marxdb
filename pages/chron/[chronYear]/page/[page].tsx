import DataDisplayWPage from '@/components/DataDisplayWPage';
import { chronYears, chronYearsDefault, pageSize } from '@/mdbGlobals';
import { getEventsAll, getEventsYears } from '@/pages/api/event';
import { Checkbox, Group, Text } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';

export const getStaticProps = async (context: any) => {
    const { yearEvents, yearCounts } = await getEventsYears();
    const pageNum = parseInt(context.params.page);
    const chronYear = context.params.chronYear;
    const chronYearNumEvents = yearCounts[chronYear];
    const chronYearEvents = yearEvents[chronYear];
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize;
    const dataSlice = chronYearEvents.slice(from, to);
    //console.log("M: " + dataSlice.map((elt) => elt.M));
    return {
        props: {
            entries: dataSlice,
            totalEntries: chronYearNumEvents,
            pageNum: pageNum,
            chronYear: chronYear,
            allYearCounts: yearCounts,
        }
    }
}


export const getStaticPaths = async () => {
    // Trying this: store *all* records in docinfo.ts, and just return them to here
    const { yearCounts, yearEvents } = await getEventsYears();
    const allYears = Object.keys(yearEvents);
    // Ensure at least one page for each year
    const yearNumPages = Object.fromEntries(allYears.map((curYear) => [curYear, 1]));
    //console.log("authPages: " + JSON.stringify(authPages));
    let allPages: any[] = [];
    // Create the first page for each auth
    allYears.forEach(function (curYear, index) {
        let yearFirstPage = { params: { chronYear: curYear, page: "1" } };
        allPages.push(yearFirstPage);
    })
    allYears.forEach(function (curYear, index) {
        yearNumPages[curYear] = Math.ceil(yearCounts[curYear] / pageSize);
        // Every author already has a first page, guaranteed, so we just make 2 onwards here
        for (let i = 2; i <= yearNumPages[curYear]; i += 1) {
            const curYearPage = { params: { chronYear: curYear, page: String(i) } }
            allPages.push(curYearPage);
        }
    })
    const returnObj = {
        paths: allPages,
        fallback: false, // can also be true or 'blocking'
    }
    //console.log("gloss [page].tsx:");
    //console.log(JSON.stringify(returnObj));
    return returnObj;
}

const ChronPage = ({ entries, totalEntries, chronYear, pageNum, allYearCounts }: { entries: any, totalEntries: any, chronYear: string, pageNum: number, allYearCounts: any }) => {
    const colSpec = [
        //{ accessor: 'entry_id', title: 'ID' },
        //{ accessor: 'reg_section', title: 'Author' },
        { accessor: 'date_final', title: 'Date', width: 100 },
        {
            accessor: 'who',
            title: 'Who',
            width: 60,
        },
        {
            accessor: 'header_parsed',
            title: 'Title',
            render: ({ header_parsed }: { header_parsed: any }) => {
                if (header_parsed.length < 100) {
                    return header_parsed;
                }
                return header_parsed.substring(0, 100) + "...";
            },
        },
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
    ];
    const badgeSpec = { varName: "category", header: 'Categories' };
    const infoSpec = { titleVar: 'date_final', subtitleVar: 'header_parsed', textVar: 'text' };
    // Append counts to years dropdown
    const filterValues = chronYears;
    const filterData = Object.fromEntries(chronYears.map((curYear) => [curYear, String(allYearCounts[curYear]) + (allYearCounts[curYear] !== 1 ? " events" : " event")]));
    return (
        <DataDisplayWPage entries={entries} totalEntries={totalEntries} page={pageNum} pageVar="chronPage" filterVar="chronYear" filterValues={filterValues} filterData={filterData} selectedFilter={chronYear} colSpec={colSpec} badgeSpec={badgeSpec} infoSpec={infoSpec} dbRootPath={'../../../../'} title="Marx-Engels Chronicle" />
    );
}

export default ChronPage;
