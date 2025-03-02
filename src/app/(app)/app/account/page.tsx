import { AccountLoggedInList } from "@/components/account-logged-in-list";
import { Loading } from "@/components/loading";
import { getKindeUserInfo } from "@/lib/server-utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";


export default async function Account() {
    await connection()

    const userData = await getKindeUserInfo();
    if (!userData?.isAuthenticated) return redirect('/api/auth/login');

    if (!userData.isPayingMember) return redirect('/');

    return (
        <>
            <div className="pt-5">
                <div className="w-full max-w-[750px] mx-auto">
                    <h1 className="text-slate-700 text-3xl font-[family-name:var(--font-vast)]">ACCOUNT</h1>
                    <div className="flex justify-center h-[300px]">
                        <p className="text-slate-800 text-lg mt-[100px] flex-1 text-end text-ellipsis whitespace-nowrap overflow-hidden" style={{ textShadow: "0px -1px #bfb3cc" }}>
                            you are logged in as
                        </p>
                        <Image
                            src="/planet.svg"
                            alt="avatar"
                            width={250}
                            height={300}
                            className="rounded-full"
                        />
                        <p className="font-medium text-slate-800 text-lg mt-[100px] flex-1 overflow-hidden text-ellipsis" style={{ textShadow: "0px -1px #bfb3cc" }}>
                            {userData.user.email ?? 'anonymousme@github.com'}
                        </p>
                    </div>
                </div>
            </div>
            <Suspense fallback={<Loading />}>
                <AccountLoggedInList userId={userData.user.id} />
            </Suspense>
        </>
    )
}