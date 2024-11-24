import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";

const BuyCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [dateSort, setDateSort] = useState("asc");
  const [filterType, setFilterType] = useState("All");
  const limit = 10;
  const axiosCommon = useAxios();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-cards", currentPage, search, dateSort, filterType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search: search,
        sortField: "expiryDate",
        sortOrder: dateSort,
        filter: filterType,
      });
      const { data } = await axiosCommon.get(`/all-cards?${params.toString()}`);
      return data;
    },
  });

  const handleSortChange = (e) => {
    setDateSort(e.target.value);
    refetch();
  };

  const handleSearch = (e) => {
    setSearch(searchQuery)
    e.preventDefault();
    refetch();
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="p-4">
      {/* Top Bar with Search, Sort and Filters */}
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
            <option value="All">All Types</option>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="American Express">American Express</option>
          </select>
          <select className="select select-bordered w-full max-w-xs"
            value={dateSort}
            onChange={handleSortChange}
          >
  <option disabled selected>All</option>
  <option  value='asc' >Sort Asc</option>
  <option  value='desc'>Sort Desc</option>
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
