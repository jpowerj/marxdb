import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DataTable } from "mantine-datatable";
import { Checkbox, Group, NativeSelect, Paper, Radio, Text } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import { chronYearsDefault, pageSize } from "@/mdbGlobals";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import _ from 'lodash';

interface TablePaneProps {
    entries: any,
    totalEntries: number,
    selectedId: any,
    setSelectedId: any,
    page: number,
    filterVar: string | null,
    filterValues: any[] | null,
    filterData?: any | null,
    selectedFilter: string | null,
    colSpec: any,
    dbRootPath: string,
    customStyles: any
}

const TablePane = (
    { entries, totalEntries, selectedId, setSelectedId, page, filterVar, filterValues, filterData = null, selectedFilter, colSpec, dbRootPath, customStyles }: TablePaneProps) => {
    const router = useRouter();
    const [isFetching, setIsFetching] = useState(true);
    useEffect(() => {
        if (router.isReady) {
            setIsFetching(false);
        }
    }, [router])
    //const {selectedId, setSelectedId} = useContext(SelectionContext);
    //const [visibleRecords, setVisibleRecords] = useState<any>(entries);
    // useEffect(() => {
    //     const from = (page - 1) * PAGE_SIZE;
    //     const to = from + PAGE_SIZE;
    //     const recSlice = allRecords.slice(from, to)
    //     setVisibleRecords(recSlice);
    // }, [page]);
    const updatePage = (p: number) => {
        // If they're going to a new page, have to load the records
        //setPage(p);
        setIsFetching(true);
        console.log("updatePage(" + p + ")");
        //console.log(router.route);
        //console.log(router.pathname);
        //console.log(router.query);
        let newQuery = router.query;
        newQuery['page'] = String(p);
        console.log("newQuery: " + JSON.stringify(newQuery));
        //console.log(router.asPath);
        const newUrl = { pathname: router.pathname, query: newQuery };
        //const urlAs = { pathname: '/reg', query: {page: '1'} };
        //const urlAs = { pathname: router.pathname.replace("[page]", String(p)), query: { page: '1' } };
        router.push(newUrl);
    };
    // const [pr, setPR] = useState(false);
    // useEffect(() => {
    //     if (!pr) {
    //         console.log("totalEntries: " + totalEntries);
    //         setPR(true);
    //     }
    // }, [])
    const radioSize = "xs";
    const goToFilterPage = (selectedFilter: string) => {
        setIsFetching(true);
        let newQuery: {[key: string]: string} = {};
        if (filterVar !== null) {
            newQuery[filterVar] = selectedFilter;
        }
        // Reset to first page
        newQuery['page'] = '1';
        const newUrl = { pathname: router.pathname, query: newQuery };
        //const urlAs = { pathname: '/reg', query: {page: '1'} };
        //const urlAs = { pathname: router.pathname.replace("[page]", String(p)), query: { page: '1' } };
        router.push(newUrl);
    }
    const getDropdownString = (yearItem: string) => {
        const filterSuffix = filterData === null ? "" : " (" + filterData[yearItem] + ")";
        return _.capitalize(yearItem) + filterSuffix;
    }
    const goToYearPage = (selectedFilter: string) => {
        const selectedYear = selectedFilter.split(" ")[0];
        return goToFilterPage(selectedYear);
    }
    const clipboard = useClipboard({timeout: 1000});
    const getPermalink = (theId: string) => {
        return router.route + dbRootPath + 'entry/' + theId;
    }
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {filterValues !== null && filterValues !== undefined &&
            <Paper style={{flexShrink: 1, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} withBorder p={4}>
                {(filterValues.length < 8 && selectedFilter !== null) ?
                (<Radio.Group
                    value={selectedFilter}
                    pt={0}
                    onChange={goToFilterPage}
                    className="cb-group"
                    inputWrapperOrder={['input']}
                    orientation="horizontal"
                    spacing="sm"
                    size="sm"
                    name="selectedfilter"
                    style={{ cursor: 'pointer!important' }}
                >
                    {filterValues.filter((item) => item.include).map((item) => (
                        <Radio label={_.capitalize(item.name)} value={item.name} size={radioSize} key={item.name} />
                    ))}
                    {/* <Radio label="Marx" value="m" size={radioSize} />
                    <Radio label="Engels" value="e" size={radioSize} />
                    <Radio label="Joint Works" value="me" size={radioSize} />
                    <Radio label="Sources" value="st" size={radioSize} /> */}
                </Radio.Group>)
                : (
                    <div style={{ display: 'flex', flexDirection: 'row', verticalAlign: 'center', alignItems: 'center' }}>
                    <Text size="md">Show Year:</Text>&nbsp;
                    <NativeSelect
                      data={filterValues.map((yearItem) => getDropdownString(yearItem))} 
                      value={selectedFilter === null ? getDropdownString(chronYearsDefault) : getDropdownString(selectedFilter)}
                      onChange={(event) => goToYearPage(event.currentTarget.value.toLowerCase())}
                      size="xs"
                      radius="sm"
                      variant="default"
                    />
                    </div>
                )
                }
            </Paper>
        }
        <DataTable
            textSelectionDisabled
            withBorder
            borderRadius="md"
            highlightOnHover
            // shadow="xs"
            totalRecords={totalEntries}
            recordsPerPage={pageSize}
            page={page}
            fetching={isFetching}
            onPageChange={(p) => updatePage(p)}
            style={{ height: '100%', flex: 1 }}
            // sx={{ ["& tr"]: { backgroundColor: undefined } }}
            rowClassName={({ entry_id }) => {
                // if (id === selectedId) {
                //     console.log("id === selectedId = " + selectedId);
                // }
                return (entry_id === selectedId ? customStyles.selectedRow : customStyles.nonSelectedRow)
            }}
            columns={colSpec}
            idAccessor="entry_id"
            records={entries}
            onRowClick={(entry: any, rowIndex: number) => {
                //console.log("Row clicked. " + rowIndex + ", entry id = " + entry.entry_id);
                console.log("Row clicked. " + selectedFilter);
                setSelectedId(entry.entry_id);
            }}
            rowContextMenu={{
                shadow: 'xl', // custom shadow
                borderRadius: 'md', // custom border radius
                items: (record) => [
                    {
                        key: 'Copy Link',
                        onClick: () => {
                            showNotification({message: `Permalink for ${record.entry_id} copied to clipboard`, autoClose: 5000});
                            clipboard.copy(getPermalink(record.entry_id));
                        },
                    },
                    // add a divider between `delete` and `sendMessage` items
                    { key: 'divider1', divider: true },
                    {
                        key: 'Open in new tab',
                        onClick: () => {
                            window.open(getPermalink(record.entry_id), '_blank');
                        },
                    },
                ],
            }}
            // uncomment the next line to use a custom pagination text
            paginationText={({ from, to, totalRecords }) => `${from}-${to} of ${totalRecords}`}
            // uncomment the next line to use a custom pagination size
            paginationSize="xs"
        />
       </div>
    );
}

export default TablePane;
