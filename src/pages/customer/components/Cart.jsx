import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import styled from 'styled-components';
import emptyCart from "../../../assets/cartimg.png";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { addToCart, removeAllFromCart, removeFromCart, updateCurrentUser } from '../../../redux/userSlice'; // Updated import to correct function
import { AppBar, Drawer, NavLogo, StyledTableCell, StyledTableRow } from '../../../utils/styles'; // Updated import to correct components
import { useNavigate } from 'react-router-dom';

// Import the missing components
import CartImage from '../components/CartImage.jsx'; // Added import for CartImage component
import CartItem from '../components/CartItem.jsx'; // Added import for CartItem component
import ProductImage from '../components/ProductImage.jsx'; // Added import for ProductImage component
import ProductDetails from '../components/ProductDetails.jsx'; // Added import for ProductDetails component
import ButtonContainer from '../components/ButtonContainer.jsx'; // Added import for ButtonContainer component
import BottomContainer from '../components/BottomContainer.jsx'; // Added import for BottomContainer component

const Cart = ({ setIsCartOpen }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    let cartDetails = currentUser.cartDetails;

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleRemoveAllFromCart = () => {
        dispatch(removeAllFromCart());
    };

    const totalQuantity = cartDetails.reduce((total, item) => total + item.quantity, 0);
    const totalOGPrice = cartDetails.reduce((total, item) => total + (item.quantity * item.price.mrp), 0);
    const totalNewPrice = cartDetails.reduce((total, item) => total + (item.quantity * item.price.cost), 0);

    const productViewHandler = (productID) => {
        navigate("/product/view/" + productID);
        setIsCartOpen(false);
    }

    const productBuyingHandler = (id) => {
        console.log(currentUser);
        dispatch(updateCurrentUser(currentUser, currentUser._id)); // Updated function to correct one
        setIsCartOpen(false);
        navigate(`/product/buy/${id}`);
    }

    const allProductsBuyingHandler = () => {
        console.log(currentUser);
        dispatch(updateCurrentUser(currentUser, currentUser._id)); // Updated function to correct one
        setIsCartOpen(false);
        navigate("/product/Checkout");
    }

    const priceContainerRef = useRef(null);

    const handleScrollToBottom = () => {
        if (priceContainerRef.current) {
            priceContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const firstCartItemRef = useRef(null);

    const handleScrollToTop = () => {
        if (firstCartItemRef.current) {
            firstCartItemRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <StyledContainer>
            <TopContainer>
                <AppBar onClick={() => { 
                    setIsCartOpen(false);
                }}>
                    <KeyboardDoubleArrowLeftIcon /> Continue Shopping
                </AppBar>
                {cartDetails.length > 0 && ( // Fixed conditional check to use `&&` instead of `||`
                    <IconButton
                        sx={{ backgroundColor: "#3a3939", color: "white" }}
                        onClick={handleScrollToTop}
                    >
                        <KeyboardDoubleArrowUpIcon />
                    </IconButton>
                )}
            </TopContainer>
            {cartDetails.length === 0 ? (
                <CartImage src={emptyCart} />
            ) : (
                <CardGrid container spacing={2}>
                    {cartDetails.map((data, index) => (
                        <Grid
                            item xs={12}
                            key={index}
                            ref={index === 0 ? firstCartItemRef : null}
                        >
                            <CartItem>
                                <ProductImage src={data.productImage} />
                                <ProductDetails>
                                    <Typography variant="h6">
                                        {data.productName}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Original Price: ₹{data.price.mrp}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Discount: {data.price.discountPercent}% Off
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Final Price: ₹{data.price.cost}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Quantity: {data.quantity}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Total: ₹{data.quantity * data.price.cost}
                                    </Typography>
                                    <ButtonContainer>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRemoveFromCart(data)}
                                        >
                                            -1
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => handleAddToCart(data)}
                                        >
                                            +1
                                        </Button>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <StyledTableCell
                                            sx={{ mt: 2 }} // Using existing StyledTableCell component
                                            onClick={() => productViewHandler(data._id)}
                                        >
                                            View
                                        </StyledTableCell>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ mt: 2 }}
                                            onClick={() => productBuyingHandler(data._id)}
                                        >
                                            Buy
                                        </Button>
                                    </ButtonContainer>
                                </ProductDetails>
                            </CartItem>
                        </Grid>
                    ))}
                    <StyledPaper ref={priceContainerRef}>
                        <Title>
                            PRICE DETAILS
                        </Title>
                        <Divider sx={{ my: 1 }} />
                        <DetailsContainer>
                            Price ({totalQuantity} items) = ₹{totalOGPrice}
                            <br /><br />
                            Discount = ₹{totalOGPrice - totalNewPrice}
                            <Divider sx={{ my: 1 }} />
                            Total Amount = ₹{totalNewPrice}
                        </DetailsContainer>
                        <Divider sx={{ my: 1, mb: 4 }} />
                        {cartDetails.length > 0 && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={allProductsBuyingHandler}
                            >
                                Buy All
                            </Button>
                        )}
                    </StyledPaper>
                </CardGrid>
            )}

            {cartDetails.length > 0 && ( // Fixed conditional check to use `&&` instead of `||`
                <BottomContainer>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleScrollToBottom}>
                        View Bill
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleRemoveAllFromCart}
                    >
                        Remove All
                    </Button>
                </BottomContainer>
            )}

        </StyledContainer>
    );
};

export default Cart;

const StyledContainer = styled(Container)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 16px;
  background-color: #f8f8f8;
  z-index:1;
`;

const StyledPaper = styled(Paper)`
  padding: 26px;
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  height: 30vh;
`;

const CardGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const DetailsContainer = styled.div`
  margin-top: 1rem;
`;

// Comment: Ensure that `CartImage`, `CartItem`, `ProductImage`, `ProductDetails`, `ButtonContainer`, and `BottomContainer` are correctly defined and imported.
// Updated import paths for missing components
