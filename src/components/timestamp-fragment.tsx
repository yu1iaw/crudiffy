"use client"

import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";


const TimeRow = dynamic(() => import('./time-row').then(comp => comp.TimeRow),
    {
        loading: () => <Skeleton className="w-[150px] h-5 mb-1" />,
        ssr: false
    }
)

export const TimestampFragment = ({ item }: { item: string }) => (
    <><TimeRow item={item} /></>
)