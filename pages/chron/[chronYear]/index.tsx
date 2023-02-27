import { useRouter } from "next/router";
import { Text } from "@mantine/core";
import { useEffect } from "react";
import _ from 'lodash';
import { chronYears } from "@/mdbGlobals";

export const getStaticProps = async (context: any) => {
    const chronYear = context.params.chronYear;
    return {
        props: {
            chronYear: chronYear,
        }
    }
}

export const getStaticPaths = async () => {
    // Use lodash to make a year array
    const pathObjs = chronYears.map((curYear) => {
        return { params: { chronYear: curYear }}
    })
    return {
        paths: pathObjs,
        fallback: false, // can also be true or 'blocking'
    }
}

const ChronYearLanding = ({ chronYear }: { chronYear: string }) => {
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.push('/chron/' + chronYear + '/page/1');
        }
    }, [router, chronYear]);
    return (
        <>
            <Text>Loading {chronYear}...</Text>
        </>
    );
}

export default ChronYearLanding;