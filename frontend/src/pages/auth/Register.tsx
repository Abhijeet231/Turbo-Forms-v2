import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../../validations/auth.schema";
import {
  login,
  register as registerUser,
} from "../../services/auth.service.ts";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const result = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        profileImageUrl: data.profileImage?.[0],
      });

      await login({ email: data.email, password: data.password });

      toast.success("User Registered Successfully.");
      console.log("Registered User:", result.data);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Registration Error");
      console.error("User Registration Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#cbb89a]">Create account</h2>
          <p className="text-sm text-neutral-500 mt-1">Fill in your details below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm text-neutral-400">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#cbb89a] transition-colors"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-neutral-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#cbb89a] transition-colors"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm text-neutral-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#cbb89a] transition-colors"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Profile Image */}
          <div className="space-y-1.5">
            <label htmlFor="img" className="block text-sm text-neutral-400">
              Profile Image{" "}
              <span className="text-neutral-600 text-xs">(optional)</span>
            </label>
            <input
              type="file"
              id="img"
              accept="image/*"
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-md px-3 py-2 text-sm
                file:mr-3 file:bg-neutral-800 file:text-[#cbb89a] file:border-0 
                file:rounded file:px-2.5 file:py-1 file:text-xs file:cursor-pointer
                cursor-pointer outline-none focus:border-[#cbb89a] transition-colors"
              {...register("profileImage")}
            />
            {errors.profileImage && (
              <p className="text-red-400 text-xs">
                {errors.profileImage.message as string}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#cbb89a] hover:bg-[#a89474] text-black font-medium text-sm rounded-md py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-neutral-600 pt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-[#cbb89a] hover:underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;