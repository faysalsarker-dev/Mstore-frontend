import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import PropTypes from "prop-types";

const GetCard = () => {
  const [id, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const axiosCommon = useAxios();
  const { user } = useAuth();

  // Fetch Dashboard Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await axiosCommon.get("/dashboard");
      return data;
    },
  });

  const { account, note } = data || {};

  // Fetch Request Details
  const {
    data: requestInfo,
    refetch,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useQuery({
    queryKey: ["request"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/request-details/${user?.email}`);
      return data;
    },
  });
console.log(requestInfo);
  // Mutation for Adding Request
  const addAccount = useMutation({
    mutationFn: async (info) => axiosCommon.post("/add-request", info),
    onSuccess: () => {
      toast.success("Request added successfully.");
      setId("");
      setType("");
      setAmount("");
      refetch();
    },
    onError: () => toast.error("Failed to add request."),
  });

  const addRequest = () => {
    if (!id || !amount || !type) {
      return toast.error("Please fill in all fields.");
    }

    const info = {
      id,
      amount,
    username:user?.displayName,
      email: user?.email,
      type,
      date: Date.now(),
      status: "pending",
    };
console.log(info);
    addAccount.mutate(info);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  const NoteItem = ({ note }) => (
    <div className="relative p-4 bg-gray-100 rounded-lg shadow mb-4">
      <ReactQuill value={note} readOnly={true} modules={{ toolbar: false }} />
    </div>
  );

  NoteItem.propTypes = {
    note: PropTypes.string.isRequired,
  };

  if (isLoading || isRequestLoading) return <div>Loading...</div>;
  if (isError || isRequestError) return <div>Failed to load data</div>;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Get Creadit</h1>

      {/* Account List */}
      <div className="grid grid-cols-1  gap-4">
        {account?.map((info) => (
          <div
            key={info._id}
            className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-1 items-center gap-4 truncate">
              <h3 className="font-bold text-lg pr-4 border-r-4 border-black truncate">
                {info.type}
              </h3>
              <div>
                <h4 className="text-gray-700 text-sm sm:text-base font-medium truncate">
                  {info.account}
                </h4>
              </div>
            </div>
            <button
              onClick={() => handleCopy(info.account)}
              className="btn btn-sm bg-gray-600 hover:bg-gray-900 text-white px-4 py-2 rounded-md transition-colors duration-300"
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div>
        {note?.map((noteItem, idx) => (
          <NoteItem key={idx} note={noteItem.note} />
        ))}
      </div>

      {/* Add Request Form */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Add request</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Type</span>
            </label>
            <input
              onChange={(e) => setType(e.target.value)}
              value={type}
              type="text"
              placeholder="Enter transaction type"
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex-1">
            <label className="label">
              <span className="label-text font-medium text-gray-700">
                Transaction Code
              </span>
            </label>
            <input
              onChange={(e) => setId(e.target.value)}
              value={id}
              type="text"
              placeholder="Enter transaction code"
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex-1">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Amount</span>
            </label>
            <input
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              type="number"
              placeholder="Enter amount"
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <button
        disabled={!user}
          onClick={addRequest}
          className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-300 w-full sm:w-auto"
        >
         Make request
        </button>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Transaction Code</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
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
                <td className="px-4 py-3 text-gray-700 capitalize">{info.type}</td>
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
                <td className="px-4 py-3 text-gray-600">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(info.date))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetCard;
