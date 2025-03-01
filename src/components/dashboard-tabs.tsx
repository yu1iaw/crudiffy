"use client"
import { getRedisExpenses } from "@/actions/redis-actions";
import { useDateFilter } from "@/contexts/date-filter-provider";
import { useExpenseMutations } from "@/contexts/expense-mutations-provider";
import { TUserExpenses } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { TableContent } from "./table-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


const tabTitles = ["All", "Shopping", "Food", "Bills&Utilities", "Entertainment", "Others"] as const;


export const DashboardTabs = ({ userId }: { userId: string; }) => {
    const [expenses, setExpenses] = useState<TUserExpenses | null>(null);
    const { month, year } = useDateFilter();
    const { expenseSwitch } = useExpenseMutations();


    useEffect(() => {        
        (async () => {            
            const expenses = await getRedisExpenses(month, year, userId);
            setExpenses(expenses && expenses.length ? JSON.parse(expenses)[0] : null);
        })()
    }, [month, year, expenseSwitch])


    const categoryTotal = useMemo(() => tabTitles.slice(1).map(label => {
        return expenses ? expenses[label.toLowerCase() as keyof TUserExpenses].reduce((acc, curr) => acc + curr.amount, 0) : 0;
    }), [expenses])

    const overallTotal = useMemo(() => categoryTotal.reduce((acc, curr) => acc + curr, 0), [categoryTotal]);
    const overallContent = useMemo(() => tabTitles
        .slice(1)
        .flatMap(label => expenses
            ? expenses[label.toLowerCase() as keyof TUserExpenses].map((expense, i) => ({ ...expense, date: `${month.toLowerCase()}:${year}`, categoryIndex: i, category: label.toLowerCase() }))
            : []
        )
        .sort((a, b) => b.createdAt - a.createdAt), [expenses]
    );

    const tabsContent = useMemo(() => tabTitles.map(label => (
        <TabsContent key={label} value={label.toLowerCase()}>
            <TableContent data={label === "All" ? overallContent : expenses ? expenses[label.toLowerCase() as keyof TUserExpenses].map((expense, i) => ({ ...expense, date: `${month.toLowerCase()}:${year}`, categoryIndex: i, category: label.toLowerCase() })) : []} />
        </TabsContent>
    )), [overallContent])


    return (
        <TooltipProvider>
            <Tabs defaultValue="all" className="mt-4">
                <TabsList className="grid w-full grid-cols-6">
                    {tabTitles.map((label, i) => (
                        <Tab key={label} value={label} total={label === "All" ? overallTotal : categoryTotal[i - 1]} />
                    ))}
                </TabsList>
                {tabsContent}
            </Tabs>
        </TooltipProvider>
    )
}


const Tab = ({ value, total }: { value: string, total: number }) => (
    <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
            <div>
                <TabsTrigger value={value.toLowerCase()} className="w-full">
                    {value === "Bills&Utilities" ? 'Bills & Utilities' : value}
                </TabsTrigger>
            </div>
        </TooltipTrigger>
        <TooltipContent sideOffset={7} className="flex justify-center items-center h-8">
            <p className='font-[family-name:var(--font-geist-mono)]'>Total: 💎{total.toFixed()}</p>
        </TooltipContent>
    </Tooltip>
)