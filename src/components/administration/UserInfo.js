import React from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import {Box, Button, Dialog, DialogActions} from "@mui/material";

const UserInfo = (props) => {

    const {user, open, onClose} = props;

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 'auto',
                width: 'fit-content',
                textAlign: 'center',
            }}>
                <DialogTitle> User Data</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        value={user && user.email}
                        label="Email"
                        type="text"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        value={user && user.firstName + ' ' + user.lastName}
                        label="Name"
                        type="text"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        value={user && user.role.roleType}

                        label="Role"
                        type="text"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => onClose()}>Ok</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );

}

export default UserInfo;