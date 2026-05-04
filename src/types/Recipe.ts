export interface Recipe {
  _id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  favorite: boolean;
}