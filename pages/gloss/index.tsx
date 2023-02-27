import { useState, useEffect } from 'react';
import Link from 'next/link'
import styles from '@/styles/RegPage.module.css'
import { Badge, Button, Card, Center, createStyles, Paper, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { Group } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { Eye } from 'tabler-icons-react';
import { Edit } from 'tabler-icons-react';
import { Trash } from 'tabler-icons-react';
import { Heart } from 'tabler-icons-react';
import { ChevronRight } from 'tabler-icons-react';
import image from 'next/image';
import DataDisplay from '@/components/DataDisplay';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

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

const GlossLanding = () => {
    const defaultPage = 1;
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.replace(router.pathname + "/all/page/1");
        }
    }, [router]);
    return (
        <div>
        </div>
    );
}

export default GlossLanding;

{/*
            {docInfos.map(docInfo => (
                <Link href={'/reg/' + docInfo.id} key={docInfo.id} className={styles.single}>
                    <h3>{ docInfo.name }</h3>
                </Link>
            ))}
*/}