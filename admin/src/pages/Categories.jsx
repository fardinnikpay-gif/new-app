import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import toast from "react-hot-toast";
import { getCategories } from "../api/categoryApi";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryImageModal from "../components/categories/CategoryImageModal";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Skeleton from "../components/ui/Skeleton";
import useAsync from "../hooks/useAsync";
import { sortCategories } from "../utils/category";
import { CATEGORIES } from "../utils/constants";

export default function Categories() {
  const { data, loading, error, reload } = useAsync(getCategories, []);
  const [editing, setEditing] = useState({ open: false, category: null });
  const categories = useMemo(() => sortCategories(data ?? []), [data]);

  const openEditor = (category) => setEditing({ open: true, category });
  const closeEditor = () => setEditing((prev) => ({ ...prev, open: false }));

  const handleSaved = () => {
    toast.success("Category image updated");
    closeEditor();
    reload(); // the server is the source of truth for the new image URL
  };

  let content;
  if (error) {
    content = (
      <ErrorState title="Could not load categories" message={error.message} onRetry={reload} />
    );
  } else if (loading && !data) {
    content = (
      <div role="status" aria-label="Loading" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((key) => (
          <Skeleton key={key} className="h-64" />
        ))}
      </div>
    );
  } else if (categories.length === 0) {
    content = (
      <EmptyState
        icon={ImageOff}
        title="No categories found"
        message="Categories are created on the server (men, women, kids)."
      />
    );
  } else {
    content = (
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} onChangeImage={openEditor} />
        ))}
      </ul>
    );
  }

  return (
    <>
      <PageHeader title="Categories" subtitle="Change the image shown for each category" />
      {content}
      <CategoryImageModal
        category={editing.category}
        open={editing.open}
        onClose={closeEditor}
        onSaved={handleSaved}
      />
    </>
  );
}