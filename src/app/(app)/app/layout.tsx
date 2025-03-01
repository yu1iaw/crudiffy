import { AppHeader } from "@/components/app-header";
import { BackgroundPattern } from "@/components/background-pattern";
import { DateFilterContextProvider } from "@/contexts/date-filter-provider";
import { ExpenseMutationsContextProvider } from "@/contexts/expense-mutations-provider";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ExpenseMutationsContextProvider>
            <DateFilterContextProvider>
                <BackgroundPattern />
                <div className="flex flex-col w-full max-w-[1050px] mx-auto px-6 min-h-screen font-[family-name:var(--font-geist-sans)]">
                    <AppHeader />
                    {children}
                </div>
            </DateFilterContextProvider>
        </ExpenseMutationsContextProvider>
    )
}