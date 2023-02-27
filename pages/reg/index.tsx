import {  useEffect } from 'react';
import DataDisplayWPage from '@/components/DataDisplayWPage';
import { useRouter } from 'next/router';

const RegLanding = () => {
    const defaultPage = 1;
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.replace(router.pathname + "/m/page/1");
        }
    }, [router]);
    return (
        <div>
        </div>
    );
}

export default RegLanding;
