import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema validation for signup
const signupSchema = z.object({
  firstName: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  emailId: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Signup successful ✅");
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-gray-900">

      <div className="card w-96 bg-gray-900 shadow-xl p-6 border border-gray-700 rounded-2xl">
        
        {/* Title */}
        <h1 className="text-center text-3xl font-bold mb-2 text-white">Leetcode</h1>
        <h2 className="text-center text-xl font-semibold mb-6 text-gray-300">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <input 
              {...register("firstName")} 
              placeholder="First Name" 
              className="input input-bordered w-full bg-gray-800 text-white border-gray-700" 
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input 
              {...register("emailId")} 
              placeholder="Email" 
              className="input input-bordered w-full bg-gray-800 text-white border-gray-700" 
            />
            {errors.emailId && (
              <p className="text-red-500 text-sm">{errors.emailId.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="input input-bordered w-full bg-gray-800 text-white border-gray-700" 
            />
            <button 
              type="button" 
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-500 text-white">Sign Up</button>
        </form>
        
      </div>
    </div>
  );
}

export default Signup;














