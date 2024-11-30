import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const BuyCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
const [load,setLoad]=useState(false)
  const limit = 10;
  const axiosCommon = useAxios();
  const { user, whoMe,myInfo } = useAuth();
const navigate = useNavigate()
  // Query for fetching cards
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["all-cards", currentPage, search, filterType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        search,
        filter: filterType,
      });
      const { data } = await axiosCommon.get(`/all-cards?${params.toString()}`);
      return data;
    },
  });

  // Mutation for buying a card
  const { mutateAsync: BuyCard } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosCommon.patch(`/update-card/${info._id}`, info);
      return data;
    },
    onSuccess: () => {
      toast.success("Card added successfully");
      myInfo(user?.email)
      setLoad(false)
    
    },
    onError: () => {
      toast.error("Something went wrong.");
      setLoad(false)
    },
  });

  const onBuy = (info) => {
    setLoad(true)
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to make a purchase.",
        icon: "warning",
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoad(false)
        navigate('/login')
      }
    });
    return;
  }

    if (!whoMe || whoMe.balance === undefined) {
      Swal.fire({
        title: "Account Issue",
        text: "Unable to fetch your account details. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
      setLoad(false)
      return;
    }

    if (whoMe.balance < info.price) {
      Swal.fire({
        title: "Insufficient Balance",
        text: "You don't have enough credits. Please add more to proceed.",
        icon: "warning",
        confirmButtonText: "Get credits",
        cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoad(false)
        navigate('/get-credit')
      }
    });
    return;
  
    }

    const data = {
      ...info,
      buyer: user.email,
    };

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to buy this card?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Buy it!",
    }).then((result) => {
      if (result.isConfirmed) {
        BuyCard(data);
      }
    });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchQuery);
    refetch();
  };

  // Card type options
  const cardTypes = [
    { name: "All", value: "All" },
    { name: "Visa", value: "Visa" },
    { name: "MasterCard", value: "MasterCard" },
    { name: "Amex", value: "Amex" },
    { name: "Discover", value: "Discover" },
    { name: "American Express", value: "American Express" },
  ];

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="p-4">
      {/* Top Bar with Search and Filters */}
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
        <table className="table w-full table-striped">
          <thead className="bg-gray-200">
            <tr>
              <th>Card Type</th>
              <th>Card Number</th>
            
              <th>Country</th>
              <th>Expiry Date</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((card) => (
              <tr key={card._id} className="bg-white hover:bg-gray-100">
                <td>{card.cardType}</td>
                <td>
  {card.cardNumber.slice(0, 6)}
</td>

               
                <td>{card.country}</td>
                <td>{card.date}</td>
                <td>{card.price}</td>
                <td>
                  <button
                  disabled={load}
                    onClick={() => onBuy(card)}
                    className="btn btn-primary btn-sm"
                  >
                    Buy Now
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
          disabled={currentPage === data?.totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BuyCard;
