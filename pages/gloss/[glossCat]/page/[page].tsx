import DataDisplayWPage from '@/components/DataDisplayWPage';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { getGlossEntriesCats, initGlossEntries } from '@/pages/api/glossEntry';
import { pageSize } from '@/mdbGlobals';
import { allGlossCats, glossCatsDefaultValue } from '@/mdbGlobals';
import { Group, Text } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';

export const getStaticProps = async (context: any) => {
    const catData = await getGlossEntriesCats();
    const curCatName = context.params.glossCat;
    //console.log("gloss [page].tsx: curCatName = " + curCatName);
    const curCatDocs = catData.catDocs[curCatName];
    //console.log("[page].tsx: authDocs keys = " + Object.keys(curAuthDocs));
    const pageNum = parseInt(context.params.page);
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize;
    const catSlice = curCatDocs.slice(from, to);
    //console.log("[page].tsx: dataSlice = " + dataSlice[0])
    return {
        props: {
            entries: catSlice,
            totalEntries: curCatDocs.length,
            pageNum: pageNum,
            glossCat: curCatName,
        }
    }
}

export const getStaticPaths = async () => {
    // Trying this: store *all* records in docinfo.ts, and just return them to here
    await initGlossEntries();
    const { catCounts, catDocs } = await getGlossEntriesCats();
    // Ensure at least one page for each auth
    const catNames = allGlossCats.map((curCat) => curCat.name);
    const catPages = Object.fromEntries(allGlossCats.map((curCat) => [curCat.name, 1]));
    //console.log("authPages: " + JSON.stringify(authPages));
    let allPages: any[] = [];
    // Create the first page for each auth
    catNames.forEach(function (curCatName, index) {
        let catFirstPage = { params: { glossCat: curCatName, page: "1" } };
        allPages.push(catFirstPage);
    })
    Object.keys(catCounts).forEach(function (curCat, index) {
        catPages[curCat] = Math.ceil(catCounts[curCat] / pageSize);
        // Every author already has a first page, guaranteed, so we just make 2 onwards here
        for (let i = 2; i <= catPages[curCat]; i += 1) {
            const curCatPage = { params: { glossCat: curCat, page: String(i) } }
            allPages.push(curCatPage);
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

// Next Router attributes:
/*
0: "pathname"
1: "route"
2: "query"
3: "asPath"
4: "components"
5: "isFallback"
6: "basePath"
7: "locale"
8: "locales"
9: "defaultLocale"
10: "isReady"
11: "isPreview"
12: "isLocaleDomain"
13: "domainLocales"
14: "events"
15: "push"
16: "replace"
17: "reload"
18: "back"
19: "prefetch"
20: "beforePopState"
*/

const GlossPage = ({ entries, totalEntries, glossCat, pageNum }: { entries: any, totalEntries: any, glossCat: string, pageNum: number }) => {
    const router = useRouter();
    // const [pe, setPE] = useState(false);
    // useEffect(() => {
    //     if (!pe) {
    //         console.log("GlossPage, entries:");
    //         console.log(entries);
    //         console.log(pageNum);
    //         setPE(true);
    //     }
    // })
    const colSpec = [
        { accessor: 'entry_id', title: 'ID', width: 80 },
        { accessor: 'full_name', title: 'Entry' },
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
    const infoSpec = { titleVar: 'entry_id', subtitleVar: 'full_name', textVar: 'glossary_desc' };
    const badgeSpec = {
        lower: { varName: 'subcategory', header: 'Subcategory', unique: true }
    };
    return (
        <DataDisplayWPage entries={entries} totalEntries={totalEntries} page={pageNum} pageVar="glossPage" filterVar="glossCat" filterValues={allGlossCats} selectedFilter={glossCat} colSpec={colSpec} badgeSpec={badgeSpec} infoSpec={infoSpec} dbRootPath={'../../../../'} title="Marx-Engels Glossary" />
    );
}

export default GlossPage;
