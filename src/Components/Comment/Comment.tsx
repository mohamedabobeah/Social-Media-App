import type { CommentType } from '../../Types/Comment.type'

export default function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className="my-3 p-4 rounded-sm bg-slate-100">
      <div className="flex gap-4 items-center">
        <img
          className="w-10 h-10 rounded-full border-2 border-white object-cover"
          src={comment?.commentCreator.photo}
          alt={comment?.commentCreator.name}
        />

        <div>
          <p className="font-bold">{comment?.commentCreator.name}</p>
          <p className="text-sm text-slate-500">{comment?.createdAt}</p>
        </div>
      </div>

      <p className="px-4">{comment?.content}</p> 
      {comment.image && <img className="w-full mt-2" src={comment.image} alt="" />}
    </div>
  )
}