import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { loginSchema, type LoginSchemaType } from "../../validations/auth.schema";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      })
      navigate("/dashboard")
    } catch (error) {
      // toast is already handled inside context login
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#cbb89a]">Welcome back</h2>
          <p className="text-sm text-neutral-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
              placeholder="Your password"
              className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#cbb89a] transition-colors"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#cbb89a] hover:bg-[#a89474] text-black font-medium text-sm rounded-md py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-neutral-600 pt-1">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#cbb89a] hover:underline">
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login