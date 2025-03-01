"use client"
import { TTableRow } from "@/lib/types";
import { useOptimistic } from "react";
import { DashboardTable } from "./table";



export const TableContent = ({ data }: { data: TTableRow[] }) => {
    const [optimisticData, setOptimisticData] = useOptimistic<TTableRow[], any>(data, (state, action) => {
        switch (action.type) {
            case "edit":
                return state.map(expense => expense.id === action.payload.id
                    ? ({ ...expense, ...action.payload }) : expense)
            case "delete":
                return state.filter(expense => {
                    return !action.payload.includes(expense.id)
                })
            case "create":
                return [action.payload, ...state.filter(expense => expense.id !== action.payload.id)]
            default:
                return state;
        }
    });

    return (
        <DashboardTable
            data={optimisticData}
            setOptimisticData={setOptimisticData}
        />
    )
}