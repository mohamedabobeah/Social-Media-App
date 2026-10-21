import { useContext, useState } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { FaComment, FaShare, FaPen, FaTrashAlt } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { ImSpinner6 } from 'react-icons/im'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import type { PostType } from '../../Types/Post.type'
import type { CommentType } from '../../Types/Comment.type'
import Comment from '../Comment/Comment'
import Loader from '../Loader/Loader'
import CommentCreation from '../CommentCreation/CommentCreation'
import { AuthContext } from '../../Context/AuthContext'

export default function Post({
  post,
  isPostDetails = false,
}: {
  post: PostType
  isPostDetails?: boolean
}) {
  const { body, image, user, createdAt, topComment, _id } = post
  const { name, photo, _id: userId } = user

  const { userId: loginUserId } = useContext(AuthContext)!
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)

  const commentsQueryKey = ['getPostComments', _id]

  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    )
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: commentsQueryKey,
    queryFn: getPostComments,
    enabled: isPostDetails,
  })

  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    })
  }

  const { isPending, mutate } = useMutation<
    AxiosResponse,
    AxiosError<{ message?: string }>
  >({
    mutationFn: deletePost,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
      queryClient.invalidateQueries({ queryKey: ['getUserPosts'] })
      toast.success(res.data.message ?? 'Post deleted')
      setIsOpen(false)
      navigate('/')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? 'Failed to delete post')
    },
  })

  const comments: CommentType[] = data?.data.data.comments ?? []

  return (
    <div className="w-full max-w-150 mx-auto bg-slate-300 p-4 rounded-lg my-6">
      {/* Header */}
      <div className="flex justify-between gap-4 items-center">
        <div className="flex gap-4 items-center">
          <img
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
            src={photo}
            alt={name}
          />
          <div>
            <p className="font-bold">{name}</p>
            <p className="text-sm text-slate-500">{createdAt}</p>
          </div>
        </div>

        {loginUserId && loginUserId === userId && (
          <div className="relative">
            <HiDotsVertical
              onClick={() => setIsOpen(!isOpen)}
              className="font-bold text-2xl cursor-pointer"
            />

            {isOpen && (
              <div className="bg-white p-2 rounded-lg absolute top-[-120%] end-[-80px] shadow-2xl border-slate-400 border-2">
                <ul className="flex flex-col gap-3">
                  <li className="flex gap-2 items-center cursor-pointer bg-slate-100 p-2">
                    Edit <FaPen />
                  </li>
                  <li>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => mutate()}
                      className="flex justify-center w-full gap-2 items-center cursor-pointer bg-slate-100 p-2 disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <ImSpinner6 className="animate-spin" />
                      ) : (
                        <>
                          Delete <FaTrashAlt />
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="mb-4">{body}</p>
        {image && <img className="w-full" src={image} alt="" />}
      </div>

      {/* Actions */}
      <div className="flex p-4 justify-between bg-slate-200 rounded-sm">
        <div className="font-bold cursor-pointer flex gap-2 items-center">
          Likes
          <AiFillLike />
        </div>

        <Link to={`/postdetails/${_id}`}>
          <div className="font-bold cursor-pointer flex gap-2 items-center">
            Comments
            <FaComment />
          </div>
        </Link>

        <div className="font-bold cursor-pointer flex gap-2 items-center">
          Shares
          <FaShare />
        </div>
      </div>

      <CommentCreation
        postId={_id}
        queryKey={isPostDetails ? commentsQueryKey : ['getAllPosts']}
      />

      {/* Comments */}
      {!isPostDetails && topComment && <Comment comment={topComment} />}

      {isPostDetails && isLoading && <Loader />}

      {isPostDetails && isError && (
        <p className="text-red-600 font-bold">{(error as Error).message}</p>
      )}

      {isPostDetails &&
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
    </div>
  )
}