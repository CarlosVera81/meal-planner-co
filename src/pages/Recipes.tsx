import { RecipeLibrary } from '@/components/recipes/RecipeLibrary';

const Recipes = () => {
  return (
    <div className="p-6">
      <RecipeLibrary showAddButton={false} />
    </div>
  );
};

export default Recipes;