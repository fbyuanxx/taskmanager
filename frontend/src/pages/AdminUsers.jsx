import { useState } from 'react';
const AdminUsers = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    const users = [
        {
            id: '1',
            name: 'Alice Smith',
            email: 'alice@example.com',
            university: 'Queensland University of Technology',
            address: 'Brisbane, QLD',
            status: 'Active',
        },
        {
            id: '2',
            name: 'Bob Jones',
            email: 'bob@example.com',
            university: 'Griffith University',
            address: 'Gold Coast, QLD',
            status: 'Disabled',
        },
        {
            id: '3',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            university: 'University of Queensland',
            address: 'St Lucia, QLD',
            status: 'Active',
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white p-6 shadow-md rounded">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">User Management</h1>
                        <p className="text-gray-600">View and manage registered user accounts.</p>
                    </div>
                    <p className="text-sm text-gray-600">Total users: {users.length}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Email</th>
                                <th className="border p-3">Status</th>
                                <th className="border p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan="4" className="border p-6 text-center text-gray-500">
                                    No registered users found.
                                </td>
                                </tr>
                            ) : (
                                users.map((registeredUser) => (
                                    <tr key={registeredUser.id} className="hover:bg-gray-50">
                                        <td className="border p-3"> {registeredUser.name}</td>
                                        <td className="border p-3">{registeredUser.email}</td>
                                        <td className="border p-3">
                                            <span
                                                className={
                                                    registeredUser.status === 'Active'
                                                        ? 'rounded bg-green-100 px-2 py-1 text-sm text-green-700'
                                                        : 'rounded bg-red-100 px-2 py-1 text-sm text-red-700'
                                                }
                                            >
                                                {registeredUser.status}
                                            </span>
                                        </td>

                                        <td className="border p-3">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedUser(registeredUser)}
                                                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="user-details-title"
                >
                    <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2
                                id="user-details-title"
                                className="text-xl font-bold"
                            >
                                User Details
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="text-2xl text-gray-500 hover:text-gray-800"
                                aria-label="Close user details"
                            >
                                &times;
                            </button>
                        </div>

                        <dl className="space-y-4">
                            <div>
                                <dt className="font-semibold text-gray-700">
                                    Name
                                </dt>
                                <dd>{selectedUser.name}</dd>
                            </div>

                            <div>
                                <dt className="font-semibold text-gray-700">
                                    Email
                                </dt>
                                <dd>{selectedUser.email}</dd>
                            </div>

                            <div>
                                <dt className="font-semibold text-gray-700">
                                    University
                                </dt>
                                <dd>{selectedUser.university || 'Not provided'}</dd>
                            </div>

                            <div>
                                <dt className="font-semibold text-gray-700">
                                    Address
                                </dt>
                                <dd>{selectedUser.address || 'Not provided'}</dd>
                            </div>

                            <div>
                                <dt className="font-semibold text-gray-700">
                                    Account status
                                </dt>
                                <dd>{selectedUser.status}</dd>
                            </div>
                        </dl>

                        <button
                            type="button"
                            onClick={() => setSelectedUser(null)}
                            className="mt-6 w-full rounded bg-gray-600 p-2 text-white hover:bg-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;