import Image from "next/image";


export const BackgroundPattern = () => {
    return (
        <div className="bg-[#a385e0] absolute h-[260px] top-0 left-0 w-full -z-10">
            <div className="w-full h-full relative">
                <Image
                    src="/stars.png"
                    alt="stars"
                    priority
                    fill
                    sizes="(max-width: 1920px) 100vw, 1920px"
                    className="object-bottom object-cover"
                />
            </div>
        </div>
    )
}