import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const axiosCommon = useAxios();
  const { createUser } = useAuth();

  // Watch form values
  const username = watch('username');
  const password = watch('password');

  // Generate random credentials
  const generateRandomUsername = () => `${Math.random().toString(36).slice(-8)}@gmail.com`;
  const generateRandomPassword = () => Math.random().toString(36).slice(-8);

  const checkUsernameExists = async (username) => {
    try {
      const { data } = await axiosCommon.post('/check-username', { username });
      return data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const generateCredentials = async () => {
    setLoadingGenerate(true);
    try {
      let uniqueUsername = generateRandomUsername();
      while (await checkUsernameExists(uniqueUsername)) {
        uniqueUsername = generateRandomUsername();
      }
      const randomPassword = generateRandomPassword();
      setValue('username', uniqueUsername);
      setValue('password', randomPassword);
    } catch (error) {
      console.error('Error generating credentials:', error);
      toast.error('Failed to generate credentials.');
    } finally {
      setLoadingGenerate(false);
    }
  };

  const onSubmit = async (data) => {
    setLoadingRegister(true);
    try {
      await createUser(data.username, data.password);
      toast.success('User registered successfully!');
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed.');
    } finally {
      setLoadingRegister(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success('Username and Password copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text:', err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="input input-bordered w-full"
              placeholder="Enter username"
              readOnly
            />
          </div>

          <div className="relative">
            <label className="block mb-1 font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="input input-bordered w-full"
              placeholder="Enter password"
              readOnly
            />
            <button
              type="button"
              className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
                  {/* Eye Icon */}
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
                  {/* Eye-Off Icon */}
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={generateCredentials}
              className="btn btn-outline btn-primary"
              disabled={loadingGenerate}
            >
              {loadingGenerate ? 'Generating...' : 'Generate Username & Password'}
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="btn btn-outline flex items-center"
              aria-label="Copy Username and Password"
              disabled={!username || !password}
            >
              Copy
            </button>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loadingRegister}
            >
              {loadingRegister ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
