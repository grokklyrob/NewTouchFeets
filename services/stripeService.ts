
import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key.
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51S9IdwF1aEX7i16QgPOLc8vVyGiEjjfUiio6Qi3HltaIL3a60KVB05ph7Lk6pWhtIZF34LVlwBUrCusSXpe86Y8400hvnM920V';

// The public URL of your deployed backend service on Google Cloud Run.
const BACKEND_URL = 'https://touchfeets-backend-474815569807.us-central1.run.app';


let stripePromise: Promise<any>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Creates a Stripe Checkout session and redirects the user to the Stripe page.
 * @param priceId The ID of the Stripe Price the user wants to subscribe to.
 * @param token The user's Google ID token for backend authentication.
 */
export const redirectToCheckout = async (priceId: string, token: string): Promise<void> => {
  console.log(`Requesting checkout for priceId: ${priceId}`);

  // This function now calls your deployed backend with an Authorization header.
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ priceId }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || 'Failed to create checkout session.');
    }

    const { sessionId } = await response.json();
    if (!sessionId) {
        throw new Error("Backend did not return a session ID.");
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      // This error is usually a client-side validation error (e.g., invalid key)
      console.error("Stripe redirection error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in redirectToCheckout:", error);
    // Re-throw the error so the UI component can handle it (e.g., show an alert).
    throw error;
  }
};
