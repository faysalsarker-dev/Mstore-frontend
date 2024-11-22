import  { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";


const BuyCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateSort, setDateSort] = useState("asc");
const limit = 10
  const axiosCommon = useAxios()



  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-cards", currentPage, searchQuery, dateSort],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search: searchQuery,
        sortField: "expiryDate",
        sortOrder: dateSort,
      });
      const { data } = await axiosCommon.get(`/all-cards?${params.toString()}`);
      return data;
    },
  });


  const handleSortChange = (order) => {
    setDateSort(order);
    refetch();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="p-4">
      {/* Search and Sort Bar */}
      <div className="flex justify-between items-center mb-4">
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by country name"
            className="input input-bordered"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
        <div>
          <button
            className="btn btn-outline mx-1"
            onClick={() => handleSortChange("asc")}
          >
            Sort Asc
          </button>
          <button
            className="btn btn-outline mx-1"
            onClick={() => handleSortChange("desc")}
          >
            Sort Desc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Card Number</th>
              <th>Holder Name</th>
              <th>Country</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((card) => (
              <tr key={card._id}>
                <td>{card.cardNumber}</td>
                <td>{card.holderName}</td>
                <td>{card.country}</td>
                <td>{card.date}</td>
                <td>
                  <button className="btn btn-primary btn-sm">Buy Now</button>
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

export default BuyCard;
