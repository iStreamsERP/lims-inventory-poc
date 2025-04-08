import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const CreateService = () => {
    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Create Service</h1>
            <form className="w-full grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Item Code
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Item Code"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Item Name
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Item Name"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Supplier Ref
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Supplier Ref"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Sales Price
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Sales Price"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Margin %
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Margin %"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Category
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Category"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Quantity
                    </Label>
                    <div className="flex items-center gap-1">
                        <Input
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Quantity"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 col-span-2 gap-2">
                    <Label htmlFor="newUserName" className="text-left">
                        Remarks
                    </Label>
                    <div className="flex items-center gap-1">
                        <Textarea
                            name="newUserName"
                            id="newUserName"
                            type="text"
                            placeholder="Type Remarks"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className='w-full flex justify-center col-span-2'>
                    <Button variant="default">
                        Create Service
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateService
