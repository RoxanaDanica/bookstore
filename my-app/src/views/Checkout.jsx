import { useState } from "react";
import { useCart } from "react-use-cart";

export default function Checkout() {
  const { items, cartTotal, emptyCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    street: "",
    city: "",
    county: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [courier, setCourier] = useState("fan");

  const courierOptions = {
    fan: { name: "Fan Courier", price: 5 },
    dpd: { name: "DPD", price: 4 },
    sameday: { name: "Sameday", price: 6 },
  };

  const shippingCost = courierOptions[courier].price;
  const validateField = (name, value) => {
    if (!value.trim()) return "This field is required";

    if (name === "fullName" && /\d/.test(value)) {
      return "Name cannot contain numbers";
    }

    if (["city", "county", "country"].includes(name) && /\d/.test(value)) {
      return "This field cannot contain numbers";
    }

    return "";
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // ---------------- STEP 1 -> STEP 2 ----------------
  const goToReview = () => {
    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = () => {
    setLoading(true);

    setTimeout(() => {
      console.log("ORDER CREATED:", {
        customer: form,
        items,
        total: cartTotal + shippingCost,
        courier: courierOptions[courier].name,
      });

      emptyCart();
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  // ---------------- UI ----------------
  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Checkout</h2>
      <div style={{ marginBottom: "20px" }}>
        <b>Step {step} / 3</b>
      </div>

      {/* ---------------- STEP 1 ---------------- */}
      {step === 1 && (
        <>
          <h3>Shipping Details</h3>

          {Object.keys(form).map((field) => (
            <div key={field}>
              <input
                name={field}
                placeholder={field}
                value={form[field]}
                onChange={handleChange}
              />
              {errors[field] && (
                <p style={{ color: "red" }}>{errors[field]}</p>
              )}
            </div>
          ))}

          <button onClick={goToReview}>
            Continue to Review →
          </button>
        </>
      )}

      {/* ---------------- STEP 2 ---------------- */}
      {step === 2 && (
        <>
          <h3>Review Order</h3>

          <p><b>Name:</b> {form.fullName}</p>
          <p><b>Address:</b> {form.street}, {form.city}</p>

          <hr />

          <h4>Choose Courier</h4>

          {Object.entries(courierOptions).map(([key, value]) => (
            <label key={key} style={{ display: "block", margin: 8 }}>
              <input
                type="radio"
                checked={courier === key}
                onChange={() => setCourier(key)}
              />
              {value.name} - {value.price} $
            </label>
          ))}

          <hr />

          <h4>Items</h4>
          {items.map((item) => (
            <p key={item.id}>
              {item.title} x {item.quantity}
            </p>
          ))}

          <hr />

          <p>Subtotal: {cartTotal} $</p>
          <p>Shipping: {shippingCost} $</p>

          <h3>Total: {cartTotal + shippingCost} $</h3>

          <button onClick={() => setStep(1)}>← Back</button>

          <button onClick={placeOrder} disabled={loading}>
            {loading ? "Processing..." : "Place Order "}
          </button>
        </>
      )}

      {/* ---------------- STEP 3 ---------------- */}
      {step === 3 && (
        <div style={{ padding: 20, background: "#eaffea" }}>
          <h2>Order Confirmed!</h2>
          <p>Your order is being prepared.</p>
          <p>Courier will pick it up soon</p>
        </div>
      )}
    </div>
  );
}