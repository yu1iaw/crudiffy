import { getRedisLoggedInfo } from "@/lib/server-utils";
import { TimeRow } from "./time-row";


export const AccountLoggedInList = async ({ userId }: { userId: string }) => {
    const data = await getRedisLoggedInfo(userId);

    if (data.error) {
        return (
            <div className="flex flex-1 justify-center items-center">
                <p className="font-light text-center">The last time you logged in will be known when server reconnects. Try again later.</p>
            </div>
        )
    } else if (data.loggedIn) {
        return (
            <div className="flex flex-1 justify-center items-center gap-6">
                <p className="font-light">The last time you logged in: </p>
                <div>
                    {data.loggedIn.reverse().slice(0, 2).map(item => (
                        <TimeRow key={item} item={item} />
                    ))}
                </div>
            </div>
        )
    }
}