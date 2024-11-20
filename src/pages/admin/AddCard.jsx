import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";

const AddCard = () => {
  const { register, handleSubmit, formState: { errors },reset } = useForm();
  const axiosCommon = useAxios();
  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosCommon.post('/add-cards', info);
      return data;
    },
    onSuccess: () => {
        reset()
      toast.success('Card added successfully');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Something went wrong.');
    },
  });

  const onSubmit = (data, actionType) => {
    const info = {
      ...data,
      createdAt: Date.now(),
      status: actionType === 'publish' ? 'Published' : 'Draft',
    };
    
    mutateAsync(info);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Card Information</h2>
      <form 
        onSubmit={handleSubmit((data) => onSubmit(data, 'publish'))} 
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              {...register("cardNumber", { required: "Card number is required" })}
              className={`input input-bordered w-full ${errors.cardNumber ? 'input-error' : ''}`}
            />
            {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber.message}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
            <input
              type="text"
              id="date"
              placeholder="MM/YY"
              {...register("date")}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              id="year"
              {...register("year")}
              className="input input-bordered w-full"
            />
          </div>

          {/* CVV */}
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="text"
              id="cvv"
              {...register("cvv", { required: "CVV is required" })}
              className={`input input-bordered w-full ${errors.cvv ? 'input-error' : ''}`}
            />
            {errors.cvv && <p className="text-sm text-red-500">{errors.cvv.message}</p>}
          </div>
        </div>

        {/* Card Holder Name */}
 <div className="grid grid-cols-2 gap-2">
          <div >
            <label htmlFor="holderName" className="block text-sm font-medium text-gray-700">Card Holder Name</label>
            <input
              type="text"
              id="holderName"
              {...register("holderName")}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label htmlFor="Card Type" className="block text-sm font-medium text-gray-700">Card Type</label>
            <input
              type="text"
              id="cardType"
              {...register("cardType")}
              className="input input-bordered w-full"
            />
          </div>
 </div>

        {/* Address Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
            <input
              type="text"
              id="area"
              {...register("area")}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="areaCode" className="block text-sm font-medium text-gray-700">Area Code</label>
            <input
              type="text"
              id="areaCode"
              {...register("areaCode")}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Additional Address Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              id="state"
              {...register("state")}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              id="city"
              {...register("city")}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              {...register("zipCode")}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              id="mobile"
              {...register("mobile")}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">Gmail</label>
            <input
              type="email"
              id="gmail"
              {...register("gmail")}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              {...register("country")}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="text-center mt-6 flex w-full gap-2 justify-end">
          <button 
            type="button" 
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))} 
            className="btn btn-outline"
          >
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary">Publish</button>
        </div>
      </form>
    </div>
  );
};

export default AddCard;
