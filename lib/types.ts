export type Design = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  likeCount: number;
  createdAt: number;
};

export type Comment = {
  id: string;
  name: string;
  text: string;
  createdAt: number;
};

export type Review = {
  id: string;
  name: string;
  message: string;
  createdAt: number;
};
