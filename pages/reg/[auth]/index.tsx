import { useRouter } from "next/router";
import { Text } from "@mantine/core";
import { useEffect } from "react";

export const getStaticProps = async (context: any) => {
    //const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    // console.log("getStaticProps():");
    // console.log(Object.keys(context.params));
    const auth = context.params.auth;
    return {
        props: {
            auth: auth,
        }
    }
}

export const getStaticPaths = async () => {
    return {
        paths: [{params: {auth:'m'}},{params:{auth:'e'}},{params:{auth:'me'}},{params:{auth:'st'}}],
        fallback: false, // can also be true or 'blocking'
    }
}

const RegAuthPage = ({ auth }: { auth: string }) => {
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.push('/reg/' + auth + '/page/1');
        }
    }, [router, auth]);
    return (
        <>
        <Text>Loading Page 1...</Text>
        </>
    );
}

export default RegAuthPage;