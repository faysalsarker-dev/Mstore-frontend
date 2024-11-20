
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios';
import { useParams } from 'react-router-dom';


const SingleUser = () => {
  const { id } = useParams();
  const axiosCommon = useAxios();


  // Fetch single user
  const { data: user, isLoading, isError,refetch } = useQuery({
    queryKey: ['single-user', id],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/single-user/${id}`);
    
      return data;
    },
  });

  // Form handling
  const { register, handleSubmit } = useForm({
    defaultValues: {
      status: user?.status || 'active',
      balance: user?.balance || 0,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axiosCommon.patch(`/update-user${user._id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: 'Updated!',
        text: 'User updated successfully',
        icon: 'success',
      });
      refetch()
    },
    onError: () => {
      Swal.fire('Error', 'Something went wrong!', 'error');
    },
  });

  const onSubmit = (data) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        mutateAsync(data);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center ">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading user data.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4 md:px-0">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Update User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Name - Disabled */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">User Name</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Created At - Disabled */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Created At</label>
            <input
              type="text"
              value={new Date(user.createAt).toLocaleDateString()}
              disabled
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Status - Editable */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
             defaultValue={user?.status | 'deactive'}
              {...register('status')}
              className="select select-bordered w-full"
            >
              <option  value="active" >
                Active
              </option>
              <option value="deactive">
                Deactive
              </option>
            </select>
          </div>

          {/* Balance - Editable */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Balance</label>
            <input
              type="number"
              {...register('balance', { valueAsNumber: true })}
              className="input input-bordered w-full"
              defaultValue={user.balance}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button type="submit" className="btn btn-primary w-full">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SingleUser;
