import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCommentAlt } from 'react-icons/fa'
import { FaImage } from 'react-icons/fa6'
import { ImSpinner2 } from 'react-icons/im'

type CommentFormValues = {
  content: string
  image: FileList
}

export default function CommentCreation({
  postId,
  queryKey,
}: {
  postId: string
  queryKey: string[]
}) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: {
      content: '',
    },
  })

  function createComment(formData: FormData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    )
  }

  const { isPending, mutate } = useMutation<
    AxiosResponse,
    AxiosError<{ message?: string }>,
    FormData
  >({
    mutationFn: createComment,
    onSuccess: (res) => {
      toast.success(res.data.message ?? 'Comment added')
      queryClient.invalidateQueries({ queryKey })
      reset()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? 'Failed to add comment')
      console.error('Failed to create comment:', err)
    },
  })

  function handleCreateComment(values: CommentFormValues) {
    const file = values.image?.[0]

    if (!values.content.trim() && !file) return

    const formData = new FormData()

    if (values.content.trim()) {
      formData.append('content', values.content)
    }

    if (file) {
      formData.append('image', file)
    }

    mutate(formData)
  }

  return (
    <div className="bg-white p-3 my-4">
      <form
        className="max-w-md mx-auto"
        onSubmit={handleSubmit(handleCreateComment)}
      >
        <div className="relative">
          <input
            {...register('content')}
            type="text"
            className="block w-full p-3 ps-9 rounded-lg border border-slate-300 text-sm shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Write a comment..."
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute cursor-pointer disabled:bg-slate-900 disabled:cursor-not-allowed top-1/2 end-2.5 -translate-y-1/2 text-white bg-indigo-600 hover:bg-indigo-700 rounded text-xs px-3 py-1.5 focus:outline-none"
          >
            {isPending ? (
              <ImSpinner2 className="animate-spin" />
            ) : (
              <FaCommentAlt />
            )}
          </button>
        </div>

        <label className="my-2 p-2 bg-indigo-500 hover:bg-indigo-300 cursor-pointer flex justify-center text-white rounded">
          <FaImage className="size-5" />
          <input type="file" accept="image/*" hidden {...register('image')} />
        </label>
      </form>
    </div>
  )
}
