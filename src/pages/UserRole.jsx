import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Sara Lee', email: 'sara@example.com' },
    { id: 5, name: 'David Clark', email: 'david@example.com' },
];

const existingRoles = [
    { id: 'admin', name: 'Admin' },
    { id: 'editor', name: 'Editor' },
    { id: 'viewer', name: 'Viewer' },
];

const UserRole = () => {
    const [step, setStep] = useState(0);
    const [roleDetails, setRoleDetails] = useState({ roleId: '', roleName: '', description: '' });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [criteria, setCriteria] = useState({ criteria1: '', criteria2: '', criteria3: '' });
    const [savedConfig, setSavedConfig] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoleDetails((prev) => ({ ...prev, [name]: value }));
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleCriteriaChange = (e) => {
        const { name, value } = e.target;
        setCriteria((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const handlePrevious = () => {
        setStep((prev) => prev - 1);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const config = {
            role: roleDetails,
            users: selectedUsers,
            criteria: criteria,
        };
        setSavedConfig(config);
        alert(`Configuration Saved: ${JSON.stringify(config)}`);
    };

    const cardStyle = "bg-black rounded-lg shadow-sm p-6 flex flex-col gap-y-4";

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
            <h1 className="title text-2xl font-semibold mb-4">User Role</h1>
            <div className="flex space-x-4 mb-6">
                <div
                    className={`flex-1 text-center py-3 rounded-md text-sm font-semibold ${step === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 text-gray-800'
                        }`}
                    style={{ height: '40px' }}
                >
                    Role Details
                </div>
                <div
                    className={`flex-1 text-center py-3 rounded-md text-sm font-semibold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 text-gray-800'
                        }`}
                    style={{ height: '40px' }}
                >
                    Select Users
                </div>
                <div
                    className={`flex-1 text-center py-3 rounded-md text-sm font-semibold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 text-gray-800'
                        }`}
                    style={{ height: '40px' }}
                >
                    Define Criteria
                </div>
            </div>

            {step === 0 && (
                <div className={cardStyle}>
                    <h2 className="text-lg font-semibold mb-4">Role Details</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="roleId" className="text-left">Role ID</Label>
                            <Input
                                name="roleId"
                                id="roleId"
                                type="text"
                                placeholder="Enter role ID"
                                className="w-full"
                                value={roleDetails.roleId}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="roleName" className="text-left">Role Name</Label>
                            <Input
                                name="roleName"
                                id="roleName"
                                type="text"
                                placeholder="Enter role name"
                                className="w-full"
                                value={roleDetails.roleName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid gap-2 col-span-1 md:col-span-2">
                            <Label htmlFor="description" className="text-left">Description</Label>
                            <Textarea
                                name="description"
                                id="description"
                                placeholder="Enter description"
                                className="w-full min-h-[100px]"
                                value={roleDetails.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='grid gap-2 col-span-1 md:col-span-2'>
                            <Label htmlFor="existingRole" className="text-center">------------------ Or ------------------</Label>
                            <Label htmlFor="existingRole" className="text-left-black">Select Existing Role</Label>

                            <select id="existingRole" className='text-black text-sm font-semibold w-full rounded-md border border-gray-200 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-3 py-2' onChange={(e) => {
                                const selectedRole = existingRoles.find((role) => role.id === e.target.value);
                                if (selectedRole) {
                                    setRoleDetails({
                                        roleId: selectedRole.id,
                                        roleName: selectedRole.name,
                                        description: `${selectedRole.name} description`,
                                    });
                                } else {
                                    setRoleDetails({ roleId: '', roleName: '', description: '' });
                                }

                            }} value={roleDetails.roleId}>
                                <option value="">-- Select Existing Role --</option>
                                {existingRoles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full flex justify-end col-span-1 md:col-span-2">
                            <Button type="button" onClick={handleNext}>
                                Next
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {step === 1 && (
                <div className={cardStyle}>
                    <h2 className="text-lg font-semibold mb-4">Select Users</h2>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">Select</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleUserSelection(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button onClick={handlePrevious}>Previous</Button>
                        <Button onClick={handleNext}>Next</Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className={cardStyle}>
                    <h2 className="text-lg font-semibold mb-4">Define Criteria</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="grid gap-2">
                                <Label htmlFor={`criteria${num}`} className="text-left">Criteria {num}</Label>
                                <select
                                    id={`criteria${num}`}
                                    className="text-sm font-semibold text-black mb-4 w-full rounded-md border border-gray-200 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-3 py-2"
                                    name={`criteria${num}`}
                                    value={criteria[`criteria${num}`]}
                                    onChange={handleCriteriaChange}
                                >
                                    <option value="">-- Select Criteria {num} --</option>
                                    <option value={`criteria${num}A`}>Criteria {num}A</option>
                                    <option value={`criteria${num}B`}>Criteria {num}B</option>
                                </select>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-end mt-6">
                        <Button type="button" onClick={handleSave}>
                            Save Configuration
                        </Button>
                    </div>
                </div>
            )}

            {savedConfig && (
                <div className={cardStyle}>
                    <h2 className="text-lg font-semibold mb-4">Saved Configuration</h2>
                    <pre>{JSON.stringify(savedConfig, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default UserRole;