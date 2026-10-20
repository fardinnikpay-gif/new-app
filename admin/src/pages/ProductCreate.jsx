import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { createProduct } from "../api/productApi";
import PageHeader from "../components/common/PageHeader";
import ProductForm from "../components/products/ProductForm";
import Button from "../components/ui/Button";

export default function ProductCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      return await createProduct(formData);
    } catch (error) {
      setSubmitting(false); // on success it stays true until we navigate away
      throw error;
    }
  };

  const handleSaved = () => {
    toast.success("Product created");
    navigate("/products");
  };

  return (
    <>
      <PageHeader
        title="New product"
        actions={
          <Button as={Link} to="/products" variant="outline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to products
          </Button>
        }
      />
      <ProductForm submitting={submitting} onSubmit={handleSubmit} onSaved={handleSaved} />
    </>
  );
}