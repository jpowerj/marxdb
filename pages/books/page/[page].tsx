import DataDisplayWPage from '@/components/DataDisplayWPage';
import { pageSize } from '@/mdbGlobals';
import { Checkbox, Group, Text } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';
import { getBooksAll } from '@/pages/api/book';

export const getStaticProps = async (context: any) => {
    const { books, totalBooks } = await getBooksAll();
    const pageNum = parseInt(context.params.page);
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize;
    const dataSlice = books.slice(from, to);
    //console.log("M: " + dataSlice.map((elt) => elt.M));
    return {
        props: {
            entries: dataSlice,
            totalEntries: totalBooks,
            pageNum: pageNum
        }
    }
}

export const getStaticPaths = async () => {
    const { books, totalBooks } = await getBooksAll();
    const totalNumPages = Math.ceil(totalBooks / pageSize);
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

const ChronPage = ({ entries, totalEntries, pageNum }: { entries: any, totalEntries: any, pageNum: number, auth: string }) => {
    const colSpec = [
        {
            accessor: 'author',
            title: 'Author',
            render: ({ auth_last, auth_first }: { auth_last: string, auth_first: string }) => {
                if (auth_last == "No_Author") {
                    return <div style={{ textAlign: 'center', fontStyle: 'italic' }}>N/A</div>;
                } else if (auth_first === undefined) {
                    return auth_last;
                } else {
                    return auth_last + ", " + auth_first;
                }
            },
            width: 140,
        },
        {
            accessor: 'title',
            title: 'Title',
            render: ({ title }: { title: string }) => {
                if (title.length < 60) {
                    return title;
                }
                return title.substring(0, 60) + "...";
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
    const badgeSpec = null;
    const infoSpec = { titleVar: 'title', underTitleVar: 'auth_full', textVar: 'text' };
    return (
        <DataDisplayWPage entries={entries} totalEntries={totalEntries} page={pageNum} pageVar="bookPage" filterVar={null} filterValues={null} selectedFilter={null} colSpec={colSpec} badgeSpec={badgeSpec} infoSpec={infoSpec} dbRootPath={'../../../'} title="Marx-Engels Bookshelf" />
    );
}

export default ChronPage;
