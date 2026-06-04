import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {
    isEmpty,
    items,
    totalUniqueItems,
    totalItems,
    cartTotal,
    removeItem,
    updateItemQuantity,
    emptyCart,
  } = useCart();

  const navigate = useNavigate();

  if (isEmpty) return <h2>Cart is empty</h2>;

  return (
    <div>
      <h2>Cart</h2>

      <p>Unique items: {totalUniqueItems}</p>
      <p>Total items: {totalItems}</p>
      <p>Total: {cartTotal} $</p>

      <button onClick={emptyCart}>
        Empty Cart
      </button>

      <button
        onClick={() => navigate("/checkout")}
        className={{ marginLeft: "10px", background: "green", color: "white" }}
      >
        Go to Checkout
      </button>

      <hr />

      {items.map((item) => (
        <div key={item.id} className={{ marginBottom: "15px" }}>
          <h4>{item.title}</h4>
          <p>{item.price} $</p>

          <button onClick={() => removeItem(item.id)}>
            Remove Item
          </button>

          <button
            onClick={() =>
              updateItemQuantity(item.id, item.quantity - 1)
            }
          >
            -
          </button>

          <span className={{ margin: "0 10px" }}>
            {item.quantity}
          </span>

          <button
            onClick={() =>
              updateItemQuantity(item.id, item.quantity + 1)
            }
          >
            +
          </button>
        </div>
      ))}
    </div>
  );
}