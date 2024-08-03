import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { BlueButton, DarkRedButton, GreenButton } from '../../../utils/buttonStyles';
import { deleteStuff, getProductDetails, updateStuff } from '../../../redux/userHandle';
import { Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { Avatar, Box, Card, CardContent, CircularProgress, Collapse, IconButton, Stack, TextField, Typography } from '@mui/material';
import altImage from "../../../assets/altimg.png";
import Popup from '../../../components/Popup';
import { generateRandomColor, timeAgo } from '../../../utils/helperFunctions';
import { underControl } from '../../../redux/userSlice';
import AlertDialogSlide from '../../../components/AlertDialogSlide';

const ViewProductSeller = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const productID = params.id;

  const [showTab, setShowTab] = useState(false);

  useEffect(() => {
    dispatch(getProductDetails(productID));
  }, [productID, dispatch]);

  const { loading, status, error, productDetails, responseDetails } = useSelector(state => state.user);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState({});
  const [mrp, setMrp] = useState("");
  const [cost, setCost] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagline, setTagline] = useState("");

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [dialog, setDialog] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  console.log(price);

  useEffect(() => {
    if (productDetails) {
      setProductName(productDetails.productName || '');
      setPrice(productDetails.price || '');
      setSubcategory(productDetails.subcategory || '');
      setProductImage(productDetails.productImage || '');
      setCategory(productDetails.category || '');
      setDescription(productDetails.description || "");
      setTagline(productDetails.tagline || "");
    }
    if (productDetails.price) {
      setMrp(productDetails.price.mrp || '');
      setCost(productDetails.price.cost || '');
      setDiscountPercent(productDetails.price.discountPercent || '');
    }
  }, [productDetails]);

  const fields = {
    productName,
    price: {
      mrp: mrp,
      cost: cost,
      discountPercent: discountPercent,
    },
    subcategory,
    productImage,
    category,
    description,
    tagline,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(updateStuff(fields, productID, "ProductUpdate"));
  };

  const deleteHandler = (reviewId) => {
    console.log(reviewId);
    dispatch(updateStuff(fields, productID, "deleteProductReview"));
  };

  const deleteAllHandler = () => {
    dispatch(deleteStuff(productID, "deleteAllProductReviews"))
  }

  useEffect(() => {
    if (status === "updated" || status === "deleted") {
      setLoader(false);
      dispatch(getProductDetails(productID));
      setShowPopup(true);
      setMessage("Done Successfully");
      setShowTab(false)
      dispatch(underControl());
    } else if (error) {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, error, dispatch, productID]);

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {
            responseDetails ?
              <div>Product not found</div>
              :
              <>
                <ProductContainer>
                  <ProductImage src={productDetails && productDetails.productImage} alt={productDetails && productDetails.productName} />
                  <ProductInfo>
                    <ProductName>{productDetails && productDetails.productName}</ProductName>
                    <PriceContainer>
                      <PriceCost>₹{productDetails && productDetails.price && productDetails.price.cost}</PriceCost>
                      <PriceMrp>₹{productDetails && productDetails.price && productDetails.price.mrp}</PriceMrp>
                      <PriceDiscount>{productDetails && productDetails.price && productDetails.price.discountPercent}% off</PriceDiscount>
                    </PriceContainer>
                    <Description>{productDetails && productDetails.description}</Description>
                    <ProductDetails>
                      <p>Category: {productDetails && productDetails.category}</p>
                      <p>Subcategory: {productDetails && productDetails.subcategory}</p>
                    </ProductDetails>
                  </ProductInfo>
                </ProductContainer>

                <ButtonContainer>
                  <GreenButton
                    onClick={() => setShowTab(!showTab)}
                  >
                    {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    {/* Added buttonText variable to display button text */}
                    {showTab ? "Collapse" : "Expand"}
                  </GreenButton>
                </ButtonContainer>

                <Collapse in={showTab} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      flex: '1 1 auto',
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '30px',
                        width: '100%'
                      }}
                    >
                      <div>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                          {
                            productImage
                              ? <EditImage src={productImage} alt="" />
                              : <EditImage src={altImage} alt="" />
                          }
                        </Stack>
                        <form onSubmit={submitHandler}>
                          <Stack spacing={3}>
                            <TextField
                              fullWidth
                              label="Product Image URL"
                              value={productImage}
                              onChange={(event) => setProductImage(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              label="Product Name"
                              value={productName}
                              onChange={(event) => setProductName(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              multiline
                              label="Description"
                              value={description}
                              onChange={(event) => setDescription(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              label="MRP"
                              value={mrp}
                              onChange={(event) => setMrp(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              label="Cost"
                              value={cost}
                              onChange={(event) => setCost(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              label="Discount Percent"
                              value={discountPercent}
                              onChange={(event) => setDiscountPercent(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              label="Category"
                              value={category}
                              onChange={(event) => setCategory(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              label="Subcategory"
                              value={subcategory}
                              onChange={(event) => setSubcategory(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <TextField
                              fullWidth
                              label="Tagline"
                              value={tagline}
                              onChange={(event) => setTagline(event.target.value)}
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Stack>
                          <BlueButton
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            variant="contained"
                            type="submit"
                            disabled={loader}
                          >
                            {loader ? <CircularProgress size={24} color="inherit" /> : "Update"}
                          </BlueButton>
                        </form>
                      </div>
                    </Box>
                  </Box>
                </Collapse>

                <ReviewWritingContainer>
                  <Typography variant="h4">Reviews</Typography>

                  {productDetails.reviews && productDetails.reviews.length > 0 &&
                    <DarkRedButton onClick={() => {
                      setDialog("Do you want to delete all notices ?")
                      setShowDialog(true)
                    }}>
                      Remove All Reviews
                    </DarkRedButton>}
                </ReviewWritingContainer>

                {productDetails.reviews && productDetails.reviews.length > 0 ? (
                  <ReviewContainer>
                    {productDetails.reviews.map((review, index) => (
                      <ReviewCard key={index}>
                        <ReviewCardContent>
                          <Stack direction="row" spacing={2}>
                            <Avatar sx={{ bgcolor: generateRandomColor() }}>{review.reviewerName[0]}</Avatar>
                            <Box>
                              <Typography variant="h6">{review.reviewerName}</Typography>
                              <Typography variant="body2" color="text.secondary">{timeAgo(review.createdAt)}</Typography>
                            </Box>
                          </Stack>
                          <IconButton
                            onClick={() => deleteHandler(review._id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </ReviewCardContent>
                        <Typography variant="body2">{review.reviewText}</Typography>
                      </ReviewCard>
                    ))}
                  </ReviewContainer>
                ) : (
                  <Typography variant="body1">No reviews available</Typography>
                )}
              </>
          }
        </>
      }
      <Popup
        open={showPopup}
        setOpen={setShowPopup}
        title="Success"
        description={message}
      />
      <AlertDialogSlide
        open={showDialog}
        setOpen={setShowDialog}
        title={dialog}
        handleConfirm={deleteAllHandler}
        handleCancel={() => setShowDialog(false)}
      />
    </>
  );
};

export default ViewProductSeller;

// Styled Components
const ProductContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px;
`;

const ProductImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-right: 20px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h2`
  margin: 0;
`;

const PriceContainer = styled.div`
  margin: 10px 0;
`;

const PriceCost = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const PriceMrp = styled.p`
  font-size: 16px;
  text-decoration: line-through;
`;

const PriceDiscount = styled.p`
  color: red;
`;

const Description = styled.p`
  margin: 10px 0;
`;

const ProductDetails = styled.div`
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  margin: 20px;
`;

const EditImage = styled.img`
  width: 100%;
  height: auto;
`;

const ReviewWritingContainer = styled.div`
  margin: 20px;
`;

const ReviewContainer = styled.div`
  margin: 20px;
`;

const ReviewCard = styled(Card)`
  margin-bottom: 20px;
`;

const ReviewCardContent = styled(CardContent)`
  display: flex;
  justify-content: space-between;
`;
