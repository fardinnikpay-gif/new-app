import "dotenv/config";

const NODE_ENVS = ["development", "test", "production"];

/**
 * Validates the given env object and returns a frozen config object.
 * Throws one Error listing every problem (never prints secret values).
 */
export const validateEnv = (env = process.env) => {
  const missing = [];
  const invalid = [];

  const str = (name, fallback) => {
    const value = (env[name] ?? "").trim();
    if (value) return value;
    if (fallback !== undefined) return fallback;
    missing.push(name);
    return undefined;
  };

  const num = (name, { fallback, min = 0, integer = false } = {}) => {
    const raw = str(name, fallback === undefined ? undefined : String(fallback));
    if (raw === undefined) return undefined;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || (integer && !Number.isInteger(value))) {
      invalid.push(`${name} must be ${integer ? "an integer" : "a number"} >= ${min}`);
      return undefined;
    }
    return value;
  };

  const origin = (name) => {
    const raw = str(name);
    if (raw === undefined) return undefined;
    try {
      const url = new URL(raw);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("bad protocol");
      return url.origin; // strips trailing slash and path
    } catch {
      invalid.push(`${name} must be a valid http(s) URL (e.g. http://localhost:5173)`);
      return undefined;
    }
  };

  // --- App ---
  const nodeEnv = str("NODE_ENV", "development");
  if (!NODE_ENVS.includes(nodeEnv)) {
    invalid.push(`NODE_ENV must be one of: ${NODE_ENVS.join(", ")}`);
  }
  const isProduction = nodeEnv === "production";
  const isTest = nodeEnv === "test";
  const port = num("PORT", { fallback: 5000, min: 1, integer: true });

  // --- Database (tests must never touch the dev database) ---
  // --- Database (tests must never touch the dev database) ---
  const mongoUri = str("MONGO_URI");

  if (mongoUri && !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    invalid.push("MONGO_URI must start with mongodb:// or mongodb+srv://");
  }

  let mongoUriTest;

  if (isTest) {
    mongoUriTest = str("MONGO_URI_TEST");

    if (mongoUriTest && !/^mongodb(\+srv)?:\/\//.test(mongoUriTest)) {
      invalid.push("MONGO_URI_TEST must start with mongodb:// or mongodb+srv://");
    }

    if (mongoUri && mongoUriTest && mongoUri === mongoUriTest) {
      invalid.push("MONGO_URI_TEST must be different from MONGO_URI");
    }
  }

  if (mongoUri && !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    invalid.push("MONGO_URI must start with mongodb:// or mongodb+srv://");
  }

  // --- Auth ---
  const jwtSecret = str("JWT_SECRET");
  if (jwtSecret && isProduction && jwtSecret.length < 32) {
    invalid.push("JWT_SECRET must be at least 32 characters in production");
  }
  const jwtExpires = str("JWT_EXPIRES", "7d");
  // jsonwebtoken reads a unitless string like "3600" as milliseconds
  if (!/^\d+[smhdw]$/.test(jwtExpires)) invalid.push("JWT_EXPIRES must be a number plus a unit, e.g. 30m, 12h or 7d");

  // --- CORS origins ---
  const clientUrl = origin("CLIENT_URL");
  const adminUrl = origin("ADMIN_URL");

  // --- Cloudinary ---
  // const cloudinary = {
  //   cloudName: str("CLOUDINARY_CLOUD_NAME"),
  //   apiKey: str("CLOUDINARY_API_KEY"),
  //   apiSecret: str("CLOUDINARY_API_SECRET"),
  // };

  const cloudinary = {
    cloudName: env.CLOUDINARY_CLOUD_NAME?.trim() || undefined,
    apiKey: env.CLOUDINARY_API_KEY?.trim() || undefined,
    apiSecret: env.CLOUDINARY_API_SECRET?.trim() || undefined,
  };
  // --- SMTP ---
  const smtp = {
    host: str("SMTP_HOST"),
    port: num("SMTP_PORT", { min: 1, integer: true }),
    user: str("SMTP_USER"),
    pass: str("SMTP_PASS"),
    from: str("EMAIL_FROM"),
  };

  // --- Stripe ---
  const stripe = {
    secretKey: str("STRIPE_SECRET_KEY"),
    webhookSecret: str("STRIPE_WEBHOOK_SECRET"),
  };
  if (stripe.secretKey && !stripe.secretKey.startsWith("sk_")) {
    invalid.push("STRIPE_SECRET_KEY must start with sk_ (did you paste the publishable key?)");
  }

  // --- Store ---
  const currency = str("CURRENCY", "usd").toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) invalid.push("CURRENCY must be a 3-letter code (e.g. usd)");
  const shippingPrice = num("SHIPPING_PRICE", { min: 0 });

  if (missing.length || invalid.length) {
    const lines = [];
    if (missing.length) lines.push(`Missing variables: ${missing.join(", ")}`);
    invalid.forEach((msg) => lines.push(`Invalid: ${msg}`));
    throw new Error(
      [
        "Environment validation failed:",
        ...lines.map((line) => `  - ${line}`),
        "Check your server/.env file (see .env.example).",
      ].join("\n")
    );
  }

  return Object.freeze({
    env: nodeEnv,
    isProduction,
    isTest,
    port,
    mongoUri,
    mongoUriTest,
    jwt: { secret: jwtSecret, expiresIn: jwtExpires },
    clientUrl,
    adminUrl,
    corsOrigins: [clientUrl, adminUrl],
    cloudinary,
    smtp,
    stripe,
    currency,
    shippingPrice,
    // Optional: only used by scripts/seed.js (validated there)
    admin: {
      name: env.ADMIN_NAME?.trim(),
      email: env.ADMIN_EMAIL?.trim(),
      password: env.ADMIN_PASSWORD,
    },
  });
};

// const loadConfig = () => {
//   try {
//     return validateEnv();
//   } catch (err) {
//     console.error(`\n${err.message}\n`);
//     process.exit(1);
//   }
// };

const loadConfig = () => {
  try {
    return validateEnv();
  } catch (err) {
    console.error(`\n${err.message}\n`);
    throw err;
  }
};

export const config = loadConfig();