import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const CardManagement = () => {
  const axiosCommon = useAxios();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");
  const [filter, setFilter] = useState("All");

  


  const { data, isLoading, isError } = useQuery({
    queryKey:  ["all-cards", page, search, sort, filter],
    queryFn: async () => {
      const { data } = await axiosCommon.get(
        `/all-cards?page=${page}&limit=10&sortField=${sort}&search=${search}&filter=${filter}`
      );
      setTotalPages(data.totalPages)
      return data;
    },
    keepPreviousData: true
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle search input change and trigger refetch
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle sort and filter changes and trigger refetch
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by card number"
            className="w-full p-3 pl-10 rounded-lg border border-gray-300"
            value={search}
            onChange={handleSearchChange} // Use the function here
          />
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 16a7 7 0 111.001-14.001A7 7 0 0111 16zM22 22l-4-4"
            />
          </svg>
        </div>

        {/* Dropdown to Sort by Expiration Date */}
        <select
          value={sort}
          onChange={handleSortChange} // Use the function here
          className="p-3 rounded-lg border border-gray-300"
        >
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>

        {/* Filter by Card Type */}
        <select
          value={filter}
          onChange={handleFilterChange} // Use the function here
          className="p-3 rounded-lg border border-gray-300"
        >
          <option value="All">All Cards</option>
          <option value="Visa">Visa</option>
          <option value="MasterCard">MasterCard</option>
        </select>

        {/* Button to Add New Card */}
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add New Card
        </button>
      </div>

      {/* Table to Display Cards */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Card Number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Holder Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Expire Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">CVV</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
            </tr>
          </thead>
          <tbody>
            {data.data.length > 0 ? (
              data.data.map((card, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-900">{card.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{card.holder}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{card.expireDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{card.cvv}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{card.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500">
                  No cards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`join-item btn ${page === index + 1 ? "btn-active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardManagement;
