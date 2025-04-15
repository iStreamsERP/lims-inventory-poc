import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from "@/components/ui/scroll-area"

const data = [
    {
        name: "Nassar",
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        email: "nassar@demo.com",
        amount: 19939.00
    },
    {
        name: "Anees",
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        email: "anees@demo.com",
        amount: 12499.00
    },
    {
        name: "Mubarak",
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        email: "mubarak@demo.com",
        amount: 49399.00
    },
    {
        name: "Bernie",
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        email: "bernie@demo.com",
        amount: 76299.00
    },
    {
        name: "Boy",
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        email: "boy@demo.com",
        amount: 98999.00
    },
    {
        name: "Mubarak",
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        email: "mubarak@demo.com",
        amount: 49399.00
    },
    {
        name: "Anees",
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        email: "anees@demo.com",
        amount: 12499.00
    },
]
const RecentSales = () => {
    return (
        <ScrollArea className="max-h-[200px] rounded-md border p-4 overflow-y-auto">
            <div className='flex flex-col gap-5'>
                {data.map((data, index) => (
                    <div className="space-y-3" key={index}>
                        <div className="flex items-start justify-between">
                            <div className='flex gap-2'>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={data.image} alt={data.name} />
                                    <AvatarFallback>{data.name}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-medium">{data.name}</p>
                                    <p className="text-xs text-gray-500 leading-none">{data.email}</p>
                                </div>
                            </div>
                            <div className="ml-auto text-sm font-bold">
                                ₹{data.amount}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}

export default RecentSales
