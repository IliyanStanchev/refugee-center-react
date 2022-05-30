import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Link } from "@mui/material";
import { Dialog, DialogActions, Button } from "@mui/material";
import UserInfo from "./UserInfo";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CircularProgress } from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import Backdrop from '@mui/material/Backdrop';

const SelectUserDialog = (props) => {

    let { users, loading, open, onActionPerformed, onClose } = props;

    const [user, setUser] = useState(null);
    const [updateState, setUpdateState] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const handleCloseUserDialog = () => {
        setOpenUserDialog(false);
    };

    const handleConfirm = () => {
        if (user == null)
            return;

        onActionPerformed(user.user);
        setUser(null);
    }

    const setNewValue = (value) => {
        setUser(value);
    }

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <DialogTitle> Choose user </DialogTitle>
            <Backdrop open={loading}>
                <CircularProgress
                    size={60}
                    sx={{
                        color: lightGreen[800],
                        mt: 1,
                    }}
                />
            </Backdrop>
            <DialogContent>
                <Autocomplete
                    sx={{ mt: 2, mb: 2, width: 300 }}
                    id="users"
                    value={user}
                    options={users}
                    isOptionEqualToValue={(option, value) => option.user.id === value.user.id}
                    onChange={(event, newValue) => {
                        setNewValue(newValue);
                    }}
                    autoHighlight
                    getOptionLabel={(option) => option.user.email}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.user.email}
                            <Button onClick={() => {
                                setOpenUserDialog(true);
                                setSelectedUser(option.user);
                            }}> <OpenInNewIcon /> </Button>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={user === null}
                            helperText={user === null ? 'Please select user' : ''}
                            label="Choose user"
                            inputProps={{
                                ...params.inputProps,
                            }}
                        />
                    )}></Autocomplete>

            </DialogContent>
            <DialogActions>
                <Button disabled={loading} variant="contained" onClick={handleConfirm}>Confirm</Button>
                <Button disabled={loading} variant="contained" onClick={() => onClose()}>Cancel</Button>
            </DialogActions>

            <UserInfo user={selectedUser} open={openUserDialog} onClose={handleCloseUserDialog} />
        </Dialog >
    );

}

export default SelectUserDialog;