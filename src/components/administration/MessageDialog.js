import React, { useState, useEffect, Fragment } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Icon, Link } from "@mui/material";
import { Dialog, DialogActions, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { green, red } from "@mui/material/colors";
import { CircularProgress } from "@mui/material";
import MessageService from "../../services/MessageService";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReceiverDialog from './ReceiverDialog';

const MessageDialog = (props) => {

    let { selectedMessage, open, onActionPerformed, readOnly } = props;

    const messageTypes = [
        'Informative',
        'Important'
    ];

    const [reload, setReload] = useState(false);

    const [loading, setLoading] = useState(false);

    const [receivers, setReceivers] = useState([]);
    const [selectedReceiver, setSelectedReceiver] = useState(null);

    const [openReceiverDialog, setOpenReceiverDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [receiverError, setReceiverError] = useState(false);
    const [subjectError, setSubjectError] = useState(false);
    const [contentError, setContentError] = useState(false);

    const getReceivers = async () => {
        try {

            MessageService.getReceivers()
                .then(
                    response => {
                        setReceivers(response.data);
                    }
                )

        } catch (error) {
            setReceivers([]);
        }
    };

    useEffect(() => {
        getReceivers();
    }, []);

    const handleSendMessage = () => {

        setReceiverError(false);
        setSubjectError(false);
        setContentError(false);

        if (selectedMessage.receivers.length === 0) {
            setReceiverError(true);
            return;
        };

        if (selectedMessage.message.subject === '') {
            setSubjectError(true);
            return;
        }

        if (selectedMessage.message.content === '') {
            setContentError(true);
            return;
        }

        setLoading(true);
        setErrorMessage('');

        MessageService.sendMessage(selectedMessage)
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

        setLoading(false);
        onActionPerformed();
    };

    const setSelectedReceivers = (receivers) => {
        selectedMessage.receivers = receivers;
        setReload(!reload);
    };

    const setSubject = (subject) => {

        selectedMessage.message.subject = subject;
        setReload(!reload);
    };

    const setMessageType = (messageType) => {

        selectedMessage.message.messageType = messageType;
        setReload(!reload);
    };

    const setContent = (content) => {
        selectedMessage.message.content = content;
        setReload(!reload);
    };

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
                <DialogTitle> Message </DialogTitle>
                {<p style={{ color: red[500] }}>{errorMessage}</p>}

                <DialogContent>
                    <Autocomplete
                        sx={{ mt: 2, mb: 1 }}
                        multiple
                        id="tags-outlined"
                        options={receivers}
                        value={selectedMessage && selectedMessage.receivers}
                        getOptionLabel={(option) => option.email}
                        isOptionEqualToValue={(option, value) => option.email === value.email}
                        filterSelectedOptions
                        onChange={(event, newValue) => {
                            setSelectedReceivers(newValue);
                        }}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                {option.email}
                                <Button onClick={() => {
                                    setOpenReceiverDialog(true);
                                    setSelectedReceiver(
                                        option
                                    );
                                }}> <OpenInNewIcon /> </Button>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={receiverError}
                                helperText={receiverError ? 'Select at least one receiver' : ''}
                                label="Receiver"
                                inputProps={{
                                    ...params.inputProps,
                                    readOnly: readOnly,
                                }}
                            />
                        )}
                    />
                    <Autocomplete
                        id='outlined'
                        value={selectedMessage && selectedMessage.message.messageType}
                        options={messageTypes}
                        onChange={(event, newValue) => {
                            setMessageType(newValue);
                        }}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Message type"
                                inputProps={{
                                    ...params.inputProps,
                                    readOnly: readOnly,
                                }}

                            />
                        )}
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Subject"
                        InputProps={{
                            readOnly: readOnly,
                        }}
                        value={selectedMessage && selectedMessage.message.subject}
                        type="text"
                        variant="outlined"
                        name="email"
                        onChange={(event) => {
                            setSubject(event.target.value);
                        }}
                        error={subjectError}
                        helperText={subjectError ? 'Enter subject' : ''}
                    />
                    <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Message"
                        InputProps={{
                            readOnly: readOnly,
                        }}
                        value={selectedMessage && selectedMessage.message.content}
                        type="text"
                        variant="outlined"
                        name="email"
                        onChange={(event) => {
                            setContent(event.target.value);
                        }}
                        error={contentError}
                        helperText={contentError ? 'Enter message content' : ''}
                    />
                </DialogContent>
            </Box>
            <DialogActions>
                {!readOnly && <Button variant="contained" onClick={handleSendMessage}>Send Message</Button>}
                <Button variant="contained" onClick={() => onActionPerformed()}> {readOnly ? 'OK' : 'Cancel'}</Button>
            </DialogActions>
            <ReceiverDialog receiver={selectedReceiver} open={openReceiverDialog} onClose={() => { setOpenReceiverDialog(false) }} />
        </Dialog>
    );
}

export default MessageDialog;