import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { LoginSchema, type LoginSchemaType } from '../../Schemas/auth.schema'
import { AuthContext } from '../../Context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [apiError, setapiError] = useState<string | null>(null)
  const [isLoading, setisLoading] = useState(false)

  const { setuserLogin } = useContext(AuthContext)!

  const { register, handleSubmit, formState } = useForm<LoginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
  })

  function handleLogin(values: LoginSchemaType) {
    setisLoading(true)

    axios
      .post(`https://route-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message)
          localStorage.setItem('userToken', res.data.data.token)
          setuserLogin(res.data.data.token)
          navigate('/')
        }
      })
      .catch((err) => {
        setapiError(err.response?.data?.message ?? 'Something went wrong')
      })
      .finally(() => {
        setisLoading(false)
      })
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-gradient-to-br from-[#C33EF2] via-fuchsia-500 to-indigo-500">
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        {/* Card */}
        <div className="w-full max-w-2xl bg-white rounded-2xl border-2 border-indigo-600 shadow-2xl p-8 sm:p-12 animate-fade-up">
          {/* Person icon + title */}
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg animate-float">
            <FaUser className="size-7" />
          </div>

          <h1 className="text-center text-4xl font-bold text-indigo-600">
            Login Now
          </h1>

          {apiError && (
            <p className="bg-red-500 text-white text-center my-4 font-bold p-2 rounded-lg animate-fade-up">
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="mt-8">
            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="flex items-center gap-2 mb-1 font-bold text-indigo-600"
              >
                <MdEmail className="size-5" />
                Enter Your Email
              </label>

              <input
                type="email"
                id="email"
                {...register('email')}
                className="w-full bg-transparent border-b-2 border-slate-300 py-3 text-base transition-colors duration-300 focus:outline-none focus:border-indigo-600"
              />

              {formState.errors.email && formState.touchedFields.email && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="flex items-center gap-2 mb-1 font-bold text-indigo-600"
              >
                <FaLock className="size-4" />
                Enter Your Password
              </label>

              <input
                type="password"
                id="password"
                {...register('password')}
                className="w-full bg-transparent border-b-2 border-slate-300 py-3 text-base transition-colors duration-300 focus:outline-none focus:border-indigo-600"
              />

              {formState.errors.password && formState.touchedFields.password && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 disabled:from-slate-900 disabled:to-slate-900 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>

          {/* Social sign up */}
          <p className="mt-6 text-center text-sm text-slate-500">Or Sign Up Using</p>

          <div className="mt-4 flex justify-center gap-4">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-[#3b5998] text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
            >
              <FaFacebookF />
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-sky-400 text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
            >
              <FaTwitter />
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
            >
              <FaGoogle />
            </button>
          </div>

          {/* Register link */}
          <div className="mt-6 flex justify-center">
            <Link
              to="/register"
              className="font-bold text-indigo-600 underline transition-colors duration-300 hover:text-fuchsia-500"
            >
              Don't You Have An Account? Go Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}