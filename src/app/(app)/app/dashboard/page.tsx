import { Combobox } from "@/components/combobox";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { getKindeUserInfo } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { connection } from "next/server";


export default async function Dashboard() {    
    await connection()
    
    const userData = await getKindeUserInfo();
    if (!userData?.isAuthenticated) redirect('/api/auth/login');

    if (!userData.isPayingMember) redirect('/');

    return (
        <div className="pt-5">
            <div className="w-full max-w-[750px] mx-auto">
                <h1 className="text-slate-700 text-3xl font-[family-name:var(--font-vast)]">DASHBOARD</h1>
                <div className="flex justify-end gap-3">
                    <Combobox category="months" />
                    <Combobox category="years" />
                </div>
                <DashboardTabs userId={userData.user.id} />
            </div>
        </div>
    )
}