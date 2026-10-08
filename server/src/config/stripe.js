import Stripe from "stripe";
import { config } from "./env.js";

const stripe = new Stripe(config.stripe.secretKey);

export default stripe;