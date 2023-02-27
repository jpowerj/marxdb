import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { chronYearsDefault } from '@/mdbGlobals';

const ChronLanding = () => {
    const defaultPage = 1;
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.replace(router.pathname + "/" + chronYearsDefault + "/page/1");
        }
    }, [router]);
    return (
        <div>
            Loading Chronicle Entries...
        </div>
    );
}

export default ChronLanding;
