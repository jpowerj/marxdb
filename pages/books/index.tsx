import { useEffect } from 'react';
import { useRouter } from 'next/router';

const BookshelfLanding = () => {
    const defaultPage = 1;
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            router.replace(router.pathname + "/page/1");
        }
    }, [router]);
    return (
        <div>
            Loading Bookshelf...
        </div>
    );
}

export default BookshelfLanding;
