import React from 'react'
import Navbar_ from '../../components_/Navbar'


function LandingPage() {
  return (
    <div>
    <DummyContent/>
    </div>
  )
}


const DummyContent = () => {
    return (
        <div className="container mx-auto w-[80%] p-8 pt-24  ">
            
            <h1 className="mb-4 text-center text-6xl font-bold  bg-gradient-to-r from-yellow-400 via-orange-500 to-gray-800 bg-clip-text text-transparent">
                Join the Hive. Code with Purpose.
            </h1>

            <p className="mb-10 text-center text-sm text-zinc-500 mx-[13%] ">
                Just like bees thrive through structure and focus, Code-Bee helps developers grow with precision. Tackle bite-sized coding challenges, get real-time results, and build lasting skills one line of code at a time.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    {
                        id: 1,
                        title: "The",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 2,
                        title: "First",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 3,
                        title: "Rule",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 4,
                        title: "Of",
                        width: "md:col-span-3",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 5,
                        title: "F",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 6,
                        title: "Club",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 7,
                        title: "Is",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 8,
                        title: "You",
                        width: "md:col-span-1",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 9,
                        title: "Do NOT TALK about",
                        width: "md:col-span-2",
                        height: "h-60",
                        bg: "bg-neutral-100 dark:bg-neutral-800",
                    },
                    {
                        id: 10,
                        title: "F Club",
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
            </div>
        </div>
    );
};
export default LandingPage