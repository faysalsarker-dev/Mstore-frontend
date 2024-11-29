/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

const MyCard = () => {
    const axiosCommon = useAxios();
    const { user } = useAuth();

    const { data: cards = [], isLoading } = useQuery({
        queryKey: ["my-all-card"],
        queryFn: async () => {
            const { data } = await axiosCommon.get(`/my-all-card/${user?.email}`);
            return data;
        },
    });

    const [modalData, setModalData] = useState(null);

    const handleClaimClick = (card) => {
        setModalData(card);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    return (
        <div className="p-4">
            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center min-h-screen">
                    <span className="text-gray-600">Loading cards...</span>
                </div>
            )}

   

            {/* Empty State */}
            {!isLoading && cards.length === 0 && (
                <div className="text-center mt-4 min-h-screen text-gray-600">
                    You don&apos;t have any cards yet.
                </div>
            )}

            {/* Card Table */}
            {cards.length > 0 && (
                <CardTable cards={cards} onClaimClick={handleClaimClick} />
            )}

            {/* Modal */}
            {modalData && (
                <Modal card={modalData} onClose={handleCloseModal} />
            )}
        </div>
    );
};

const CardTable = ({ cards, onClaimClick }) => (
    <div className="overflow-x-auto mt-4">
        <table className="table w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th>Card Type</th>
                    <th>Card Number</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {cards.map((card) => (
                    <tr key={card._id} className="hover:bg-gray-100">
                        <td>{card.cardType}</td>
                        <td>{card.cardNumber}</td>
                        <td>{card.city}</td>
                        <td>{card.state}</td>
                        <td>
                            <button
                                onClick={() => onClaimClick(card)}
                                className="btn btn-primary"
                            >
                                Claim
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const Modal = ({ card, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
    >
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 id="modal-title" className="text-2xl font-bold mb-4">
                Card Details
            </h2>
            <div className="space-y-2">
                <p><strong>Card Type:</strong> {card.cardType}</p>
                <p><strong>Card Number:</strong> {card.cardNumber}</p>
                <p><strong>Holder Name:</strong> {card.holderName}</p>
                <p><strong>Price:</strong> {card.price}</p>
                <p><strong>Country:</strong> {card.country}</p>
                <p><strong>City:</strong> {card.city}</p>
                <p><strong>State:</strong> {card.state}</p>
                <p><strong>Area:</strong> {card.area}</p>
                <p><strong>Area Code:</strong> {card.areaCode}</p>
                <p><strong>Zip Code:</strong> {card.zipCode}</p>
                <p><strong>Mobile:</strong> {card.mobile}</p>
                <p><strong>Email:</strong> {card.gmail}</p>
                <p><strong>Expiry Date:</strong> {card.date}/{card.year}</p>
                <p><strong>CVV:</strong> {card.cvv}</p>
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="btn btn-secondary"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

export default MyCard;
