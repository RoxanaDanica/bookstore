import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Button from "@mui/material/Button";

import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function BookCard({ item }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [addedMessage, setAddedMessage] = useState("");

  const rating = Number(item.rating) || 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const result = await addToCart(item.id, 1);

    if (result.success) {
      setAddedMessage("Added to cart");
    } else {
      setAddedMessage(
        result.error || "Unable to add book"
      );
    }

    setTimeout(() => {
      setAddedMessage("");
    }, 1500);
  };

  return (
    <Card
      onClick={() => navigate(`/books/${item.id}`)}
      variant="plain"
      sx={{
        width: "100%",
        bgcolor: "transparent",
        boxShadow: "none",
        borderRadius: 0,
        p: 0,
        cursor: "pointer",
        overflow: "visible",

        "&:hover .book-image": {
          transform: "scale(1.04)",
        },

        "&:hover .cart-button": {
          opacity: 1,
          transform: "translateY(0)",
        },
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#f3f0ea",
          borderRadius: "18px",
          overflow: "hidden",
          height: "340px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="book-image"
          style={{
            width: "75%",
            height: "85%",
            objectFit: "contain",
            transition: "transform 0.35s ease",
          }}
        />

        <Button
          className="cart-button"
          onClick={handleAddToCart}
          startIcon={
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 18 }}
            />
          }
          sx={{
            position: "absolute",
            left: "20px",
            right: "20px",
            bottom: "18px",
            opacity: 0,
            transform: "translateY(12px)",
            transition: "all 0.3s ease",

            bgcolor: "#171717",
            color: "#fff",

            py: 1.4,

            borderRadius: "10px",

            fontFamily: '"Jost", sans-serif',
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "none",

            "&:hover": {
              bgcolor: "#b5202d",
            },
          }}
        >
          Add to cart
        </Button>
      </div>

      <CardContent
        sx={{
          p: 0,
          pt: 2.2,
        }}
      >
        {item.authors && (
          <Typography
            sx={{
              fontFamily: '"Jost", sans-serif',
              fontSize: "13px",
              color: "#8a8580",
              mb: 0.7,

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.authors}
          </Typography>
        )}

        <Typography
          sx={{
            fontFamily:
              '"Playfair Display", serif',

            fontSize: "19px",
            fontWeight: 600,
            lineHeight: 1.35,

            color: "#171717",

            minHeight: "52px",

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "12px",
          }}
        >
          <StarRateRoundedIcon
            sx={{
              fontSize: 18,
              color: "#d8a536",
            }}
          />

          <Typography
            sx={{
              fontFamily: '"Jost", sans-serif',
              fontSize: "14px",
              fontWeight: 500,
              color: "#444",
            }}
          >
            {rating > 0
              ? rating.toFixed(1)
              : "No ratings"}
          </Typography>

          {item.ratings_count > 0 && (
            <Typography
              sx={{
                fontFamily:
                  '"Jost", sans-serif',
                fontSize: "13px",
                color: "#999",
              }}
            >
              ({item.ratings_count})
            </Typography>
          )}
        </div>

        <div
          style={{
            marginTop: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Jost", sans-serif',
              fontSize: "18px",
              fontWeight: 600,
              color: "#b5202d",
            }}
          >
            ${Number(item.price).toFixed(2)}
          </Typography>
        </div>

        {addedMessage && (
          <Typography
            sx={{
              mt: 1.2,
              fontFamily: '"Jost", sans-serif',
              fontSize: "13px",
              color: "#b5202d",
            }}
          >
            {addedMessage}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}