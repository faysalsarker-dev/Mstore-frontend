import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Users = () => {
  const axiosCommon = useAxios();

  // Fetch user data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-user"],
    queryFn: async () => {
      const { data } = await axiosCommon.get("/users");
      return data;
    },
  });

  // Delete user mutation
  const { mutateAsync: deleteUser } = useMutation({
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

  // Update user status mutation
  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async (newValue) => {
      const response = await axiosCommon.patch(`/update-user${newValue._id}`, newValue);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "User status updated successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
      }
    });
  };

  const handleStatusToggle = async (user) => {
    const { status } = user;
    const newStatus = status === "active" ? "deactive" : "active";
    const newValue = { ...user, status: newStatus };

    Swal.fire({
      title: `Are you sure you want to ${status === "active" ? "deactivate" : "activate"} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "active" ? "#d33" : "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: status === "active" ? "Yes, deactivate!" : "Yes, activate!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(newValue).catch(() => {
          Swal.fire("Error", "Something went wrong while updating the status.", "error");
        });
      }
    });
  };

  // Handle loading and error states
  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading users...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load user data. Please try again.</div>;
  }

  // Empty state
  if (!data?.data?.length) {
    return <div className="text-center py-10 text-gray-500">No users found.</div>;
  }

  return (
    <div className="px-2 mx-auto ">
      <h1 className="text-2xl font-bold text-center mb-6 text-primary">User Management</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
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
                    {new Date(user.createAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "active" ? "badge-success" : "badge-error"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Deactive"}
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
                    onClick={() => handleStatusToggle(user)}
                    className={`btn btn-sm ${
                      user.status === "active" ? "btn-warning" : "btn-success"
                    }`}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
