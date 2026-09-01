import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(
                    '/api/admin/users',
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                setUsers(response.data);
            } catch (error) {
                alert(
                    error.response?.data?.message ||
                    'Failed to retrieve registered users.'
                );
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [user]);
    const handleStatusChange = async (registeredUser) => {
        const newStatus = registeredUser.isActive === false;

        const action = newStatus ? 'enable' : 'disable';

        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${registeredUser.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await axiosInstance.patch(
                `/api/admin/users/${registeredUser._id}/status`,
                {
                    isActive: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser._id === response.data._id
                        ? response.data
                        : currentUser
                )
            );

            if (selectedUser?._id === response.data._id) {
                setSelectedUser(response.data);
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Failed to update user account status.'
            );
        }
    };
    if (loading) {
        return (
            <div className="mt-20 text-center">
                Loading registered users...
            </div>
        );
    }

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
                                    <tr key={registeredUser._id} className="hover:bg-gray-50">
                                        <td className="border p-3"> {registeredUser.name}</td>
                                        <td className="border p-3">{registeredUser.email}</td>
                                        <td className="border p-3">
                                            <span
                                                className={registeredUser.isActive !== false? 'rounded bg-green-100 px-2 py-1 text-sm text-green-700': 'rounded bg-red-100 px-2 py-1 text-sm text-red-700'

                                                }>
                                                {registeredUser.isActive === false ? 'Disabled' : 'Active'}
                                            </span>
                                        </td>

                                        <td className="border p-3">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setSelectedUser(registeredUser)} className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                                >View</button>

                                                <button type="button" onClick={() => handleStatusChange(registeredUser)} disabled={registeredUser._id === user.id}
                                                    className={ registeredUser.isActive === false ? 'rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50' : 'rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                                                    }
                                                    title={
                                                        registeredUser._id === user.id ? 'You cannot disable your own account': undefined
                                                    }
                                                >
                                                    {registeredUser.isActive === false ? 'Enable' : 'Disable'}
                                                </button>
                                            </div>
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
                                <dd>
                                    {selectedUser.isActive === false
                                        ? 'Disabled'
                                        : 'Active'}
                                </dd>
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