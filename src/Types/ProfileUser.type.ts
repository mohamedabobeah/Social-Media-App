export interface UserType {
  bookmarks: string[];          // or whatever type the bookmark items actually are
  bookmarksCount: number;
  cover: string;
  createdAt: string;            // ISO 8601 date string
  dateOfBirth: string;          // ISO 8601 date string
  email: string;
  followers: string[];          // or User[] / string[] depending on your backend
  followersCount: number;
  following: string[];          // same as above
  followingCount: number;
  gender: "male" | "female" | "other" | string;
  id: string;
  name: string;
  photo: string;
  username: string;
  _id: string;
}