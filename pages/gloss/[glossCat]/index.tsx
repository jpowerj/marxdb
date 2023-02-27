import { useRouter } from "next/router";
import { Text } from "@mantine/core";
import { useEffect } from "react";

export const getStaticProps = async (context: any) => {
    //const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    // console.log("getStaticProps():");
    // console.log(Object.keys(context.params));
    const glossCat = context.params.glossCat;
    return {
        props: {
            glossCat: glossCat,
        }
    }
}

export const getStaticPaths = async () => {
    return {
        paths: [
            { params: { glossCat: 'all' } },
            { params: { glossCat: 'people' } },
            { params: { glossCat: 'places' } },
            { params: { glossCat: 'events' } },
            { params: { glossCat: 'orgs' } },
            { params: { glossCat: 'other' } },
        ],
        fallback: false, // can also be true or 'blocking'
    }
}

const GlossCatPage = ({ glossCat }: { glossCat: string }) => {
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.push('/gloss/' + glossCat + '/page/1');
        }
    }, [router, glossCat]);
    return (
        <>
            <Text>Loading Glossary...</Text>
        </>
    );
}

export default GlossCatPage;