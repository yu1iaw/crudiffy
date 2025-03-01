import { PurchaseBtn } from "@/components/purchase-btn";
import { Button } from "@/components/ui/button";
import { getKindeUserInfo } from "@/lib/server-utils";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";


export default async function Home() {
	const userData = await getKindeUserInfo();
	// const isPayingMember = await redis.sismember('membership', userData?.user?.id ?? '');

	return (
		<div className="relative bg-[#a385e0] min-h-screen flex flex-col lg:flex-row justify-center items-center gap-y-10 xl:gap-16 font-[family-name:var(--font-geist-sans)]">
			<Image
				src="/stars.png"
				alt="stars"
				priority
				fill
				sizes="(max-width: 1920px) 100vw, 1920px"
				className="object-bottom object-cover"
			/>
			<Image
				src='/crypto_icon.svg'
				alt='Expenses tracker preview'
				width={512}
				height={512}
				priority
				className="rounded-md z-10"
			/>
			<div className="z-10 space-y-12">
				<div className="space-y-6">
					<h1 className="font-extrabold text-slate-800 text-3xl max-w-[500px]" style={{ textShadow: "0px -1px #bfb3cc" }}>Track your <span className="text-violet-900">expenses</span> with ease</h1>
					<p className="font-medium text-slate-800 text-xl max-w-[600px]" style={{ textShadow: "0px -1px #bfb3cc" }}>Use Expenses Tracker to easily keep track of your expenses. Get lifetime access for $99.</p>
				</div>
				<div className="flex gap-4">
					{!userData?.isAuthenticated ? (
						<>
							<LoginLink postLoginRedirectURL="/app/dashboard">
								<Button size="lg">Login</Button>
							</LoginLink>
							<RegisterLink postLoginRedirectURL="/app/dashboard">
								<Button variant="secondary" size="lg">Register</Button>
							</RegisterLink>
						</>
					) : !userData.isPayingMember ? (
						<PurchaseBtn />
					) : (
						<Button size="lg" asChild>
							<Link href="/app/dashboard">Go to the Dashboard</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
