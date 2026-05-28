import { useCart } from "react-use-cart";

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

  if (isEmpty) return <h2>Cart is empty</h2>;

  return (
    <div>
      <h2>Cart</h2>
      <p>Unique items: {totalUniqueItems}</p>
      <p>Total items: {totalItems}</p>
      <p>Total: {cartTotal} $</p>

      <button onClick={emptyCart}>Empty Cart</button>

      {items.map((item) => (
        <div key={item.id}>
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

          <span>{item.quantity}</span>

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