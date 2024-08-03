import * as React from 'react';
import { useDispatch } from 'react-redux';
// Commented out import due to missing 'underControl' export
// import { underControl } from '../redux/userHandle'; 
import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';

// Replace `underControl` with an appropriate action from your imports if needed
const Popup = ({ message, setShowPopup, showPopup }) => {
    const dispatch = useDispatch();

    const vertical = "top"
    const horizontal = "right"

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowPopup(false); // Changed to `false` to hide the popup instead of showing it
        // Commented out dispatch call due to missing 'underControl' action
        // dispatch(underControl()) 
    };

    return (
        <>
            <Snackbar open={showPopup} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                {
                    (message === "Order Done Successfully" || message === "Done Successfully") ?
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                        :
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                }
            </Snackbar>
        </>
    );
};

export default Popup;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={'6'} ref={ref} variant="filled" {...props} />;
});
