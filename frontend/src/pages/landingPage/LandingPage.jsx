import React from 'react'
import Navbar_ from '../../components_/Navbar'
import Balancer from 'react-wrap-balancer'
import { MoveRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// function LandingPage() {
    
//   return (
//     <div>
//     <DummyContent/>
//     </div>
//   )
// }


const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div className="container mx-auto w-[80%] p-8 pt-24 flex flex-col items-center justify-start ">
            <div className='flex z-0 py-20 mt-12 flex-col items-center justify-center relative'>
                <h1 className="mb-4 text-center text-6xl font-bold  bg-gradient-to-r from-yellow-400 via-orange-500 to-gray-800 bg-clip-text text-transparent">
                    <Balancer>
                        Join the Hive.<br></br> Code with Purpose.
                    </Balancer>
                </h1>
                <p className="mb-10 text-center text-sm text-zinc-500 mx-[11%] ">
                    <Balancer>
                        Just like bees thrive through structure and focus, Code-Bee helps developers grow with precision. Tackle bite-sized coding challenges, get real-time results, and build lasting skills one line of code at a time.
                    </Balancer>
                </p>

                <button onClick={() => navigate('/problems')} className='flex items-center justify-center gap-2 px-4 py-2 rounded-md shadow-md bg-[#ffedbb] text-yellow-600 text-sm font-semibold hover:cursor-pointer hover:bg-yellow-400 hover:text-white transition-all duration-300'>Explore Problems <MoveRight className='w-5 h-5 mt-0.5'/></button>

                <img src="/assets/1-rbg.png" alt="" className='animate-bee rotate-[15deg] w-44 h-44 object-cover absolute top-0 left-10' />
                <div className="absolute inset-0 z-[-1] bg-yellow-300/10 mask-radial-from-50% mask-radial-closest-side bg-[radial-gradient(rgba(60,110,115,0.9)_0.5px,transparent_1px)] bg-[length:18px_18px]"></div>
            </div>
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    {
                        id: 1,
                        title: "",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 2,
                        title: "",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 3,
                        title: "",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 4,
                        title: "",
                        width: "md:col-span-3",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 5,
                        title: "",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 6,
                        title: "",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 7,
                        title: "",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 8,
                        title: "",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 9,
                        title: "",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 10,
                        title: "",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                ].map((box) => (
                    <div
                        key={box.id}
                        className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}>
                        <h2 className="text-xl font-medium">{box.title}</h2>
                    </div>
                ))}
            </div> */}
        </div>
    );
};
export default LandingPage