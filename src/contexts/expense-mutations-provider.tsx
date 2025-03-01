"use client"
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type TExpenseMutationsContext = {
    expenseSwitch: boolean;
    setExpenseSwitch: Dispatch<SetStateAction<boolean>>;
}
export const ExpenseMutationsContext = createContext<TExpenseMutationsContext | null>(null);

export const ExpenseMutationsContextProvider = ({ children }: {children: React.ReactNode}) => {
    const [expenseSwitch, setExpenseSwitch] = useState(false);

    return (
        <ExpenseMutationsContext value={{expenseSwitch, setExpenseSwitch}}>
            {children}
        </ExpenseMutationsContext>
    );
}

export const useExpenseMutations = () => {
    const value = useContext(ExpenseMutationsContext);

    if (!value) {
        throw new Error(`useExpenseMutations must be wrapped inside ExpenseMutationsContextProvider`);
    }

    return value;
}