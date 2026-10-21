import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { IconType } from 'react-icons'
import {
  FaUser,
  FaUserFriends,
  FaUserPlus,
  FaVenusMars,
  FaBirthdayCake,
  FaImages,
  FaVideo,
  FaPlus,
  FaCamera,
  FaHeart,
  FaPlane,
  FaMusic,
  FaUtensils,
  FaRegNewspaper,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Loader from '../../Components/Loader/Loader'
import Post from '../../Components/Post/Post'
import type { UserType } from '../../Types/ProfileUser.type'
import type { PostType } from '../../Types/Post.type'

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('userToken')}`,
})

async function getProfile(): Promise<UserType> {
  const res = await axios.get(
    'https://route-posts.routemisr.com/users/profile-data',
    { headers: authHeaders() }
  )
  return res.data.data.user
}

async function getUserPosts(userId: string): Promise<PostType[]> {
  const res = await axios.get(
    `https://route-posts.routemisr.com/users/${userId}/posts`,
    { headers: authHeaders() }
  )
  return res.data.data.posts
}

/* ---------- Design-only data (placeholders) ---------- */

type Stat = { label: string; value: string; icon: IconType }

const stats: Stat[] = [
  { label: 'Followers', value: '100k', icon: FaUserFriends },
  { label: 'Pictures', value: '248', icon: FaImages },
  { label: 'Videos', value: '36', icon: FaVideo },
]

type Story = { label: string; icon: IconType }

const stories: Story[] = [
  { label: 'New', icon: FaPlus },
  { label: 'Moments', icon: FaCamera },
  { label: 'Favorites', icon: FaHeart },
  { label: 'Travel', icon: FaPlane },
  { label: 'Music', icon: FaMusic },
  { label: 'Food', icon: FaUtensils },
]

/* ---------- Page ---------- */

export default function Profile() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserType, Error>({
    queryKey: ['getProfile'],
    queryFn: getProfile,
  })

  const { data: posts = [], isLoading: loadingPosts } = useQuery<PostType[], Error>({
    queryKey: ['getUserPosts', user?._id],
    queryFn: () => getUserPosts(user!._id),
    enabled: !!user?._id,
  })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div className="mx-auto my-6 flex w-full max-w-175 items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">
        <FaExclamationTriangle className="size-5 shrink-0" />
        {error.message}
      </div>
    )
  }

  if (!user) return null

  const infoRows = [
    { icon: FaUser, label: 'UserName', value: user.username },
    { icon: FaVenusMars, label: 'Gender', value: user.gender },
    { icon: MdEmail, label: 'Email', value: user.email },
    { icon: FaBirthdayCake, label: 'BirthDay', value: user.dateOfBirth.split('T')[0] },
  ]

  return (
    <>
      {/* Soft page background behind everything */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50" />

      <div className="mx-auto w-full max-w-175 animate-fade-up">
        {/* ---------- Personal information ---------- */}
        <div className="overflow-hidden rounded-2xl border-2 border-indigo-600 bg-white shadow-2xl shadow-indigo-200">
          {/* Gradient banner */}
          <div className="h-20 bg-gradient-to-r from-indigo-600 via-[#C33EF2] to-pink-500" />

          <div className="flex flex-col items-center justify-between gap-6 p-5 sm:flex-row">
            {/* Photo + name */}
            <div className="-mt-14 flex flex-col items-center sm:-mt-12">
              <img
                src={user.photo}
                alt={user.name}
                className="size-24 rounded-full border-4 border-white object-cover shadow-xl ring-4 ring-indigo-200 transition-transform duration-300 hover:scale-105"
              />
              <h1 className="mt-2 text-xl font-bold text-indigo-600">{user.name}</h1>
            </div>

            {/* Info list */}
            <ul className="flex flex-col gap-2.5 sm:items-start">
              {infoRows.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Icon className="size-3.5" />
                  </span>
                  <p>
                    <span className="font-bold">{label}:</span> {value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl bg-white py-4 shadow-lg shadow-indigo-100">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <div
              key={label}
              className="animate-fade-up flex flex-col items-center gap-1 transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <div className="flex items-center gap-2 text-indigo-600">
                <Icon className="size-6" />
                <span className="text-2xl font-bold text-slate-800">{value}</span>
              </div>
              <span className="text-sm font-medium text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        {/* ---------- Follow button ---------- */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="flex w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-300 transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl active:scale-95"
          >
            <FaUserPlus className="size-5" />
            Follow
          </button>
        </div>

        {/* ---------- Stories ---------- */}
        <div className="mt-8">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-slate-400">
            Stories
          </h2>

          <div className="flex justify-between gap-4 overflow-x-auto px-2 pb-2">
            {stories.map(({ label, icon: Icon }, index) => (
              <button
                key={label}
                type="button"
                className="group flex shrink-0 cursor-pointer flex-col items-center gap-2 animate-fade-up"
                style={{ animationDelay: `${300 + index * 80}ms` }}
              >
                <span className="rounded-full bg-gradient-to-tr from-indigo-600 via-[#C33EF2] to-pink-500 p-0.75 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <span className="flex size-14 items-center justify-center rounded-full border-2 border-white bg-white text-indigo-600 sm:size-16">
                    <Icon className="size-5 sm:size-6" />
                  </span>
                </span>
                <span className="text-xs font-semibold text-slate-600 transition-colors group-hover:text-indigo-600">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Posts heading ---------- */}
        <div className="mt-10 flex items-center gap-3">
          <h2 className="text-lg font-bold text-indigo-600">My Posts</h2>
          <div className="h-0.5 flex-1 rounded bg-gradient-to-r from-indigo-300 to-transparent" />
        </div>
      </div>

      {loadingPosts && <Loader />}

      {!loadingPosts && posts.length === 0 && (
        <div className="mx-auto mt-6 flex w-full max-w-175 flex-col items-center gap-2 rounded-2xl bg-white p-8 text-slate-400 shadow-md">
          <FaRegNewspaper className="size-10" />
          <p className="font-semibold">No posts yet</p>
        </div>
      )}

      {posts.map((post, index) => (
        <div
          key={post._id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 6) * 80}ms` }}
        >
          <Post post={post} />
        </div>
      ))}
    </>
  )
}
