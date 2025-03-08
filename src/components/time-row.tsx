"use client"


export const TimeRow = ({ item }: { item: string }) => {    
    return (
        <p className="font-medium">
            {new Date(+item).toLocaleString('en-gb', {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            })}
        </p>
    )
}