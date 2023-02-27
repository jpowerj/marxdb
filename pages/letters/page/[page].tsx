import DataDisplayWPage from '@/components/DataDisplayWPage';
import { getLettersAll, initLetters } from '@/pages/api/letter';
import { Group, Text } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';
import { pageSize } from '@/mdbGlobals';

export const getStaticProps = async (context: any) => {
    const { letters, totalLetters } = await getLettersAll();
    const pageNum = parseInt(context.params.page);
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize;
    const dataSlice = letters.slice(from, to);
    //console.log("M: " + dataSlice.map((elt) => elt.M));
    return {
        props: {
            entries: dataSlice,
            totalEntries: totalLetters,
            pageNum: pageNum
        }
    }
}

export const getStaticPaths = async () => {
    const { letters, totalLetters } = await getLettersAll();
    const totalNumPages = Math.ceil(totalLetters / pageSize);
    return {
        paths: Array.from({ length: totalNumPages }).map((_, i) => {
            return {
                params: {
                    page: (i + 1).toString()
                },
            };
        }),
        fallback: false, // can also be true or 'blocking'
    }
}

const LettersPage = ({ entries, totalEntries, pageNum, auth }: { entries: any, totalEntries: any, pageNum: number, auth: string }) => {
    const colSpec = [
        {
            accessor: 'from_to_str',
            title: 'Letter',
            render: ({ from_to_str }: { from_to_str: string }) => {
                if (from_to_str.length < 100) {
                    return from_to_str;
                }
                return from_to_str.substring(0, 100) + "...";
            },
        },
        { accessor: 'date_short', title: 'Date', width: 120 },
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
    const badgeSpec = null;
    const infoSpec = { titleVar: 'from_to_str', titleSep: ',', subtitleVar: null, underTitleVar: 'date_full', textVar: 'full_text' };
    return (
        <DataDisplayWPage entries={entries} totalEntries={totalEntries} page={pageNum} pageVar="letterPage" filterVar={null} filterValues={null} selectedFilter={null} colSpec={colSpec} badgeSpec={badgeSpec} infoSpec={infoSpec} dbRootPath={'../../../../'} title="Marx-Engels Correspondence" />
    );
}

export default LettersPage;
