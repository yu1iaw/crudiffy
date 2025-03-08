"use client"

import dynamic from "next/dynamic";


const TimeRow = dynamic(() => import('./time-row').then(comp => comp.TimeRow), { ssr: false })

export const TimestampFragment = ({ item }: { item: string }) => (
    <><TimeRow item={item} /></>
)