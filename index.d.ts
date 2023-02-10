declare interface Form {
  userId: string;
  img?: string | null;
  title: string;
  type: string;
  ingredient: string;
  recipe: string;
  text: string;
  like: string[];
  liked: string[];
  view: number;
}
