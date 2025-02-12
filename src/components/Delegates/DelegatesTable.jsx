import { Link } from "react-router-dom";

const DelegatesTable = ({ delegates, organname }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{organname} Delegates</h2>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Constituency</th>
              <th className="p-3">Support</th>
              <th className="p-3">Picture</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {delegates.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No delegates found.</td>
              </tr>
            ) : (
              delegates.map((delegate) => (
                <tr key={delegate.id} className="border-b hover:bg-gray-50 text-gray-700">
                  <td className="p-3">{delegate.name}</td>
                  <td className="p-3">{delegate.role}</td>
                  <td className="p-3">{delegate.phonenumber}</td>
                  <td className="p-3">{delegate.email}</td>
                  <td className="p-3">{delegate.constituency}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        delegate.supportstatus === "supports"
                          ? "bg-green-100 text-green-600"
                          : delegate.supportstatus === "opposes"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {delegate.supportstatus}
                    </span>
                  </td>
                  <td className="p-3">
                    {delegate.profilepic ? (
                      <img
                        src={delegate.profilepic}
                        alt={`${delegate.name}'s profile`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Link
                      to={`/viewDelegate/${delegate.id}`}
                      className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all"
                    >
                      View
                    </Link>
                    <Link
                      to={`/editdelegate/${delegate.id}`}
                      className="px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DelegatesTable;
