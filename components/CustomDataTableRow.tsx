import { Box, createStyles, type Sx } from '@mantine/core';
import type { ChangeEventHandler, CSSProperties, MouseEventHandler, ReactNode } from 'react';
import DataTableRowCell from 'mantine-datatable/dist/DataTableRowCell';
import DataTableRowExpansion from 'mantine-datatable/dist/DataTableRowExpansion';
import DataTableRowSelectorCell from 'mantine-datatable/dist/DataTableRowSelectorCell';
import { useRowExpansion } from 'mantine-datatable/dist/hooks';
import type { DataTableCellClickHandler, DataTableColumn } from 'mantine-datatable/dist/types';

const useStyles = createStyles((theme) => {
    const baseColor = theme.colors[theme.primaryColor][6];
    return {
        withPointerCursor: {
            cursor: 'pointer',
        },
        selected: {
            '&&': {
                'tr&': {
                    background: theme.colorScheme === 'dark' ? theme.fn.darken(baseColor, 0.6) : theme.fn.lighten(baseColor, 0.9),
                },
                'table[data-striped] tbody &:nth-of-type(odd)': {
                    background:
                        theme.colorScheme === 'dark' ? theme.fn.darken(baseColor, 0.55) : theme.fn.lighten(baseColor, 0.85),
                },
            },
        },
        contextMenuVisible: {
            '&&': {
                'tr&': {
                    background: theme.colorScheme === 'dark' ? theme.fn.darken(baseColor, 0.5) : theme.fn.lighten(baseColor, 0.7),
                },
                'table[data-striped] tbody &:nth-of-type(odd)': {
                    background:
                        theme.colorScheme === 'dark' ? theme.fn.darken(baseColor, 0.45) : theme.fn.lighten(baseColor, 0.65),
                },
            },
        },
    };
});

type DataTableRowProps<T> = {
    record: T;
    recordIndex: number;
    columns: DataTableColumn<T>[];
    defaultColumnRender: ((record: T, index: number, accessor: string) => ReactNode) | undefined;
    selectionVisible: boolean;
    selectionChecked: boolean;
    onSelectionChange: ChangeEventHandler<HTMLInputElement> | undefined;
    isRecordSelectable: ((record: T, index: number) => boolean) | undefined;
    onClick: MouseEventHandler<HTMLTableRowElement> | undefined;
    onCellClick: DataTableCellClickHandler<T> | undefined;
    onContextMenu: MouseEventHandler<HTMLTableRowElement> | undefined;
    expansion: ReturnType<typeof useRowExpansion<T>>;
    customRowAttributes?: (record: T, recordIndex: number) => Record<string, string | number>;
    className?: string | ((record: T, recordIndex: number) => string | undefined);
    style?: CSSProperties | ((record: T, recordIndex: number) => CSSProperties | undefined);
    sx?: Sx;
    contextMenuVisible: boolean;
    leftShadowVisible: boolean;
};

export default function DataTableRow<T>({
    record,
    recordIndex,
    columns,
    defaultColumnRender,
    selectionVisible,
    selectionChecked,
    onSelectionChange,
    isRecordSelectable,
    onClick,
    onCellClick,
    onContextMenu,
    expansion,
    customRowAttributes,
    className,
    style,
    sx,
    contextMenuVisible,
    leftShadowVisible,
}: DataTableRowProps<T>) {
    const { cx, classes } = useStyles();

    return (
        <>
            <Box
                component="tr"
                className={cx(
                    {
                        [classes.withPointerCursor]: onClick || expansion?.expandOnClick,
                        [classes.selected]: selectionChecked,
                        [classes.contextMenuVisible]: contextMenuVisible,
                    },
                    typeof className === 'function' ? className(record, recordIndex) : className
                )}
                onClick={(e) => {
                    if (expansion) {
                        const { isRowExpanded, expandOnClick, expandRow, collapseRow } = expansion;
                        if (expandOnClick) {
                            if (isRowExpanded(record)) {
                                collapseRow(record);
                            } else {
                                expandRow(record);
                            }
                        }
                    }
                    onClick?.(e);
                }}
                style={typeof style === 'function' ? style(record, recordIndex) : style}
                sx={sx}
                {...customRowAttributes?.(record, recordIndex)}
                onContextMenu={onContextMenu}
            >
                {selectionVisible && (
                    <DataTableRowSelectorCell
                        withRightShadow={leftShadowVisible}
                        checked={selectionChecked}
                        disabled={!onSelectionChange || (isRecordSelectable ? !isRecordSelectable(record, recordIndex) : false)}
                        onChange={onSelectionChange}
                    />
                )}
                {columns.map((column, columnIndex) => {
                    const {
                        accessor,
                        hidden,
                        visibleMediaQuery,
                        textAlignment,
                        ellipsis,
                        width,
                        render,
                        cellsClassName,
                        cellsStyle,
                        cellsSx,
                        customCellAttributes,
                    } = column;

                    let handleCellClick: MouseEventHandler<HTMLTableCellElement> | undefined;
                    if (onCellClick) {
                        handleCellClick = () => onCellClick({ record, recordIndex, column, columnIndex });
                    }

                    return hidden ? null : (
                        <DataTableRowCell<T>
                            key={accessor}
                            className={typeof cellsClassName === 'function' ? cellsClassName(record, recordIndex) : cellsClassName}
                            style={typeof cellsStyle === 'function' ? cellsStyle(record, recordIndex) : cellsStyle}
                            sx={cellsSx}
                            visibleMediaQuery={visibleMediaQuery}
                            record={record}
                            recordIndex={recordIndex}
                            onClick={handleCellClick}
                            accessor={accessor}
                            textAlignment={textAlignment}
                            ellipsis={ellipsis}
                            width={width}
                            render={render}
                            defaultRender={defaultColumnRender}
                            customCellAttributes={customCellAttributes}
                        />
                    );
                })}
            </Box>
            {expansion && (
                <DataTableRowExpansion
                    colSpan={columns.filter((c) => !c.hidden).length + (selectionVisible ? 1 : 0)}
                    open={expansion.isRowExpanded(record)}
                    content={expansion.content(record, recordIndex)}
                    collapseProps={expansion.collapseProps}
                />
            )}
        </>
    );
}