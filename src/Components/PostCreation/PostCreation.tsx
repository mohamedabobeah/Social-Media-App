import { useRef, useState, type ChangeEvent } from 'react'
import axios , { type AxiosError, type AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa'
import { FaImage } from 'react-icons/fa6'
import { IoMdCloseCircle } from 'react-icons/io'
import { ImSpinner11 } from 'react-icons/im'
import toast from 'react-hot-toast'
export default function PostCreation() {
  const [previewUrl, setPreviewUrl] = useState('')

  const textInput = useRef<HTMLTextAreaElement>(null)
  const imgInput = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient()

  function createPost(formData: FormData) {
    return axios.post('https://route-posts.routemisr.com/posts', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    })
  }

  function clearForm() {
    if (textInput.current) textInput.current.value = ''
    if (imgInput.current) imgInput.current.value = ''
    setPreviewUrl('')
  }
const { isPending, mutate } = useMutation<
  AxiosResponse,
  AxiosError<{ message?: string }>,
  FormData
>({
  mutationFn: createPost,
  onSuccess: (res) => {
    toast.success(res.data.message ?? 'Post created')
    queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
    clearForm()
  },
  onError: (err) => {
    toast.error(err.response?.data?.message ?? 'Failed to create post')
    console.error('Failed to create post:', err)
  },
})

  function handleCreatePost() {
    const text = textInput.current?.value.trim() ?? ''
    const file = imgInput.current?.files?.[0]

    if (!text && !file) return

    const formData = new FormData()

    if (text) formData.append('body', text)
    if (file) formData.append('image', file)

    mutate(formData)
  }

  function handleImagePreview(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
  }

  function removeImage() {
    if (imgInput.current) imgInput.current.value = ''
    setPreviewUrl('')
  }

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white rounded-lg shadow-md p-4 my-6">
      {/* Top: avatar + text input */}
      <div className="flex gap-3 items-start">
        <FaUserCircle className="size-10 text-slate-400 shrink-0" />

        <textarea
          ref={textInput}
          rows={3}
          placeholder="What's on your mind?"
          className="w-full resize-none rounded-lg bg-slate-100 p-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Image preview */}
      {previewUrl && (
        <div className="relative">
          <img className="my-4 w-full rounded-lg" src={previewUrl} alt="" />
          <IoMdCloseCircle
            onClick={removeImage}
            className="absolute top-[10px] end-[10px] size-8 cursor-pointer text-white drop-shadow"
          />
        </div>
      )}

      <hr className="my-4 border-slate-200" />

      {/* Bottom: image input + post button */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition">
          <FaImage className="size-5" />
          Photo
          <input
            ref={imgInput}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImagePreview}
          />
        </label>

        <button
          type="button"
          disabled={isPending}
          onClick={handleCreatePost}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-900 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {isPending ? (
            <ImSpinner11 className="animate-spin" />
          ) : (
            <>
              Post
              <FaPaperPlane />
            </>
          )}
        </button>
      </div>
    </div>
  )
}