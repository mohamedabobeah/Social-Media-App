import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Loader from '../../Components/Loader/Loader'
import Post from '../../Components/Post/Post'

export default function PostDetails() {
  const { id } = useParams()

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getPostDetails,
  })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <p>{(error as Error).message}</p>
  }

  const post = data?.data.data.post

  return <>{post && <Post post={post} isPostDetails={true} />}</>
}