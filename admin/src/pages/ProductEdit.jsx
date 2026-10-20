import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PackageX } from "lucide-react";
import toast from "react-hot-toast";
import { getAdminProduct, updateProduct } from "../api/productApi";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import ProductFormSkeleton from "../components/products/ProductFormSkeleton";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import useAsync from "../hooks/useAsync";

// 400 is included because an invalid ObjectId usually fails as a cast error.
const NOT_FOUND_STATUSES = [404, 400];

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    data: product,
    loading,
    error,
    reload,
  } = useAsync((signal) => getAdminProduct(id, signal), [id]);

  // While another id is loading, `product` is still the previous one.
  const isCurrent = product?._id === id;

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      return await updateProduct(id, formData);
    } catch (submitError) {
      setSubmitting(false); // on success it stays true until we navigate away
      throw submitError;
    }
  };

  const handleSaved = () => {
    toast.success("Product updated");
    navigate("/products");
  };

  let content = <ProductFormSkeleton />;
  if (isCurrent) {
    content = (
      <ProductForm
        key={product._id}
        initialData={product}
        submitting={submitting}
        onSubmit={handleSubmit}
        onSaved={handleSaved}
      />
    );
  } else if (error && NOT_FOUND_STATUSES.includes(error.status)) {
    content = (
      <EmptyState
        icon={PackageX}
        title="Product not found"
        message="It may have been deleted, or the link is wrong."
        action={
          <Button as={Link} to="/products">
            Back to products
          </Button>
        }
      />
    );
  } else if (error && !loading) {
    content = (
      <ErrorState title="Could not load the product" message={error.message} onRetry={reload} />
    );
  }

  return (
    <>
      <PageHeader
        title="Edit product"
        subtitle={isCurrent ? product.title : undefined}
        actions={
          <Button as={Link} to="/products" variant="outline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to products
          </Button>
        }
      />
      {content}
    </>
  );
}