const AdminUsers = () => {
  const users = [
    {
      id: '1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Bob Jones',
      email: 'bob@example.com',
      status: 'Disabled',
    },
    {
      id: '3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
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

                    <td className="border p-3 text-gray-500">
                      —
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;