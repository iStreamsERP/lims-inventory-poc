import { Button } from '@/components/ui/button'
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
                    <Link to="/settings" className="hover:underline">
                        <div className="px-4 py-2 text-sm leading-none rounded-lg">
                            Account
                        </div>
                    </Link>
                    <Link to="/cloud-services" className="hover:underline">
                        <div className="px-4 py-2 text-sm bg-gray-300 text-slate-950 dark:bg-gray-800 dark:text-slate-50 leading-none rounded-lg">
                            Cloud Services
                        </div>
                    </Link>
                    <Link to="/integration" className="hover:underline">
                        <div className="px-4 py-2 text-sm leading-none rounded-lg">
                            Integration
                        </div>
                    </Link>
                </aside>

                <main className="overflow-y-auto col-span-3 space-y-2">
                    <div className="flex items-center justify-between p-2 shadow-lg rounded-lg bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-x-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-800">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoIIjGsTkIXHdPitYpJ8d6vixJGpBYeNRp1g&s"
                                    alt="AWS Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AWS</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Authorize AWS to post alert notifications to your Slack workspace.
                                </p>
                            </div>
                        </div>
                        <div>
                            <Button>Connect</Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2 shadow-lg rounded-lg bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-x-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-800">
                                <img
                                    src="https://www.cbackup.com/screenshot/en/others/mega/megacloud-icon.png"
                                    alt="Mega Cloud Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mega Cloud</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Authorize Mega Cloud to post alert notifications to your Slack workspace.
                                </p>
                            </div>
                        </div>
                        <div>
                            <Button>Connect</Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default UserPreferences
