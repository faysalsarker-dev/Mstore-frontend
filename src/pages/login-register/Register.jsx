import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAxios from '../../hooks/useAxios';
import { useMutation } from "@tanstack/react-query";

const Register = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const axiosCommon = useAxios();

  // Watch the values of the form fields
  const username = watch('username');
  const password = watch('password');

  // Function to generate a random username
  const generateRandomUsername = () => `user_${Math.random().toString(36).slice(-8)}`;
  const generateRandomPassword = () => Math.random().toString(36).slice(-8);

  // Function to check if username exists
  const checkUsernameExists = async (username) => {
    try {
      const { data } = await axiosCommon.post('/check-username', { username });
      return data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  // Function to generate unique credentials
  const generateCredentials = async () => {
    setLoading(true); // Set loading to true
    try {
      let uniqueUsername = generateRandomUsername();
      while (await checkUsernameExists(uniqueUsername)) {
        uniqueUsername = generateRandomUsername();
      }
      const randomPassword = generateRandomPassword();

      // Set the unique username and password in the form
      setValue('username', uniqueUsername);
      setValue('password', randomPassword);
      toast.success('Username and Password generated!');
    } catch (error) {
      console.error('Error generating credentials:', error);
      toast.error('Failed to generate credentials.');
    } finally {
      setLoading(false); // Set loading to false after operation completes
    }
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosCommon.post('register', info);
      return data;
    },
    onSuccess: () => {
      toast.success('Register successful');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Registration failed.');
    },
  });

  const onSubmit = (data) => {
    const info = {
      ...data,
      createAt: Date.now(),
      status: 'active',
      balance: 0,
    };
    mutateAsync(info);
  };

  const copyToClipboard = () => {
    const textToCopy = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success('Username and Password copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy text:', err);
    });
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
              {showPassword ? (
                // Eye Icon for Visible Password
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                // Eye Icon for Hidden Password
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>

          {/* Generate and Copy Credentials Buttons */}
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={generateCredentials}
              className="btn btn-outline btn-primary"
              disabled={loading} // Disable button if loading
            >
              {loading ? 'Generating...' : 'Generate Username & Password'}
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="btn btn-outline flex items-center"
              aria-label="Copy Username and Password"
              disabled={loading} // Disable button if loading
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .552-.448 1-1 1s-1-.448-1-1c0-.231.035-.454.1-.664M15 6.75h-3M15 9.75h-3M6.75 6v3M9 18.75H6.75A2.25 2.25 0 0 1 4.5 16.5V8.25C4.5 6.68 5.68 5.25 7.25 5.25H15m0 13.5v.75M9 3h3m4.125 0c.303 0 .598.03.875.086m1.3-.111C17.1 2.456 15.942 2.25 14.25 2.25c-1.69 0-2.849.206-3.928.725M4.5 8.25v5.25c0 1.493 1.007 2.595 2.25 2.595M18 9h3" />
              </svg>
              Copy
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading} // Disable submit button if loading
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
