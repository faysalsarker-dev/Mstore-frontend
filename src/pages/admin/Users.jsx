import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Users = () => {
  const axiosCommon = useAxios();
const {deleteUser}=useAuth()
  // State for pagination, search, and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");

  const limit = 7; // Number of items per page

  // Fetch user data with search and sort
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-user", currentPage, searchQuery,],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search: searchQuery,
      
      });
      const { data } = await axiosCommon.get(`/users?${params.toString()}`);
      return data;
    },
  });

  // Delete user mutation
  const { mutateAsync: deleteUserDb } = useMutation({
    mutationFn: async (id) => {
      const response = await axiosCommon.delete(`/delete-user${id}`);
      return response.data;
    },
    onSuccess: () => {
      
      Swal.fire({
        title: "Deleted!",
        text: "User deleted successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete user.", "error");
    },
  });

  // Handle delete confirmation
  const handleDelete = (user) => {
    const {_id,uid}= user;
    console.log(user);
  
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async(result) => {
      if (result.isConfirmed) {
       await deleteUserDb(_id);
        await deleteUser(uid)
      }
    });
  };

  // Handle loading and error states
 

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load user data. Please try again.</div>;
  }

  // Empty state
  if (!data?.data?.length) {
    return <div className="text-center py-10 text-gray-500">No users found.</div>;
  }

  const onSearch = ()=>{
    setSearchQuery(search)
  }
  return (
    <div className="px-2 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-primary">User Management</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <button
            onClick={() => {
              onSearch()
              setCurrentPage(1); // Reset to page 1 when searching
              refetch();
            }}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>

        {/* Sort by Date */}
 

        {/* Sort by Balance */}
      
      </div>



      {/* User Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <div>
          {
            isLoading && (
<div className="text-center py-10 text-gray-500">Loading users...</div>
            )
          }
        </div>
        <table className="table table-zebra w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left">Name</th>
              <th>Status</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td>
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge text-white ${
                      user.status === "active" ? "badge-success" : "badge-error"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <span className="text-primary font-semibold">${user.balance}</span>
                </td>
                <td className="flex flex-wrap gap-2">
                  <Link to={`/single-user/${user._id}`}>
                    <button className="btn btn-sm btn-outline btn-primary">Details</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(user)}
                    className="btn btn-sm btn-neutral"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <div className="btn-group ">
          <button
            className="btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            «
          </button>
          {[...Array(data.totalPages).keys()].map((num) => (
            <button
              key={num}
              className={`btn mx-1 ${currentPage === num + 1 ? "btn-active" : ""}`}
              onClick={() => setCurrentPage(num + 1)}
            >
              {num + 1}
            </button>
          ))}
          <button
            className="btn"
            disabled={currentPage === data.totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
