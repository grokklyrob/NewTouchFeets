// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const PORT = process.env.PORT || 4242;
const FRONTEND_URL = process.env.FRONTEND_URL;

// --- Middleware ---

// Enable CORS to allow requests from your frontend
app.use(cors({ origin: FRONTEND_URL }));

// Middleware to verify Google ID Token on protected routes
async function verifyGoogleToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Expects "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // Attach user payload to the request object for use in the endpoint
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// --- API Endpoints ---

// Stripe webhook handler must come BEFORE app.use(express.json())
// This is because Stripe requires the raw request body to verify the signature.
app.post('/api/stripe-webhooks', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    // --- ESSENTIAL EVENTS ---
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`✅ [checkout.session.completed]: Payment successful for session ${session.id}.`);
      console.log(`   > Customer: ${session.customer}`);
      // --- DATABASE LOGIC ---
      // This is your primary trigger to grant access.
      // 1. Retrieve the user from your database using the 'session.customer' ID.
      // 2. Update the user's record:
      //    - Set their 'tier' to 'paid'.
      //    - Store the 'session.subscription' ID for future management.
      //    - Set their subscription status to 'active'.
      break;
    }

    case 'invoice.paid': {
        const invoice = event.data.object;
        console.log(`🧾 [invoice.paid]: Invoice paid for customer ${invoice.customer}.`);
        // --- DATABASE LOGIC ---
        // Handles recurring subscription payments.
        // 1. Retrieve the user from your database using the 'invoice.customer' ID.
        // 2. Ensure their subscription is still marked as 'active'.
        // 3. You might update a 'subscription_valid_until' date to the end of the new billing period.
        break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log(`🚫 [customer.subscription.deleted]: Subscription canceled for customer ${subscription.customer}.`);
      // --- DATABASE LOGIC ---
      // The subscription has been canceled and has ended. Time to revoke access.
      // 1. Retrieve the user from your database using the 'subscription.customer' ID.
      // 2. Update the user's record:
      //    - Set their 'tier' back to 'free'.
      //    - Set their subscription status to 'canceled'.
      break;
    }

    // --- RECOMMENDED EVENTS ---
    case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log(`🔄 [customer.subscription.updated]: Subscription updated for customer ${subscription.customer}.`);
        // --- DATABASE LOGIC ---
        // Handles upgrades, downgrades, etc.
        // 1. Retrieve the user from your database using the 'subscription.customer' ID.
        // 2. Check the 'subscription.items.data[0].price.id' to see their new plan.
        // 3. Update the user's record with the new price/plan details to adjust their quota.
        break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.log(`❌ [invoice.payment_failed]: Payment failed for customer ${invoice.customer}.`);
      // --- DATABASE LOGIC ---
      // A payment failed. Stripe will retry, but you might want to act now.
      // 1. Retrieve the user from your database using the 'invoice.customer' ID.
      // 2. Send the user an email notifying them of the failed payment.
      // 3. You could set their subscription status to 'past_due' and temporarily limit access
      //    until the payment succeeds (handled by 'invoice.paid').
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

// Use express.json() for all other routes to parse JSON bodies
app.use(express.json());

// Endpoint to create a checkout session
app.post('/api/create-checkout-session', verifyGoogleToken, async (req, res) => {
  const { priceId } = req.body;
  const { email } = req.user; // User email from the verified Google token

  try {
    // Find or create a Stripe customer based on the user's email.
    // This prevents creating duplicate customers in Stripe.
    let customer;
    const existingCustomers = await stripe.customers.list({ email: email, limit: 1 });
    
    if (existingCustomers.data.length) {
      customer = existingCustomers.data[0];
      console.log(`Found existing Stripe customer: ${customer.id}`);
    } else {
      customer = await stripe.customers.create({ email: email, name: req.user.name });
      console.log(`Created new Stripe customer: ${customer.id}`);
    }

    // --- DATABASE LOGIC ---
    // At this point, you should save the 'customer.id' to your user's record
    // in your database. This links your internal user to the Stripe customer.

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      customer: customer.id,
      success_url: `${FRONTEND_URL}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}?checkout=cancel`,
    });

    // Send the session ID back to the frontend
    res.json({ sessionId: session.id });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

// A simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
