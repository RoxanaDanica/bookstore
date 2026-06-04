import { useState } from "react";
import { useCart } from "react-use-cart";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ---------------- VALIDATION ----------------
const nameRegex = /^[\p{L}\s'-]+$/u;
const textRegex = /^[\p{L}\s'-]+$/u;

const schema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(60, "Name is too long")
    .regex(nameRegex, "Only letters are allowed"),

  street: z
    .string()
    .min(3, "Street is required")
    .max(100, "Street is too long")
    .regex(/^[\p{L}0-9\s.,'-]+$/u, "Invalid street format"),

  city: z
    .string()
    .min(2, "City is required")
    .max(60, "City is too long")
    .regex(textRegex, "Only letters are allowed"),

  county: z
    .string()
    .min(2, "County is required")
    .max(60, "County is too long")
    .regex(textRegex, "Only letters are allowed"),

  country: z
    .string()
    .min(2, "Country is required")
    .max(60, "Country is too long")
    .regex(textRegex, "Only letters are allowed"),
});

export default function Checkout() {
  const { items, cartTotal, emptyCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courier, setCourier] = useState("fan");
  const courierOptions = {
    fan: { name: "Fan Courier", price: 5 },
    dpd: { name: "DPD", price: 4 },
    sameday: { name: "Sameday", price: 6 },
  };

  const shippingCost = courierOptions[courier].price;

  // ---------------- FORM ----------------
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // ---------------- STEP 1 -> STEP 2 ----------------
  const goToReview = async () => {
    const valid = await trigger();
    if (valid) setStep(2);
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = () => {
    setLoading(true);

    setTimeout(() => {
      const form = getValues();
      emptyCart();
      setLoading(false);
      setStep(3);
    }, 1000);
  };
  return (
    <div className="max-w-md mx-auto">
      <h2>Checkout</h2>
      <b>Step {step} / 3</b>

      {/* ---------------- STEP 1 ---------------- */}
      {step === 1 && (
        <>
          <h3>Shipping Details</h3>

          <input placeholder="Full Name" {...register("fullName")} />
          <p className="text-red-500">{errors.fullName?.message}</p>

          <input placeholder="Street" {...register("street")} />
          <p className="text-red-500">{errors.street?.message}</p>

          <input placeholder="City" {...register("city")} />
          <p className="text-red-500">{errors.city?.message}</p>

          <input placeholder="County" {...register("county")} />
          <p className="text-red-500">{errors.county?.message}</p>

          <input placeholder="Country" {...register("country")} />
          <p className="text-red-500">{errors.country?.message}</p>

          <button onClick={goToReview}>
            Continue →
          </button>
        </>
      )}

      {/* ---------------- STEP 2 ---------------- */}
      {step === 2 && (
        <>
          <h3>Review Order</h3>

          <h4>Choose Courier</h4>

          {Object.entries(courierOptions).map(([key, value]) => (
            <label key={key} className="block margin-8">
              <input
                type="radio"
                checked={courier === key}
                onChange={() => setCourier(key)}
              />
              {value.name} - {value.price} $
            </label>
          ))}

          <hr />

          {items.map((item) => (
            <p key={item.id}>
              {item.title} x {item.quantity}
            </p>
          ))}

          <hr />

          <p>Subtotal: {cartTotal} $</p>
          <p>Shipping: {shippingCost} $</p>

          <h3>Total: {cartTotal + shippingCost} $</h3>

          <button onClick={() => setStep(1)}>Back</button>

          <button onClick={placeOrder} disabled={loading}>
            {loading ? "Processing..." : "Place Order (Cash)"}
          </button>
        </>
      )}

      {/* ---------------- STEP 3 ---------------- */}
      {step === 3 && (
        <div className="p-5 bg-green-100">
          <h2>Order Confirmed!</h2>
          <p>Your order is being prepared</p>
          <p>Courier will pick it up soon</p>
        </div>
      )}
    </div>
  );
}