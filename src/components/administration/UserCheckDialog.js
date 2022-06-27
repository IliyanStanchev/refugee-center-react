import React, {useEffect, useState} from "react";
import TextField from '@mui/material/TextField';
import {Backdrop, CircularProgress, Dialog, DialogActions, Divider} from "@mui/material";
import UserService from "../../services/UserService";
import FaceIcon from '@mui/icons-material/Face';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {lightGreen} from '@mui/material/colors';

const options = {year: 'numeric', month: 'long', day: 'numeric'};

const UserCheckDialog = (props) => {

    const {open, id, onAction} = props;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const getUser = async () => {

        if (id == 'undefined' || id == null)
            return;

        try {

            UserService.getUser(id)
                .then(
                    response => {
                        setUser(response.data);
                    }
                )

        } catch (error) {
            setUser(null);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    }

    const handleSave = () => {

        setLoading(true);
        setErrorMessage('');
        setMessage('');

        UserService.updateUser(user)
            .then(response => {
                handleResponse(response);
            })
            .catch(error => {
                handleResponse(error.response);
            });
    };

    const handleChangeState = () => {

        setLoading(true);
        setErrorMessage('');
        setMessage('');

        UserService.changeStatus(id)
            .then(response => {
                handleResponse(response);
            })
            .catch(error => {
                handleResponse(error.response);
            });

    };

    const handleResponse = (response) => {

        setLoading(false);

        if (response.status === 200) {
            setMessage("Successfully updated user");
            setUser(response.data);
        } else {
            setErrorMessage(response.data);
        }
    };

    return (
        <Dialog fullWidth
                maxWidth="sm" open={open} onClose={onAction}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <FaceIcon sx={{fontSize: 50, mt: 2}} color='primary'/>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <DialogTitle> Employee </DialogTitle>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <p style={{fontSize: 20, color: 'green'}}> {message} </p>
                <p style={{fontSize: 20, color: 'red'}}> {errorMessage} </p>
            </div>
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
                <TextField
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    autoFocus
                    margin="dense"
                    name="email"
                    id="email"
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    value={user && user.email}
                    label="Email"
                    type="text"
                    variant="outlined"
                />
                <TextField
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    readOnly
                    value={user && user.firstName + ' ' + user.lastName}
                    label="Name"
                    type="text"
                    variant="outlined"
                />
                <TextField
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    name="identifier"
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    value={user && user.identifier}
                    label="Identifier"
                    type="text"
                    variant="outlined"
                />
                <Divider sx={{mt: 2, mb: 2}}/>
                <TextField
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    readOnly
                    value={user && user.role.roleType}
                    label="Role"
                    type="text"
                    variant="outlined"
                />
                <TextField
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    readOnly
                    value={user && new Date(user.accountStatus.createdOn).toLocaleString("en-US", options)}
                    label="Creation date"
                    type="text"
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" disabled={loading} color="primary"
                        onClick={handleChangeState}> {user && user.accountStatus.accountStatusType == 'Blocked' ? 'Unblock user' : 'Block user'} </Button>
                <Button variant="contained" disabled={loading} color="primary" onClick={handleSave}> Save data </Button>
            </DialogActions>
        </Dialog>

    );

}

export default UserCheckDialog;