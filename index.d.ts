declare interface Form {
  userId: string;
  img: string[] | null;
  title: string;
  type: string;
  ingredient: string;
  recipe: string;
  text: string;
  like: string[];
  view: number;
}

declare interface CommentType {
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
  id?: string;
  isEdit: boolean;
}

declare interface UserType {
  userId: string;
  email: string;
  nickname: string;
  imageURL: string;
  introduce: string;
  rank: string;
  point: number;
  following: string[];
  follower: string[];
}

declare interface ModalType {
  setIsOpenProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
  myProfile: any;
}
