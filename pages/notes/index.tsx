import { useEffect } from 'react';
import { useRouter } from 'next/router';

const NotesLanding = () => {
    const defaultPage = 1;
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.replace(router.pathname + "/page/1");
        }
    }, [router]);
    return (
        <div>
            Loading Notebooks...
        </div>
    );
}

export default NotesLanding;
