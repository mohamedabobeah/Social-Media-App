import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { FaExclamationTriangle } from 'react-icons/fa'
import type { PostType } from '../../Types/Post.type'
import Post from '../../Components/Post/Post'
import PostCreation from '../../Components/PostCreation/PostCreation'
import Sidebar, { MobileShortcuts } from '../../Components/Sidebar/Sidebar'

async function getAllPosts(): Promise<PostType[]> {
  const res = await axios.get(
    `https://route-posts.routemisr.com/posts?sort=-createdAt`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    }
  )
  return res.data.data.posts
}

function PostSkeleton() {
  return (
    <div className="w-full max-w-150 mx-auto my-6 animate-pulse rounded-2xl bg-white p-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-1/4 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
      </div>
      <div className="mt-4 h-48 rounded-xl bg-slate-100" />
    </div>
  )
}

export default function Home() {
  const {
    data: allPosts,
    isLoading,
    isError,
    error,
  } = useQuery<PostType[], Error>({
    queryKey: ['getAllPosts'],
    queryFn: getAllPosts,
  })

  return (
    <>
      {/* Soft page background behind everything */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left sidebar */}
        <Sidebar />

        {/* Feed */}
        <main className="min-w-0">
          <MobileShortcuts />

          <div className="mx-auto w-full max-w-150 animate-fade-up">
            <PostCreation />

            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-indigo-600">Latest Posts</h2>
              <div className="h-0.5 flex-1 rounded bg-gradient-to-r from-indigo-300 to-transparent" />
            </div>
          </div>

          {isLoading && (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {isError && (
            <div className="mx-auto my-6 flex w-full max-w-150 items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">
              <FaExclamationTriangle className="size-5 shrink-0" />
              {error.message}
            </div>
          )}

          {allPosts?.map((post, index) => (
            <div
              key={post._id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index, 6) * 80}ms` }}
            >
              <Post post={post} isPostDetails={false} />
            </div>
          ))}
        </main>
      </div>
    </>
  )
}
