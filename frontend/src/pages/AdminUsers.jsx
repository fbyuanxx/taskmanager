const AdminUsers = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-2">
          User Management
        </h1>

        <p className="text-gray-600 mb-6">
          View and manage registered user accounts.
        </p>

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
              <tr>
                <td
                  colSpan="4"
                  className="border p-6 text-center text-gray-500"
                >
                  Registered users will appear here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;