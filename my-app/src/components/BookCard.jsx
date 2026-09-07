import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Button from "@mui/material/Button";
import StarRateIcon from '@mui/icons-material/StarRate';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function BookCard({ item }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedMessage, setAddedMessage] = useState("");

  function renderStars(ratings_count) {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (ratings_count >= i) {
        stars.push(<StarRateIcon key={i} sx={{ color: 'black' }} />);
      } else if (ratings_count >= i - 0.5) {
        stars.push(<StarHalfIcon key={i} sx={{ color: 'black' }} />);
      } else {
        stars.push(<StarBorderIcon key={i} sx={{ color: 'black' }} />);
      }
    }

    return stars;
  }

  return (
    <Card
        onClick={() => navigate(`/books/${item.id}`)}
        orientation="vertical"
        size="md"
        variant="soft"
        sx={{
        
        bgcolor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',

        '& .add-to-cart-btn': {
            opacity: 0,
            transform: 'translateY(-60px)',
            transition: 'all 0.5s ease',
        },

        '&:hover .add-to-cart-btn': {
            opacity: 1,
            transform: 'translateY(0)',
        },
        }}
    >
      <CardContent>
        <AspectRatio      
            ratio={256 / 300}
            sx={{
                width: 256,
                height: 300,
                bgcolor: '#f7f7f7',
            }}>
          <img  style={{
            width: '100%',
            paddingTop: '20px',
            paddingBottom: '20px',
            height: '100%',
            objectFit: 'contain',
        }}src={item.thumbnail} />
        </AspectRatio>

        <Typography  level="title-lg" sx= {{ fontFamily: '"Playfair Display", serif', display: 'flex', justifyContent: 'center', paddingTop: '20px', marginTop: '10px', marginBottom: '10px' }}>
          {item.title}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', marginTop: '10px' }}>
            {renderStars(item.rating)}
        </div>

        <Typography level="title-lg" sx={{ marginTop: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', color: '#e52334', fontSize: '18px', fontWeight: '500', fontFamily: '"Jost", serif' }}>
          {item.price} $
        </Typography>

      </CardContent>

      <CardActions        
        sx={{
            justifyContent: 'center',
            '& > .MuiButton-root': {
            flex: 'none !important',
            width: 'auto !important',
            },
        }}>
        <Button
            className="add-to-cart-btn"
            variant="contained"
            sx={{
            padding: '15px 30px',
            fontSize: '14px',
            lineHeight: '20px',
            backgroundColor: '#e52334',
            color: '#ffffff',
            fontFamily: '"Jost", sans-serif',
            textTransform: 'uppercase',
            verticalAlign: 'middle',
            flex: 'none',
            borderRadius: '0',
            outline: 'none',
            width: 'auto',
            letterSpacing: '0.5px',
            }}  
            onClick={async (e) => {
              e.stopPropagation();

              const result = await addToCart(item.id, 1);

              if (result.success) {
                setAddedMessage(`"${item.title}" has been added to the cart!`);
              } else {
                setAddedMessage(result.error || `Could not add "${item.title}" to cart`);
              }

              setTimeout(() => {
                setAddedMessage("");
              }, 1500);
            }}

        >
          Add to Cart
        </Button>
      </CardActions>
      {addedMessage && (
          <Typography
              sx={{
                  textAlign: "center",
                  color: "#e52334",
                  marginTop: "10px"
              }}
          >
              {addedMessage}
          </Typography>
      )}
    </Card>
  );
}