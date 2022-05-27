import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Link } from "@mui/material";
import { Dialog, DialogActions, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Autocomplete from '@mui/material/Autocomplete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import UserService from "../../services/UserService";
import { green, red } from "@mui/material/colors";
import { CircularProgress } from "@mui/material";
import UserInfo from "./UserInfo";
import GroupUsersTable from "./GroupUsersTable";
import GroupService from "../../services/GroupService";
import { OutlinedInput } from '@mui/material/OutlinedInput';

const GroupDialog = (props) => {

    let { selectedGroup, open, onActionPerformed } = props;

    const groupTypes = [
        'EMPLOYEES'
        , 'REFUGEES'
        , 'COMMON'
    ];

    const [group, setGroup] = useState(selectedGroup);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getResponsibleUsers = async () => {
        try {

            UserService.getResponsibleUsers()
                .then(
                    response => {
                        setUsers(response.data);
                    }
                )

        } catch (error) {
            setUsers([]);
        }
    };

    useEffect(() => {
        getResponsibleUsers();
    }, []);

    const handleSaveGroup = () => {

        setLoading(true);
        setErrorMessage('');
        GroupService.createGroup(selectedGroup)
            .then(
                response => {
                    handleSuccess()

                }
            )
            .catch(
                error => {
                    setLoading(false);
                    setErrorMessage(error.response.data);
                }
            );

    };

    const handleSuccess = () => {

        selectedGroup.id = 0;
        selectedGroup.email = '@safe_shelter.com';
        selectedGroup.groupType = 'COMMON';

        setLoading(false);
        onActionPerformed();
    };

    const setNewEmail = (email) => {

        selectedGroup.email = email;
        setGroup({ selectedGroup });

    };

    const setResponsibleUser = (user) => {
        selectedGroup.responsibleUser = user;
        setGroup({ selectedGroup });
    };

    const setGroupType = (groupType) => {
        selectedGroup.groupType = groupType;
        setGroup({ selectedGroup });
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
                <DialogTitle> Group </DialogTitle>
                {<p style={{ color: red[500] }}>{errorMessage}</p>}
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        value={selectedGroup && selectedGroup.email}
                        label="Email"
                        type="text"
                        variant="outlined"
                        error={selectedGroup && selectedGroup.email.length <= '@safe_shelter.com'.length}
                        helperText={selectedGroup && selectedGroup.email.length <= '@safe_shelter.com'.length ? 'Please fill group email' : ''}
                        name="email"
                        onChange={(event) => {
                            setNewEmail(event.target.value);
                        }}
                    />
                    <Autocomplete
                        sx={{ mt: 2, mb: 2 }}
                        id="groupTypes"
                        value={selectedGroup && selectedGroup.groupType}
                        options={groupTypes}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(event, newValue) => {
                            setGroupType(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                {option}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={selectedGroup && selectedGroup.groupType === null}
                                helperText={selectedGroup && selectedGroup.groupType === null ? 'Please select group type' : ''}
                                label="Choose group type"
                                inputProps={{
                                    ...params.inputProps,
                                }}
                            />
                        )}></Autocomplete>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Autocomplete
                        sx={{ mb: 2 }}
                        id="users"
                        value={selectedGroup && selectedGroup.responsibleUser}
                        options={users}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, newValue) => {
                            setResponsibleUser(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.email}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                {option.email}
                                <Button onClick={() => {
                                    setOpenUserDialog(true);
                                    setSelectedUser(
                                        option
                                    );
                                }}> <OpenInNewIcon /> </Button>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={selectedGroup && selectedGroup.responsibleUser === null}
                                helperText={selectedGroup && selectedGroup.responsibleUser === null ? 'Please select a responsible user' : ''}
                                label="Choose a responsible user"
                                inputProps={{
                                    ...params.inputProps,
                                }}
                            />
                        )}></Autocomplete>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    {selectedGroup && selectedGroup.id > 0 && <GroupUsersTable group={selectedGroup} />}
                </DialogContent>
            </Box>
            <DialogActions>
                <Button variant="contained" onClick={() => handleSaveGroup()}>Save</Button>
                <Button variant="contained" onClick={() => onActionPerformed()}>Cancel</Button>
            </DialogActions>
            <UserInfo user={selectedUser} open={openUserDialog} onClose={handleUserActionPerformed} />
        </Dialog>
    );
}

export default GroupDialog;