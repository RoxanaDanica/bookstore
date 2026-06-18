import { useState } from "react";
import { useCart } from "react-use-cart";
import { useForm } from "react-hook-form";
import { size, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { colors } from "@mui/joy";

const STEP = { PERSONAL: 1, SHIPPING: 2, PAYMENT: 3, SUCCESS: 4, };

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
  const { items, cartTotal, totalItems, emptyCart } = useCart();

  const [step, setStep] = useState(STEP.PERSONAL);
  const [editStep, setEditStep] = useState(null);
  const [courier, setCourier] = useState("fan");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState("cash");

  const courierOptions = {
    fan: { name: "Fan Courier", price: 5 },
    dpd: { name: "DPD", price: 4 },
    sameday: { name: "Sameday", price: 6 },
  };

  const shippingCost = courierOptions[courier].price;
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
  const email = watch("mail");
  const fullName = watch("fullName");
  const city = watch("city");
  const street = watch("street");
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
    if (valid) goToStep(STEP.SHIPPING);
  };

  const placeOrder = () => {
    setLoading(true);

    setTimeout(() => {
      emptyCart();
      setLoading(false);
      setStep(STEP.SUCCESS);
    }, 1000);
  };

  function Section({ title, stepId, children, summary }) {
    const active = step === stepId;
    const readOnly = step > stepId && !isEditing(stepId);

    return (
      <div className="border border-[#e5e5e5] p-4 mb-4">

        <div className="flex justify-between items-center">
          <h1 className="font-['playfair'] text-[20px]">
            {title}
          </h1>

          {readOnly && (
            <button
              onClick={() => startEdit(stepId)}
              className="hover:cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>


        {active && (
          <div>
            {children}
          </div>
        )}

        {readOnly && summary}

      </div>
    );
  }
  return (
    <div className="w-[1400px] mx-auto flex">
      <div className="w-[67%]">
        <Section
          title={'1 Personal Information'}
          stepId={STEP.PERSONAL}>
          <div className="px-[40px] mt-[25px]">
            <div className="mb-[15px] flex flex-wrap">
              <label htmlFor="name" className="font-[15px] font-['jost'] font-medium float-left w-[25%]">Full Name:</label>
              <input id="name" className="border border-[#e5e5e5] p-2 w-[75%]" placeholder="Full Name" {...register("fullName")} />
              <p className="basis-full text-red-500 ml-[25%] mt-1">{errors.fullName?.message}</p>
            </div>

            <div className="mb-[15px] flex flex-wrap">
              <label htmlFor="mail" className="font-[15px] font-['jost'] font-medium float-left w-[25%]">Email:</label>
              <input id="mail" className="border border-[#e5e5e5] p-2 w-[75%]" placeholder="Street" {...register("mail")} />
              <p className="basis-full text-red-500 ml-[25%] mt-1">{errors.mail?.message}</p>
            </div>

            <div className="mb-[15px] flex flex-wrap">
              <label htmlFor="street" className="font-[15px] font-['jost'] font-medium float-left w-[25%]">Street:</label>
              <input id="street" className="border border-[#e5e5e5] p-2 w-[75%]" placeholder="Street" {...register("street")} />
              <p className="basis-full text-red-500 ml-[25%] mt-1">{errors.street?.message}</p>
            </div>

            <div className="mb-[15px] flex flex-wrap">
              <label htmlFor="city" className="font-[15px] font-['jost'] font-medium float-left w-[25%]">City:</label>
              <input id="city" className="border border-[#e5e5e5] p-2 w-[75%]" placeholder="City" {...register("city")} />
              <p className="basis-full text-red-500 ml-[25%] mt-1">{errors.city?.message}</p>
            </div>

            <div className="mb-[15px] flex flex-wrap">
              <label htmlFor="county" className="font-[15px] font-['jost'] font-medium float-left w-[25%]">County:</label>  
            <input id="county" className="border border-[#e5e5e5] p-2 w-[75%]" placeholder="County" {...register("county")} />
            <p className="basis-full text-red-500 ml-[25%] mt-1">{errors.county?.message}</p>
            </div>

            <div className="mb-[15px] flex flex-wrap">
              <label htmlFor="country" className="font-[15px] font-['jost'] font-medium float-left w-[25%]">Country:</label>
              <input id="country" className="border border-[#e5e5e5] p-2 w-[75%]" placeholder="Country" {...register("country")} />
              <p className="basis-full text-red-500 ml-[25%] mt-1">{errors.country?.message}</p>
            </div>

           
            <div className="flow-root">
               <button className="float-right px-[30px] py-[15px] bg-[#e52334] text-white hover:cursor-pointer" onClick={nextFromPersonal}>Continue</button>
            </div>
          </div>
        </Section>
        
        <Section
          title={'2 Shipping Method'}
          stepId={STEP.SHIPPING}>
          <div className="px-[40px] mt-[25px]">
            {Object.entries(courierOptions).map(([key, value]) => (
              <div key={key} className="border border-[#e5e5e5] my-[10px] py-[15px] flow-root">
                <input
                      className="float-left w-[8%] text-red hover:cursor-pointer"
                      type="radio"
                      checked={courier === key}
                      onChange={() => setCourier(key)}/>
                <div className="flex flex-row justify-between w-[92%]">
                  <LocalShippingOutlinedIcon   sx={{ fontSize: "40px", background: "#e6e6e6", fontWeight: "200", padding: "7px", margin: "0 10px"}} />
                  <label key={key} className="block w-[33%] font-['jost'] font-medium">{value.name}</label>
                  <div className="w-[33%] font-['jost'] font-medium">{value.price}$</div>
                  <div className="w-[33%] font-['jost'] font-medium">Delivery next day!</div>
                </div>
              </div>
            ))}
            <div className="mb-[15px]">
              <label className="font-medium font-[15px] font-['jost']" htmlFor="delivery_message">If you would like to add a comment about your order, please write it in the field below.</label>
              <textarea className="w-full border border-black" rows="2" cols="120" id="delivery_message" name="delivery_message"></textarea>
            </div>

            <div className="flow-root">
               <button className="float-right px-[30px] py-[15px] bg-[#e52334] text-white hover:cursor-pointer" onClick={() => goToStep(STEP.PAYMENT)}>Continue</button>
            </div>
          </div>
        </Section>

        <Section
          title="3 Payment"
          stepId={STEP.PAYMENT}>
          <div className="mt-[20px]">
            <label className="flex items-center gap-[10px] mb-[15px] cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={payment === "cash"}
                onChange={(e) => setPayment(e.target.value)}
                className="w-[18px] h-[18px] cursor-pointer"
              />

              <span className="font-['Jost'] font-medium">
                Pay by Cash on Delivery
              </span>
            </label>


            <label className="flex items-center gap-[10px] mb-[15px] cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="check"
                checked={payment === "check"}
                onChange={(e) => setPayment(e.target.value)}
                className="w-[18px] h-[18px] cursor-pointer"
              />

              <span className="font-['Jost'] font-medium">
                Pay by Check
              </span>
            </label>


            <label className="flex items-center gap-[10px] mb-[15px] cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="wire"
                checked={payment === "wire"}
                onChange={(e) => setPayment(e.target.value)}
                className="w-[18px] h-[18px] cursor-pointer"
              />

              <span className="font-['Jost'] font-medium">
                Pay by Bank Wire
              </span>
            </label>

          </div>

            <div className="flow-root">
               <button className="float-right px-[30px] py-[15px] bg-[#e52334] text-white hover:cursor-pointer" disabled={loading} onClick={placeOrder}>{loading ? "Processing..." : "Place Order"}</button>
            </div>
        </Section>

        {step === STEP.SUCCESS && (
          <div className="border border-[#e5e5e5] p-4 mb-4">
            <div className="flex gap-[7px] mb-[7px]">
              <CheckOutlinedIcon sx={{ color: "#4cbb6c" }}/>
              <h2 className="font-medium font-['playfair'] font-[18px]">Your order is confirmed </h2>
            </div>
            <p className="font-[15px] font-['jost'] font-normal">An email has been sent to the {email} address.</p>
          </div>
        )}
      </div>

      <div className="w-[33%] ml-[30px]">
        <div className="w-full p-[10px] relative block mb-5 bg-white border border-[#e5e5e5] h-fit">
              <div className="p-[20px]">
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">{totalItems} items</p>
                  <p className="font-semibold text-[#e52334]">{cartTotal.toFixed(2)} $</p>
                </div>
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">Shipping:</p>
                  <p className="font-semibold text-[#e52334]">0.00 $</p>
                </div>
              </div>
              <div className="p-[20px]"> 
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">Total (tax excl.) </p>
                  <p className="font-semibold text-[#e52334]">{cartTotal.toFixed(2)} $</p>
                </div>
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">Taxes: </p>
                  <p className="font-semibold text-[#e52334]">$0.00</p>
                </div>
              </div>
          </div>

          <div className="mt-[5px] w-full border-[3px] border-dashed border-[#efefef] py-[11px] px-[30px] mb-[15px]">
            <div className="flex flex-row gap-[10px] mb-[15px]">
              <LockIcon sx={{ color: '#e52334', fontSize: '25px' }} />
              <p className="text-gray-600 font-['Jost',serif] text-[#000000] font-semibold font-[15px]">Security policy</p>
            </div>
            <div className="flex flex-row gap-[10px] mb-[15px]">
              <LocalShippingIcon sx={{ color: '#e52334', fontSize: '25px' }} />
              <p className=" text-gray-600 font-['Jost',serif] text-[#000000] font-semibold font-[15px]">Delivery policy</p>
            </div>
            <div className="flex flex-row gap-[10px] mb-[15px]">
              <ThumbUpIcon sx={{ color: '#e52334', fontSize: '25px' }} />
              <p className="text-gray-600 font-['Jost',serif] text-[#000000] font-semibold font-[15px]">Return policy</p>
            </div>
          </div>

      </div>

    </div>
  );
}