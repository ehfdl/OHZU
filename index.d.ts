declare interface Form {
  userId?: string;
  img?: string[] | null;
  title?: string;
  type?: string;
  ingredient?: string;
  recipe?: string;
  text?: string;
  like?: string[];
  view?: number;
  createdAt?: string;
  id?: string;
}
declare interface WriteForm {
  userId?: string;
  img?: string[] | null;
  title?: string;
  type?: string;
  ingredient?: string[];
  recipe?: string;
  text?: string;
  like?: string[];
  view?: number;
  createdAt?: string;
  id?: string;
}
declare interface PostType extends Form {
  postId?: string;
}

declare interface CommentType {
  content: string;
  postId?: string;
  userId: string;
  createdAt: string;
  id?: string;
  isEdit: boolean;
  commentId?: string;
}

declare interface UserType {
  userId?: string;
  email?: string;
  nickname?: string;
  imageURL?: string;
  introduce?: string;
  point?: number;
  following?: string[];
  follower?: string[];
  recently?: string[];
}

declare interface ModalType {
  setIsOpenProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
  myProfile: any;
}

declare interface AlarmType {
  content?: string;
  postId?: string;
  nickname?: string;
  createdAt?: string;
  title?: string;
  isDone?: boolean;
}

declare interface ReportPost extends PostType {
  reporter?: string[];
}

declare interface ReportComment {
  commentId?: string;
  postId?: string;
  content?: string;
  reporter?: string[];
}
