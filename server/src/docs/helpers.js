export const ref = (name) => ({ $ref: `#/components/schemas/${name}` });

const ERROR_TEXT = {
  400: "Validation failed or a business rule was violated",
  401: "Not logged in (missing or invalid cookie)",
  403: "Logged in but not allowed",
  404: "Resource not found",
  409: "Duplicate value or conflicting change",
  429: "Too many requests",
  502: "Payment provider or image service error",
};

const ACCESS_TEXT = {
  public: "Access: public",
  protect: "Access: any logged-in user",
  admin: "Access: admin only",
};
const AUTH_ERRORS = { public: [], protect: [401], admin: [401, 403] };

export const json = (schema, example) => ({
  required: true,
  content: { "application/json": { schema, ...(example && { example }) } },
});

export const multipart = (schema) => ({
  required: true,
  content: { "multipart/form-data": { schema } },
});

export const ok = (description, data = {}, message = "OK") => ({
  description,
  content: { "application/json": { example: { success: true, message, data } } },
});

export const pathParam = (name = "id", description = "MongoDB ObjectId") => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "string" },
});

export const queryParam = (name, description, schema = { type: "string" }) => ({
  name,
  in: "query",
  description,
  schema,
});

const errorResponses = (codes) =>
  Object.fromEntries(
    [...new Set(codes)].sort().map((code) => [
      String(code),
      {
        description: ERROR_TEXT[code],
        content: { "application/json": { schema: ref("Error") } },
      },
    ])
  );

// One place builds every operation, so access text, security and error shapes stay consistent
export const op = ({ tag, summary, auth = "public", params, body, status = 200, response, errors = [] }) => ({
  tags: [tag],
  summary,
  description: ACCESS_TEXT[auth],
  ...(auth !== "public" && { security: [{ cookieAuth: [] }] }),
  ...(params && { parameters: params }),
  ...(body && { requestBody: body }),
  responses: { [status]: response, ...errorResponses([...AUTH_ERRORS[auth], ...errors]) },
});