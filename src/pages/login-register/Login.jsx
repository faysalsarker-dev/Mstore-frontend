import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


const Login = () => {
  const { register, handleSubmit,  } = useForm();
  const [showPassword, setShowPassword] = useState(false);



  const onSubmit = (data) => {
    console.log('Form Data:', data);
    toast.apply(data.username,data.password)
  
  };




  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <input
              type="text"
              {...register('username', { required: true })}
              className="input input-bordered w-full"
              placeholder="Enter username"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: true })}
              className="input input-bordered w-full"
              placeholder="Enter password"
            />
            {/* Toggle Button for Password Visibility */}
            <button
              type="button"
              className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
 : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
</svg>
}
            </button>
          </div>

   
       

          {/* Submit Button */}
          <div>
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
