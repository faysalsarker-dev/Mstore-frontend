import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // Import SweetAlert2

const ManageCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");

  const [filterType, setFilterType] = useState("All");
  const limit = 10;
  const axiosCommon = useAxios();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-cards", currentPage, search, filterType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search: search,
        filter: filterType,
      });
      const { data } = await axiosCommon.get(`/all-cards?${params.toString()}`);
      return data;
    },
  });

  const handleSearch = (e) => {
    setSearch(searchQuery);
    e.preventDefault();
    refetch();
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    refetch();
  };

  const { mutateAsync: deleteCard } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosCommon.delete(`/delete-cards/${info._id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Card deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  // Show SweetAlert2 confirmation before delete
  const onDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will delete the card permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCard({ _id: id }); 
      }
    });
  };

  const cardTypes = [
    { name: "All", value: "All" },
    { name: "Visa", value: "Visa" },
    { name: "MasterCard", value: "MasterCard" },
    { name: "Amex", value: "Amex" },
    { name: "Discover", value: "Discover" },
    { name: "American Express", value: "American Express" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by country"
            className="input input-bordered w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <div className="flex gap-2 items-center">
          <select
            className="select select-bordered"
            value={filterType}
            onChange={handleFilterChange}
          >
            {cardTypes.map((type) => (
              <option key={type.name} value={type.value}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full table-striped ">
          <thead className="bg-gray-200">
            <tr>
              <th>Card Type</th>
              <th>Card Number</th>
              <th>Holder Name</th>
              <th>Country</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((card) => (
              <tr key={card._id} className="bg-white hover:bg-gray-100">
                <td>{card.cardType}</td>
                <td>{card.cardNumber}</td>
                <td>{card.holderName}</td>
                <td>{card.country}</td>
      
                <td>{card.date}</td>
                <td>
                  <button
                    onClick={() => onDelete(card._id)}
                    className="btn btn-danger btn-sm"
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
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-sm mx-1"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-sm mx-1"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === data.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageCard;
