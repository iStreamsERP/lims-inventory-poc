import { Separator } from '@/components/ui/separator'
import React from 'react'
import { Link } from 'react-router-dom'

const UserPreferences = () => {
    return (
        <div className="flex flex-col gap-4">
            <header>
                <h1 className="text-4xl font-bold mb-1">Settings</h1>
                <p className="text-sm text-gray-500">
                    Manage your account settings and email preferences.
                </p>
            </header>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-156px)] gap-x-4">
                <aside className="flex flex-col gap-2 h-full">
                    <Link to="/ss" className="hover:underline">
                        <div className="px-4 py-2 text-sm bg-gray-300 text-slate-950 dark:bg-gray-800 dark:text-slate-50 leading-none rounded-lg">
                            Profile
                        </div>
                    </Link>
                    <Link to="/ss" className="hover:underline">
                        <div className="px-4 py-2 text-sm leading-none rounded-lg">
                            Account
                        </div>
                    </Link>
                    <Link to="/ss" className="hover:underline">
                        <div className="px-4 py-2 text-sm leading-none rounded-lg">
                            Integration
                        </div>
                    </Link>
                </aside>

                <main className="overflow-y-auto col-span-3">
                    <div className='flex items-start gap-x-4'>
                        <div className='h-16 w-32 overflow-hidden rounded-lg bg-slate-800'>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoIIjGsTkIXHdPitYpJ8d6vixJGpBYeNRp1g&s" className='h-full w-full object-contain' />
                        </div>

                        <div>
                            <p className='text-xs font-medium text-gray-400'>AWS</p>
                            <p className='text-xs font-medium'>Authorize MongoDB to post alert notifications to your Slack workspace

                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>

    )
}

export default UserPreferences