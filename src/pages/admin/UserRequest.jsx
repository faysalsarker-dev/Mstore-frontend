import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const UserRequest = () => {
  const axiosCommon = useAxios();
  const [modalInfo, setModalInfo] = useState(null); // To manage modal state
  const [amount, setAmount] = useState("");
  const {user}=useAuth()

  // Fetch Request Info
  const { data: requestInfo, refetch } = useQuery({
    queryKey: ["request"],
    queryFn: async () => {
      const { data } = await axiosCommon.get("/request-details");
      return data;
    },
  });

  // Mutation for Updating a Request
  const updateRQ = useMutation({
    mutationFn: async (info) =>
      axiosCommon.patch(`/request-update/${info._id}`, info),
    onSuccess: () => {
      toast.success("Request updated successfully.");
      refetch();
      setAmount('')
      setModalInfo(null); // Close modal
    },
    onError: () => {
        setAmount('')
        toast.error("Failed to update the request.")},
  });

  // Mutation for Deleting a Request
  const deleteRQ = useMutation({
    mutationFn: async (id) => axiosCommon.delete(`/request-delete/${id}`),
    onSuccess: () => {
      toast.success("Request deleted successfully.");
      refetch();
    },
    onError: () => toast.error("Failed to delete the request."),
  });

  // Update Confirmation Handler
  const onUpdate = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    const updatedInfo = { ...modalInfo, amount, author:user?.email };
    updateRQ.mutate(updatedInfo);
  };

  // Delete Confirmation Handler
  const onDelete = (id) => {
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
        deleteRQ.mutate(id);
      }
    });
  };

  return (
    <div className="mt-10 p-4">
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Transaction Code</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">username</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestInfo?.map((info, idx) => (
              <tr
                key={info._id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {info.id}
                </td>
                <td className="px-4 py-3 text-gray-700">{info.amount}</td>
                <td className="px-4 py-3 text-gray-700 capitalize">
                  {info.type}
                </td>
                <td className="px-4 py-3">
                  <div
                    className={`badge ${
                      info.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-gray-800"
                    } px-3 py-1 rounded-full text-sm`}
                  >
                    {info.status}
                  </div>
                </td>
                <td className="px-4 py-3">
               {info.username}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(info.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => setModalInfo(info)}
                    className="btn btn-xs bg-primary text-white rounded-md"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => onDelete(info._id)}
                    className="btn btn-xs bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Updating Amount */}
      {modalInfo && (
        <dialog
          open
          className="modal modal-open"
          onClose={() => setModalInfo(null)}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Activate Request</h3>
            <p className="text-gray-700 mb-4">
              Updating request for Transaction Code:{" "}
              <strong>{modalInfo.id}</strong>
            <br />
            
              <strong>Ammount {modalInfo.amount}</strong>
            </p>
            <input
              type="number"
              defaultValue={modalInfo.amount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="input input-bordered w-full mb-4"
            />
            <div className="modal-action">
              <button
                onClick={onUpdate}
                className="btn btn-sm bg-green-500 text-white rounded-md"
              >
                Submit
              </button>
              <button
                onClick={() => setModalInfo(null)}
                className="btn btn-sm bg-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default UserRequest;
