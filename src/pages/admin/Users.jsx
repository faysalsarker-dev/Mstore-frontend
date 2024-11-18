import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const Users = () => {
  const axiosCommon = useAxios();

  // Use useQuery to fetch data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['all-user'],
    queryFn: async () => {
      const { data } = await axiosCommon.get('/users');
      return data;
    },
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* Table Head */}
          <thead className="bg-base-200">
            <tr>
              <th>Name</th>
              <th>status</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              // Map over the user data
              data.data.map((user) => (
                <tr key={user.username} className="hover:bg-base-200">
                  <td>
                    <div className="flex items-center gap-3">
           
                      <div>
                        <div className="font-bold">{user.username}</div>
                        <div className="text-sm opacity-50">{new Date(user.createAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                  <div className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'} gap-2  text-white`}>
  {user.status === 'active' ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )}
  {user.status}
</div>

                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">{user.balance}</span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-xs">Details</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
