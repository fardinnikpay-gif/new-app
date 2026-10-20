import { ORDER_NUMBER_LENGTH } from "./constants";

// The order number shown in the UI is the last 8 characters of the Mongo _id.
export const getShortOrderId = (id) => String(id ?? "").slice(-ORDER_NUMBER_LENGTH);