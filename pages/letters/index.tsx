import { useRouter } from "next/router";
import { Text } from "@mantine/core";
import { useEffect } from "react";

const LettersLanding = ({ auth }: { auth: string }) => {
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.push('/letters/page/1');
        }
    }, [router, auth]);
    return (
        <>
            <Text>Loading Letters...</Text>
        </>
    );
}

export default LettersLanding;