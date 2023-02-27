import { createContext, useState } from 'react';

const SelectionContext = createContext({
    selectedId: "1",
    setSelectedId: (newId: string) => {}
});

export const SelectionProvider = ({ children }: {children: any}) => {
    const [selectedId, setSelectedId] = useState("1");
    const updateSelection = (newId: string) => setSelectedId(newId);

    return (
        <SelectionContext.Provider value={{selectedId: selectedId, setSelectedId: updateSelection}}>
            {children}
        </SelectionContext.Provider>
    );
};

export default SelectionContext;