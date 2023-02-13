declare interface Form {
  userId: string;
  img?: string | null;
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
