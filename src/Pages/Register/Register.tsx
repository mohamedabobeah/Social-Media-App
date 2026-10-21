import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaUserPlus,
  FaUser,
  FaLock,
  FaCalendarAlt,
  FaMale,
  FaFemale,
} from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import {
  RegisterSchema,
  type RegisterSchemaType,
} from '../../Schemas/auth.schema'

const inputClass =
  'w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base transition-all duration-300 focus:outline-none focus:border-indigo-600 focus:bg-white focus:shadow-md focus:shadow-indigo-200'

const labelClass = 'flex items-center gap-2 mb-1 font-bold text-indigo-600'

const errorClass = 'mt-1 text-sm font-bold text-red-500 animate-fade-up'

export default function Register() {
  const navigate = useNavigate()
  const [apiError, setapiError] = useState<string | null>(null)
  const [isLoading, setisLoading] = useState(false)

  const { register, handleSubmit, formState } = useForm<RegisterSchemaType>({
    defaultValues: {
      name: '',
      email: '',
      dateOfBirth: '',
      gender: 'female',
      password: '',
      rePassword: '',
    },
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
  })

  const { errors, touchedFields } = formState

  function handleRegister(values: RegisterSchemaType) {
    setisLoading(true)
    setapiError(null)

    axios
      .post(`https://route-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message)
          navigate('/login')
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
    <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-gradient-to-br from-indigo-600 via-[#C33EF2] to-pink-500 animate-gradient">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 size-72 rounded-full bg-pink-400 opacity-40 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-indigo-300 opacity-40 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-fuchsia-400 opacity-40 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative min-h-full flex items-center justify-center px-4 py-10">
        {/* Card */}
        <div className="w-full max-w-2xl rounded-2xl border-2 border-indigo-600 bg-white/95 p-8 shadow-2xl backdrop-blur sm:p-12 animate-fade-up">
          {/* Icon + title */}
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg animate-float">
            <FaUserPlus className="size-7" />
          </div>

          <h1 className="text-center text-4xl font-bold text-indigo-600">
            Register Now
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            Create your account and join the community
          </p>

          {apiError && (
            <p className="my-4 rounded-lg bg-red-500 p-2 text-center font-bold text-white animate-fade-up">
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit(handleRegister)} className="mt-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  <FaUser className="size-4" />
                  Enter Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className={inputClass}
                />
                {errors.name && touchedFields.name && (
                  <p className={errorClass}>{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  <MdEmail className="size-5" />
                  Enter Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={inputClass}
                />
                {errors.email && touchedFields.email && (
                  <p className={errorClass}>{errors.email.message}</p>
                )}
              </div>

              {/* Date of birth */}
              <div>
                <label htmlFor="dateOfBirth" className={labelClass}>
                  <FaCalendarAlt className="size-4" />
                  Date Of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  {...register('dateOfBirth')}
                  className={inputClass}
                />
                {errors.dateOfBirth && touchedFields.dateOfBirth && (
                  <p className={errorClass}>{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <span className={labelClass}>Gender</span>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="male"
                      {...register('gender')}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-slate-50 py-3 font-bold text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:shadow-lg">
                      <FaMale className="size-5" />
                      Male
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="female"
                      {...register('gender')}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-slate-50 py-3 font-bold text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:shadow-lg">
                      <FaFemale className="size-5" />
                      Female
                    </div>
                  </label>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  <FaLock className="size-4" />
                  Enter Your Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className={inputClass}
                />
                {errors.password && touchedFields.password && (
                  <p className={errorClass}>{errors.password.message}</p>
                )}
              </div>

              {/* Re-password */}
              <div>
                <label htmlFor="rePassword" className={labelClass}>
                  <RiLockPasswordFill className="size-5" />
                  Confirm Your Password
                </label>
                <input
                  type="password"
                  id="rePassword"
                  {...register('rePassword')}
                  className={inputClass}
                />
                {errors.rePassword && touchedFields.rePassword && (
                  <p className={errorClass}>{errors.rePassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={isLoading}
              type="submit"
              className="mt-8 w-full cursor-pointer rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:from-slate-900 disabled:to-slate-900 disabled:hover:scale-100"
            >
              {isLoading ? 'Loading...' : 'Register'}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 flex justify-center">
            <Link
              to="/login"
              className="font-bold text-indigo-600 underline transition-colors duration-300 hover:text-fuchsia-500"
            >
              Already Have An Account? Go Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}