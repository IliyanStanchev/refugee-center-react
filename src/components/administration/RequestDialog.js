import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Link } from "@mui/material";
import { Dialog, DialogActions, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { green, red } from "@mui/material/colors";
import { CircularProgress } from "@mui/material";
import UserInfo from "./UserInfo";
import Grid from '@mui/material/Grid';
import AddressResolver from "../../utils/AddressResolver";
import FacilityInfo from './FacilityInfo';
import RequestService from "../../services/RequestService";

const STOCKS_MODE = 0;

const RequestDialog = (props) => {

    let { requestType, employeeMode, request, open, onActionPerformed } = props;

    const [loading, setLoading] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserDialog, setOpenUserDialog] = useState(false);

    const [employeeComment, setEmployeeComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [openFacilityDialog, setOpenFacilityDialog] = useState(false);
    const [dialogFacility, setDialogFacility] = useState(null);


    const handleApprove = () => {

        setLoading(true);
        request.employeeComment = employeeComment;

        if (requestType == STOCKS_MODE) {

            RequestService.approveStockRequest(request).then(() => {
                onActionPerformed();
                setLoading(false);
            }).catch(error => { setLoading(false); setErrorMessage(error.response.data) });
        } else {
            RequestService.approveLocationChangeRequest(request).then(() => {
                onActionPerformed();
                setLoading(false);
            }).catch(error => { setLoading(false); setErrorMessage(error.response.data) });
        }

        setEmployeeComment('');

    };


    const handleDecline = () => {

        setLoading(true);
        request.employeeComment = employeeComment;

        if (requestType == STOCKS_MODE) {

            RequestService.declineStockRequest(request).then(() => {
                onActionPerformed();
                setLoading(false);
            }).catch(error => { setLoading(false); setErrorMessage(error.response.data) });
        } else {
            RequestService.declineLocationChangeRequest(request).then(() => {
                onActionPerformed();
                setLoading(false);
            }).catch(error => { setLoading(false); setErrorMessage(error.response.data) });
        }

        setEmployeeComment('');
    };

    const handleUserActionPerformed = () => {
        setOpenUserDialog(false);
    }

    return (
        <Dialog sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            textAlign: 'center',
        }}
            fullWidth
            maxWidth="md" open={open} onClose={() => onActionPerformed()}>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress
                        size={40}
                        sx={{
                            color: green[500],
                            mt: 1,
                        }}
                    />
                </div>
            )}
            <Box >
                <DialogTitle> {requestType == STOCKS_MODE ? 'Stock request' : 'Location change request'} </DialogTitle>
                {<p style={{ color: red[500] }}>{errorMessage}</p>}
                <DialogContent>
                    <Grid container >
                        <Grid item xs={11.5}>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="refugee"
                                value={request && request.refugee.user.email}
                                label="Refugee"
                                type="text"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={0.5}>
                            <Button onClick={() => {
                                setOpenUserDialog(true);
                                setSelectedUser(
                                    request.refugee.user
                                );
                            }}> <OpenInNewIcon /> </Button>
                        </Grid>
                    </Grid>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        InputProps={{
                            readOnly: true,
                        }}
                        id="refugee"
                        value={request && request.requestStatus}
                        label="Request Status"
                        type="text"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        InputProps={{
                            readOnly: true,
                        }}
                        id="refugee"
                        value={request && request.description}
                        label="Description"
                        type="text"
                        variant="outlined"
                    />
                    {requestType == STOCKS_MODE ?
                        <TextField
                            fullWidth
                            autoFocus
                            margin="dense"
                            InputProps={{
                                readOnly: true,
                            }}
                            id="refugee"
                            value={request && request.reason}
                            label="Reason"
                            type="text"
                            variant="outlined"
                        /> : <Grid container >
                            <Grid item xs={11.5}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    id="facility"
                                    value={request && AddressResolver.getFacilityData(request.shelter)}
                                    label="New facility"
                                    type="text"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={0.5}>
                                <Button onClick={() => {
                                    setOpenFacilityDialog(true);
                                    setDialogFacility(
                                        request.shelter
                                    );
                                }}> <OpenInNewIcon /> </Button>
                            </Grid>
                        </Grid>}
                    <Divider sx={{ mt: 2, mb: 2 }} />  <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        InputProps={{
                            readOnly: !employeeMode,
                        }}
                        id="comment"
                        value={employeeMode ? employeeComment : (request && request.employeeComment)}
                        label="Employee comment"
                        type="text"
                        variant="outlined"
                        onChange={(e) => { setEmployeeComment(e.target.value) }}
                    />

                </DialogContent>
            </Box>
            <DialogActions>
                {employeeMode && <Button variant="contained" onClick={() => handleApprove()}> Approve </Button>}
                {request && request.requestStatus === 'Pending' && <Button variant="contained" onClick={() => handleDecline()}> Decline </Button>}
                <Button variant="contained" onClick={() => onActionPerformed()}> Cancel </Button>
            </DialogActions>
            <UserInfo user={selectedUser} open={openUserDialog} onClose={handleUserActionPerformed} />
            <Dialog open={openFacilityDialog} onClose={() => setOpenFacilityDialog(false)}>
                <FacilityInfo facility={dialogFacility} />
                <DialogActions>
                    <Button variant="contained" onClick={() => setOpenFacilityDialog(false)}>Ok</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
}

export default RequestDialog;