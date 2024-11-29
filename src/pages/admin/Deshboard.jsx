/* eslint-disable react/prop-types */
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Card Component
const DashboardCard = ({ title, count, bgColor, textColor }) => (
  <div className={`card ${bgColor} ${textColor}`}>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <p>{count}</p>
    </div>
  </div>
);

// Notes Component
const NoteItem = ({ note, onDelete }) => (
  <div className="relative p-4 bg-white rounded-lg shadow mb-4">
    <ReactQuill value={note} readOnly={true} modules={{ toolbar: false }} />
    <button
      onClick={onDelete}
      className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 p-2 rounded-full"
      aria-label="Delete Note"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-red-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </button>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [type, setType] = useState(null);
  const [account, setAccount] = useState("");
  const [notes, setNotes] = useState("");
  const axiosCommon = useAxios();

  // Fetch data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["Dashboard"],
    queryFn: async () => {
      const { data } = await axiosCommon.get("/dashboard");
      return data;
    },
  });
  // Mutations
  const addAccount = useMutation({
    mutationFn: async (info) => axiosCommon.post("/add-account", info),
    onSuccess: () => {
      toast.success("Account added successfully");
      refetch();
    },
    onError: () => toast.error("Failed to add account"),
  });

  const deleteAccount = useMutation({
    mutationFn: async (id) => axiosCommon.delete(`/account-delete/${id}`),
    onSuccess: () => {
      toast.success("Account deleted successfully");
      refetch();
    },
    onError: () => toast.error("Failed to delete account"),
  });

  const addNote = useMutation({
    mutationFn: async (note) => axiosCommon.post("/add-note", { note }),
    onSuccess: () => {
      toast.success("Note added successfully");
      refetch();
    },
    onError: () => toast.error("Failed to add note"),
  });

  const deleteNote = useMutation({
    mutationFn: async (id) => axiosCommon.delete(`/note-delete/${id}`),
    onSuccess: () => {
      toast.success("Note deleted successfully");
      refetch();
    },
    onError: () => toast.error("Failed to delete note"),
  });

  // Handlers
  const handleAddAccount = () => {
    if (!type || !account) return toast.error("Please fill in all fields");
    addAccount.mutate({ type, account });
    setType("");
    setAccount("");
  };

  const handleDeleteAccount = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteAccount.mutate(id);
    });
  };

  const handleAddNote = () => {
    if (!notes) return toast.error("Please add some content to the note");
    addNote.mutate(notes);
    setNotes("");
  };

  const handleDeleteNote = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteNote.mutate(id);
    });
  };

  // Modules for ReactQuill
  const quillModules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-6 mb-6">
        <DashboardCard
          title="Total Users"
          count={data?.users?.length || 0}
          bgColor="bg-primary"
          textColor="text-primary-content"
        />
        <DashboardCard
          title="Total Cards"
          count={data?.cards?.length || 0}
          bgColor="bg-secondary"
          textColor="text-secondary-content"
        />
        <DashboardCard
          title="Total Accounts"
          count={data?.account?.length || 0}
          bgColor="bg-accent"
          textColor="text-accent-content"
        />
        <DashboardCard
          title="Total Notes"
          count={data?.note?.length || 0}
          bgColor="bg-info"
          textColor="text-info-content"
        />
      </div>

      {/* Add Account Section */}
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddAccount}>
          Add Account
        </button>
      </div>

      {/* Accounts List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading accounts</p>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Accounts</h2>
          {data?.account?.map((info) => (


<div
  key={info._id}
  role="alert"
  className="flex my-2  items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
>
  {/* Type Section */}
  <div className="flex items-center gap-4">
    <h3 className="font-bold text-lg pr-4 border-r-4 border-black">{info.type}</h3>
    <div>
      <h4 className="text-gray-700 text-sm sm:text-base font-medium">{info.account}</h4>
    </div>
  </div>

  {/* Delete Button */}
  <button
    onClick={() => handleDeleteAccount(info._id)}
    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
  >
    Delete
  </button>
</div>

          
          ))}
        </div>
      )}

      {/* Notes Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        <ReactQuill
          value={notes}
          onChange={setNotes}
          placeholder="Write your note here..."
          modules={quillModules}
        />
        <button className="btn btn-secondary mt-4" onClick={handleAddNote}>
          Add Note
        </button>
        <div className="mt-6">
          {data?.note?.map((note, idx) => (
            <NoteItem
              key={idx}
              note={note.note}
              onDelete={() => handleDeleteNote(note._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
