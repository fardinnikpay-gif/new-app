import { useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { deleteProduct, getAdminProducts } from "../api/productApi"
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import ProductFilters from "../components/products/ProductFilters";
import ProductsTable from "../components/products/ProductsTable";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import useAsync from "../hooks/useAsync";
import useConfirmDelete from "../hooks/useConfirmDelete";
import usePagedQuery from "../hooks/usePagedQuery";
import useToggleProduct from "../hooks/useToggleProduct";
import { PAGE_SIZE } from "../utils/constants";

const INITIAL_QUERY = { search: "", category: "", status: "" };
const FIRST_PAGE = 1;

export default function Products() {
  const { params, setPage, setSearch, setFilter, reset } = usePagedQuery(INITIAL_QUERY);
  const query = useMemo(() => ({ ...params, limit: PAGE_SIZE }), [params]);
  const { data, loading, error, reload, setData } = useAsync(
    (signal) => getAdminProducts(query, signal),
    [query]
  );
  const { pendingIds, toggle } = useToggleProduct(setData);

  const page = params.page;
  const products = data?.products ?? [];
  const hasFilters = Boolean(params.search || params.category || params.status);

  // Deleting the last row of a page (other than page 1) goes back one page; otherwise refetch.
  const handleDeleted = useCallback(() => {
    if (products.length === 1 && page > FIRST_PAGE) setPage(page - 1);
    else reload();
  }, [products.length, page, setPage, reload]);

  const deletion = useConfirmDelete(deleteProduct, {
    successMessage: "Product deleted",
    onDeleted: handleDeleted,
  });

  // The URL can point past the last page (e.g. ?page=99): jump to the real last page.
  useEffect(() => {
    if (loading || !data) return;
    if (data.products.length === 0 && data.total > 0 && page > FIRST_PAGE) {
      setPage(Math.max(data.pages, FIRST_PAGE));
    }
  }, [loading, data, page, setPage]);

  const emptyState = hasFilters ? (
    <EmptyState
      title="No products match your filters"
      message="Try a different search or clear the filters."
      action={
        <Button variant="outline" onClick={reset}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      title="No products yet"
      message="Add your first product to get started."
      action={
        <Button as={Link} to="/products/new">
          Add product
        </Button>
      }
    />
  );

  return (
    <>
      <PageHeader
        title="Products"
        actions={
          <Button as={Link} to="/products/new">
            <Plus className="size-4" aria-hidden="true" />
            Add product
          </Button>
        }
      />

      <ProductFilters params={params} onSearch={setSearch} onFilter={setFilter} />

      {error ? (
        <ErrorState title="Could not load products" message={error.message} onRetry={reload} />
      ) : (
        <>
          <ProductsTable
            products={products}
            loading={loading}
            pendingIds={pendingIds}
            onToggle={toggle}
            onDelete={deletion.askDelete}
            emptyState={emptyState}
          />
          {data && <Pagination page={page} pages={data.pages} total={data.total} onChange={setPage} />}
        </>
      )}

      <ConfirmDialog
        open={deletion.open}
        title="Delete product?"
        message={`"${deletion.target?.title ?? "This product"}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={deletion.confirm}
        onClose={deletion.cancel}
        loading={deletion.deleting}
      />
    </>
  );
}