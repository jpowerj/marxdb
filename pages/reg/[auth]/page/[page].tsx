import DataDisplayWPage from '@/components/DataDisplayWPage';
import { regAuths } from '@/mdbGlobals';
import { getDocinfoPage,  getDocinfoAll, getDocinfoAuths, getDocinfoIdsAirtable, initDocinfo } from '@/pages/api/docinfo';
import { Group, Text } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';
import { pageSize } from '@/mdbGlobals';

export const getStaticProps = async (context: any) => {
    //console.log("[page].tsx: context = " + Object.keys(context.params))
    //const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const authData = await getDocinfoAuths();
    //console.log("[page].tsx: data = " + Object.keys(data));
    //const data = await res.json();
    const curAuthName = context.params.auth;
    const curAuthDocs = authData.authDocs[curAuthName];
    //console.log("[page].tsx: authDocs keys = " + Object.keys(curAuthDocs));
    const pageNum = parseInt(context.params.page);
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize;
    //console.log("[page].tsx: data.documents.length: " + data.documents.length);
    //console.log("[page].tsx: data.documents = " + data.documents);
    const authSlice = curAuthDocs.slice(from, to);
    //console.log("[page].tsx: dataSlice = " + dataSlice[0])
    return {
        props: {
            entries: authSlice,
            totalEntries: curAuthDocs.length,
            pageNum: pageNum,
            auth: curAuthName,
        }
    }
}

export const getStaticPaths = async () => {
    // Trying this: store *all* records in docinfo.ts, and just return them to here
    await initDocinfo();
    const { authCounts, authDocs } = await getDocinfoAuths();
    // Ensure at least one page for each auth
    const authPageDefaults = regAuths.map((curAuth) => [curAuth.value, 1]);
    //console.log("authPageDefaults: " + authPageDefaults);
    let authPages = Object.fromEntries(authPageDefaults);
    //console.log("authPages: " + JSON.stringify(authPages));
    let allPages: any[] = [];
    // Create the first page for each auth
    regAuths.forEach(function (curAuthObj, index) {
        let authFirstPage = {params: { auth: curAuthObj.value, page: "1" }};
        allPages.push(authFirstPage);
    })
    Object.keys(authCounts).forEach(function (curAuth, index) {
        authPages[curAuth] = Math.ceil(authCounts[curAuth] / pageSize);
        // Every author already has a first page, guaranteed, so we just make 2 onwards here
        for (let i = 2; i <= authPages[curAuth]; i += 1) {
            const curAuthPage = {params: { auth: curAuth, page: String(i) }}
            allPages.push(curAuthPage);
        }
    })
    const returnObj = {
        paths: allPages,
        fallback: false, // can also be true or 'blocking'
    }
    //console.log(JSON.stringify(returnObj));
    return returnObj;
}

const RegPage = ({ entries, totalEntries, pageNum, auth }: { entries: any, totalEntries: any, pageNum: number, auth: string }) => {
    const filterValues = regAuths;
    const colSpec = [
        { accessor: 'entry_id', title: 'ID' },
        //{ accessor: 'reg_section', title: 'Author' },
        { accessor: 'date_final', title: 'Date', width: 100 },
        {
            accessor: 'title',
            title: 'Title',
            render: ({ title }: { title: any }) => {
                if (title.length < 100) {
                    return title;
                }
                return title.substring(0, 100) + "...";
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
    const badgeSpec = { varName: 'lang_orig', header: 'Original Language(s)'};
    const infoSpec = { titleVar: 'entry_id', subtitleVar: 'title', underTitleVar: 'date_final', textVar: 'full_text' };
    return (
        <DataDisplayWPage entries={entries} totalEntries={totalEntries} page={pageNum} pageVar="regPage" filterVar="auth" filterValues={filterValues} selectedFilter={auth} colSpec={colSpec} badgeSpec={badgeSpec} infoSpec={infoSpec} dbRootPath={'../../../../'} title="Marx-Engels Register" />
    );
}

export default RegPage;
