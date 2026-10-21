import type { CommentType } from './Comment.type'


export interface UserType {
  _id: string;
  name: string;
  photo: string;
}

export interface PostType {
  _id: string;
  body?: string;
  image?: string;
  user: UserType;
  createdAt: string;  
  topComment: CommentType | null;
}
