"use client"
import { months } from "@/lib/constants";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";



type TDateFilterContext = {
    month: string;
    year: number;
    setMonth: Dispatch<SetStateAction<string>>;
    setYear: Dispatch<SetStateAction<number>>;
}

export const DateFilterContext = createContext<TDateFilterContext | null>(null);

export const DateFilterContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [month, setMonth] = useState(months[new Date().getMonth()]);
    const [year, setYear] = useState(new Date().getFullYear());


    return (
        <DateFilterContext value={{month, setMonth, year, setYear}}>
            {children}
        </DateFilterContext>
    );
}

export const useDateFilter = () => {
    const value = useContext(DateFilterContext);

    if (!value) {
        throw new Error(`useDateFilter must be wrapped inside DateFilterContextProvider`);
    }

    return value;
}