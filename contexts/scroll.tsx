import { createContext, useState, useRef } from 'react';

const ScrollContext = createContext({
    scrollRef: useRef({
        scrollPos: 1
    })
});

export const ScrollProvider = ({ children }: { children: any }) => {
    const scrollRef = useRef({
        scrollPos: 1
    });

    return (
        <ScrollContext.Provider value={{ scrollRef: scrollRef }}>
            {children}
        </ScrollContext.Provider>
    );
};

export default ScrollContext;