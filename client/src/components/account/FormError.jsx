export default function FormError({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
    >
      {message}
    </p>
  );
}