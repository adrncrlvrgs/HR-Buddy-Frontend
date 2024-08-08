
import Ripple from "@/components/effects/Ripple";
import Image from "next/image";

export default function Home() {
  return (
    <>

      <div className="relative z-[-1] w-full h-full flex items-center justify-center bg-background md:shadow-xl">
        <div className="absolute h-[300px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-slate-500 to-transparent blur-2xl content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 sm:w-[350px] lg:h-[260px]"></div>
        <div className="absolute h-[180px] w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-conic from-slate-600 via-slate-300 blur-2xl content-[''] after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:w-[230px]"></div>

        <div className="relative flex h-[100vh] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl z-10">
          <p className="whitespace-pre-wrap text-center text-3xl font-medium tracking-tighter text-white pt-7">
            HR Buddy
          </p>
          <button>Start</button>
          <Ripple/>
          <div className="z-10 relative top-[36%]">Your AI interview coach, ready to elevate your prep experience.</div>
        </div>
        
      </div>


    </>
  );
}
