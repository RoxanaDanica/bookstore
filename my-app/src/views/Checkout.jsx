import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { checkout } from "../api/cart";
import { useCart } from "../context/CartContext";

import LockIcon from "@mui/icons-material/Lock";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

const STEP = {
  PERSONAL: 1,
  SHIPPING: 2,
  PAYMENT: 3,
  SUCCESS: 4,
};

const schema = z.object({
  fullName: z.string().min(2).max(60),
  street: z.string().min(3).max(100),
  city: z.string().min(2).max(60),
  county: z.string().min(2).max(60),
  country: z.string().min(2).max(60),
  mail: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Invalid email address"
    ),
});

export default function Checkout() {
  const {
    cart,
    setCart,
    cartLoading,
  } = useCart();

  const [step, setStep] = useState(STEP.PERSONAL);
  const [editStep, setEditStep] = useState(null);
  const [courier, setCourier] = useState("fan");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("cash");
  const [completedOrder, setCompletedOrder] = useState(null);

  const items = cart?.items || [];

  const totalItems =
    step === STEP.SUCCESS
      ? completedOrder?.totalItems || 0
      : cart?.totalItems || 0;

  const cartTotal =
    step === STEP.SUCCESS
      ? completedOrder?.cartTotal || 0
      : cart?.cartTotal || 0;

  const courierOptions = {
    fan: {
      name: "Fan Courier",
      price: 5,
    },
    dpd: {
      name: "DPD",
      price: 4,
    },
    sameday: {
      name: "Sameday",
      price: 6,
    },
  };

  const shippingCost =
    step === STEP.SUCCESS
      ? completedOrder?.shippingCost || 0
      : courierOptions[courier].price;

  const finalTotal = cartTotal + shippingCost;

  const {
    register,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const isEditing = (s) => editStep === s;

  const email =
    step === STEP.SUCCESS
      ? completedOrder?.email
      : watch("mail");

  const goToStep = (s) => {
    setStep(s);
    setEditStep(null);
  };

  const startEdit = (s) => {
    setEditStep(s);
    setStep(s);
  };

  const nextFromPersonal = async () => {
    const valid = await trigger();

    if (valid) {
      goToStep(STEP.SHIPPING);
    }
  };

  const placeOrder = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await checkout({
        paymentMethod: payment,
        courier,
        shippingAddress: {
          fullName: getValues("fullName"),
          street: getValues("street"),
          city: getValues("city"),
          county: getValues("county"),
          country: getValues("country"),
          email: getValues("mail"),
        },
      });

      setCompletedOrder({
        orderId: response.data.orderId,
        email: getValues("mail"),
        items: [...items],
        totalItems: cart?.totalItems || 0,
        cartTotal: cart?.cartTotal || 0,
        shippingCost: courierOptions[courier].price,
      });

      setStep(STEP.SUCCESS);

      setCart({
        items: [],
        totalItems: 0,
        cartTotal: 0,
      });
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Unable to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  function Section({
    title,
    stepId,
    children,
    summary,
  }) {
    const active = step === stepId;

    const readOnly =
      step > stepId &&
      !isEditing(stepId);

    return (
      <div
        className={`
          mb-5 overflow-hidden rounded-2xl border bg-white
          transition-all duration-300
          ${
            active
              ? "border-[#d8d1c8] shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
              : "border-[#e7e2db]"
          }
        `}
      >
        <div className="flex items-center justify-between px-7 py-6">
          <div className="flex items-center gap-4">
            <div
              className={`
                flex h-9 w-9 items-center justify-center rounded-full
                text-sm font-semibold
                ${
                  active
                    ? "bg-[#171717] text-white"
                    : readOnly
                    ? "bg-[#eef5ef] text-[#4e7b5b]"
                    : "bg-[#f3f0ea] text-[#8b8580]"
                }
              `}
            >
              {readOnly ? (
                <CheckOutlinedIcon sx={{ fontSize: 18 }} />
              ) : (
                stepId
              )}
            </div>

            <h2 className="font-['Playfair'] text-[22px] font-semibold text-[#171717]">
              {title.replace(/^\d+\s*/, "")}
            </h2>
          </div>

          {readOnly && (
            <button
              type="button"
              onClick={() => startEdit(stepId)}
              className="text-sm font-semibold text-[#b5202d] transition hover:text-[#171717] hover:cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {active && (
          <div className="border-t border-[#eee9e3] px-7 pb-7 pt-6">
            {children}
          </div>
        )}

        {readOnly && summary && (
          <div className="border-t border-[#eee9e3] px-7 py-5 text-sm text-[#77716b]">
            {summary}
          </div>
        )}
      </div>
    );
  }

  if (cartLoading) {
    return <h2>Loading checkout...</h2>;
  }

  if (
    step !== STEP.SUCCESS &&
    (!cart || cart.items.length === 0)
  ) {
    return (
      <section className="min-h-[70vh] bg-[#f8f6f2] px-6 py-20">
        <div className="mx-auto max-w-[560px] rounded-3xl border border-[#e5dfd7] bg-white px-10 py-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
            <LockIcon sx={{ fontSize: 28 }} />
          </div>

          <h2 className="mt-6 font-['Playfair'] text-[32px] font-semibold">
            Nothing to checkout yet
          </h2>

          <p className="mt-4 text-[15px] leading-7 text-[#77716b]">
            Add a few books to your cart before continuing to checkout.
          </p>

          <a
            href="/"
            className="mt-8 inline-block bg-[#171717] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#b5202d]"
          >
            Browse Books
          </a>
        </div>
      </section>
    );
  }

return (
  <section className="min-h-screen bg-[#f8f6f2] py-16">
    <div className="mx-auto max-w-[1300px] px-6">
      <div className="mb-10">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
          Secure checkout
        </span>

        <h1 className="mt-3 font-['Playfair'] text-[44px] font-bold text-[#171717]">
          Complete your order
        </h1>

        <p className="mt-3 max-w-[560px] text-[15px] leading-7 text-[#77716b]">
          Add your delivery details, choose a shipping method and
          complete your purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <Section
            title="1 Personal Information"
            stepId={STEP.PERSONAL}
            summary={
              <div className="space-y-1">
                <p className="font-medium text-[#171717]">
                  {getValues("fullName")}
                </p>

                <p>{getValues("mail")}</p>

                <p>
                  {getValues("street")}, {getValues("city")}
                </p>

                <p>
                  {getValues("county")}, {getValues("country")}
                </p>
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#3d3935]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  placeholder="John Smith"
                  {...register("fullName")}
                  className="
                    w-full rounded-xl border border-[#ddd7d0]
                    bg-[#faf9f7] px-4 py-3.5 text-sm
                    outline-none transition
                    placeholder:text-[#aaa49d]
                    focus:border-[#b5202d]
                    focus:bg-white
                  "
                />

                {errors.fullName && (
                  <p className="mt-2 text-xs text-[#b5202d]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="mail"
                  className="mb-2 block text-sm font-semibold text-[#3d3935]"
                >
                  Email address
                </label>

                <input
                  id="mail"
                  type="email"
                  placeholder="john@example.com"
                  {...register("mail")}
                  className="
                    w-full rounded-xl border border-[#ddd7d0]
                    bg-[#faf9f7] px-4 py-3.5 text-sm
                    outline-none transition
                    placeholder:text-[#aaa49d]
                    focus:border-[#b5202d]
                    focus:bg-white
                  "
                />

                {errors.mail && (
                  <p className="mt-2 text-xs text-[#b5202d]">
                    {errors.mail.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="street"
                  className="mb-2 block text-sm font-semibold text-[#3d3935]"
                >
                  Street address
                </label>

                <input
                  id="street"
                  placeholder="123 Library Street"
                  {...register("street")}
                  className="
                    w-full rounded-xl border border-[#ddd7d0]
                    bg-[#faf9f7] px-4 py-3.5 text-sm
                    outline-none transition
                    placeholder:text-[#aaa49d]
                    focus:border-[#b5202d]
                    focus:bg-white
                  "
                />

                {errors.street && (
                  <p className="mt-2 text-xs text-[#b5202d]">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-[#3d3935]"
                >
                  City
                </label>

                <input
                  id="city"
                  placeholder="City"
                  {...register("city")}
                  className="
                    w-full rounded-xl border border-[#ddd7d0]
                    bg-[#faf9f7] px-4 py-3.5 text-sm
                    outline-none transition
                    placeholder:text-[#aaa49d]
                    focus:border-[#b5202d]
                    focus:bg-white
                  "
                />

                {errors.city && (
                  <p className="mt-2 text-xs text-[#b5202d]">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="county"
                  className="mb-2 block text-sm font-semibold text-[#3d3935]"
                >
                  County
                </label>

                <input
                  id="county"
                  placeholder="County"
                  {...register("county")}
                  className="
                    w-full rounded-xl border border-[#ddd7d0]
                    bg-[#faf9f7] px-4 py-3.5 text-sm
                    outline-none transition
                    placeholder:text-[#aaa49d]
                    focus:border-[#b5202d]
                    focus:bg-white
                  "
                />

                {errors.county && (
                  <p className="mt-2 text-xs text-[#b5202d]">
                    {errors.county.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-semibold text-[#3d3935]"
                >
                  Country
                </label>

                <input
                  id="country"
                  placeholder="Country"
                  {...register("country")}
                  className="
                    w-full rounded-xl border border-[#ddd7d0]
                    bg-[#faf9f7] px-4 py-3.5 text-sm
                    outline-none transition
                    placeholder:text-[#aaa49d]
                    focus:border-[#b5202d]
                    focus:bg-white
                  "
                />

                {errors.country && (
                  <p className="mt-2 text-xs text-[#b5202d]">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={nextFromPersonal}
                className="
                  rounded-xl bg-[#171717] px-8 py-3.5
                  text-sm font-semibold text-white
                  transition hover:bg-[#b5202d]
                  hover:cursor-pointer
                "
              >
                Continue
              </button>
            </div>
          </Section>

          <Section
            title="2 Shipping Method"
            stepId={STEP.SHIPPING}
            summary={
              <div className="flex items-center justify-between">
                <span>
                  {courierOptions[courier].name}
                </span>

                <span className="font-semibold text-[#171717]">
                  ${courierOptions[courier].price.toFixed(2)}
                </span>
              </div>
            }
          >
            <div className="space-y-3">
              {Object.entries(courierOptions).map(
                ([key, value]) => (
                  <label
                    key={key}
                    className={`
                      flex cursor-pointer items-center gap-4
                      rounded-xl border p-4 transition
                      ${
                        courier === key
                          ? "border-[#b5202d] bg-[#fbf5f5]"
                          : "border-[#e5dfd8] bg-[#faf9f7] hover:border-[#c9c2ba]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      checked={courier === key}
                      onChange={() => setCourier(key)}
                      className="h-4 w-4 accent-[#b5202d]"
                    />

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#b5202d]">
                      <LocalShippingOutlinedIcon
                        sx={{ fontSize: 22 }}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-[#171717]">
                        {value.name}
                      </p>

                      <p className="mt-1 text-xs text-[#8b8580]">
                        Delivery next day
                      </p>
                    </div>

                    <p className="font-semibold text-[#171717]">
                      ${value.price.toFixed(2)}
                    </p>
                  </label>
                )
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="delivery_message"
                className="mb-2 block text-sm font-semibold text-[#3d3935]"
              >
                Order note
              </label>

              <textarea
                id="delivery_message"
                name="delivery_message"
                rows="3"
                placeholder="Add delivery instructions or a note for your order..."
                className="
                  w-full resize-none rounded-xl border border-[#ddd7d0]
                  bg-[#faf9f7] px-4 py-3.5 text-sm
                  outline-none transition
                  placeholder:text-[#aaa49d]
                  focus:border-[#b5202d]
                  focus:bg-white
                "
              />
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => goToStep(STEP.PAYMENT)}
                className="
                  rounded-xl bg-[#171717] px-8 py-3.5
                  text-sm font-semibold text-white
                  transition hover:bg-[#b5202d]
                  hover:cursor-pointer
                "
              >
                Continue
              </button>
            </div>
          </Section>

          <Section
            title="3 Payment"
            stepId={STEP.PAYMENT}
            summary={
              <p className="capitalize">
                {payment.replace("_", " ")}
              </p>
            }
          >
            <div className="space-y-3">
              {[
                {
                  value: "cash",
                  title: "Cash on Delivery",
                  text: "Pay when your order arrives.",
                },
                {
                  value: "card",
                  title: "Credit or Debit Card",
                  text: "Pay securely using your card.",
                },
                {
                  value: "bank_transfer",
                  title: "Bank Transfer",
                  text: "Complete payment by bank transfer.",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex cursor-pointer items-center gap-4
                    rounded-xl border p-4 transition
                    ${
                      payment === option.value
                        ? "border-[#b5202d] bg-[#fbf5f5]"
                        : "border-[#e5dfd8] bg-[#faf9f7] hover:border-[#c9c2ba]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={payment === option.value}
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                    className="h-4 w-4 accent-[#b5202d]"
                  />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      {option.title}
                    </p>

                    <p className="mt-1 text-xs text-[#8b8580]">
                      {option.text}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={placeOrder}
                className="
                  rounded-xl bg-[#171717] px-8 py-3.5
                  text-sm font-semibold text-white
                  transition hover:bg-[#b5202d]
                  disabled:cursor-not-allowed disabled:opacity-50
                  hover:cursor-pointer
                "
              >
                {loading
                  ? "Processing..."
                  : "Place Order"}
              </button>
            </div>
          </Section>

          {step === STEP.SUCCESS && (
            <div className="rounded-2xl border border-[#dbe7dd] bg-[#f4faf5] p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e2f1e5] text-[#4e7b5b]">
                <CheckOutlinedIcon sx={{ fontSize: 28 }} />
              </div>

              <h2 className="mt-5 font-['Playfair'] text-[30px] font-semibold text-[#171717]">
                Your order is confirmed
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-[#6f766f]">
                We've sent the order details to{" "}
                <span className="font-semibold text-[#171717]">
                  {email}
                </span>.
              </p>

              {completedOrder?.orderId && (
                <div className="mt-6 rounded-xl bg-white px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#969b96]">
                    Order ID
                  </p>

                  <p className="mt-1 font-semibold text-[#171717]">
                    {completedOrder.orderId}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="h-fit lg:sticky lg:top-[110px]">
          <div className="rounded-2xl border border-[#e5dfd7] bg-white p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <h2 className="font-['Playfair'] text-[28px] font-semibold text-[#171717]">
              Order Summary
            </h2>

            <div className="mt-7 space-y-4 border-b border-[#ece7e1] pb-6">
              <div className="flex justify-between">
                <span className="text-sm text-[#77716b]">
                  Items ({totalItems})
                </span>

                <span className="font-medium">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-[#77716b]">
                  Shipping
                </span>

                <span className="font-medium">
                  ${shippingCost.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-[#77716b]">
                  Taxes
                </span>

                <span className="font-medium">
                  $0.00
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between py-6">
              <div>
                <p className="text-sm text-[#77716b]">
                  Total
                </p>

                <p className="mt-1 text-xs text-[#aaa49d]">
                  Tax excluded
                </p>
              </div>

              <p className="font-['Playfair'] text-[30px] font-bold">
                ${finalTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#e5dfd7] bg-[#f3f0ea] p-6">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b5202d]">
                  <LockIcon sx={{ fontSize: 20 }} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Secure checkout
                  </p>

                  <p className="mt-1 text-xs text-[#77716b]">
                    Your information is protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b5202d]">
                  <LocalShippingIcon sx={{ fontSize: 20 }} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Reliable delivery
                  </p>

                  <p className="mt-1 text-xs text-[#77716b]">
                    Fast and carefully handled shipping.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b5202d]">
                  <ThumbUpIcon sx={{ fontSize: 20 }} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Easy returns
                  </p>

                  <p className="mt-1 text-xs text-[#77716b]">
                    Simple return policy if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
);
}