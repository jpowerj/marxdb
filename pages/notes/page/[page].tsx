import DataDisplayWPage from '@/components/DataDisplayWPage';
import { pageSize } from '@/mdbGlobals';
import { Checkbox, Group, Text } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';
import { getNotesAll, getNotesCount } from '@/pages/api/note';
import { ExternalLink } from 'tabler-icons-react';

export const getStaticProps = async (context: any) => {
    const { notes, totalNotes } = await getNotesAll();
    const pageNum = parseInt(context.params.page);
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize;
    const dataSlice = notes.slice(from, to);
    //console.log("M: " + dataSlice.map((elt) => elt.M));
    return {
        props: {
            entries: dataSlice,
            totalEntries: totalNotes,
            pageNum: pageNum
        }
    }
}

export const getStaticPaths = async () => {
    const totalNotes = await getNotesCount();
    const totalNumPages = Math.ceil(totalNotes / pageSize);
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

const NotesPage = ({ entries, totalEntries, pageNum }: { entries: any, totalEntries: any, pageNum: number, auth: string }) => {
    const colSpec = [
        { accessor: 'entry_id', title: 'ID' },
        //{ accessor: 'reg_section', title: 'Author' },
        { accessor: 'year_est', title: 'Year', width: 100 },
        {
            accessor: 'text_name_final',
            title: 'Text Name',
            render: ({ text_name_final }: { text_name_final: any }) => {
                if (text_name_final.length < 100) {
                    return text_name_final;
                }
                return text_name_final.substring(0, 100) + "...";
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
    const badgeSpec = {
        upper: { varName: "iish_code", header: 'IISH Scans', icon: <ExternalLink size={14} />},
        lower: { varName: "genres_specific", header: 'Genre(s)' },
    };
    const infoSpec = { titleVar: 'entry_id', subtitleVar: 'text_name_final', underTitleVar: 'year_est' };
    return (
        <DataDisplayWPage entries={entries} totalEntries={totalEntries} page={pageNum} pageVar="notePage" filterVar={null} filterValues={null} selectedFilter={null} colSpec={colSpec} badgeSpec={badgeSpec} infoSpec={infoSpec} dbRootPath={'../../../'} title="Marx-Engels Notebooks" />
    );
}

export default NotesPage;
