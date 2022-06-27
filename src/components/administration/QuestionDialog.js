import React, {useState} from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {Box, Button, CircularProgress, Dialog, DialogActions} from "@mui/material";
import TextField from '@mui/material/TextField';
import {green, red} from "@mui/material/colors";
import QuestionService from "../../services/QuestionService";
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const QuestionDialog = (props) => {

    let {question, open, onActionPerformed} = props;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [answer, setAnswer] = useState('');
    const [answerError, setAnswerError] = useState(false);

    const handleAnswerQuestion = () => {

        setAnswerError(false);

        if (answer === 0) {
            setAnswerError(true);
            return;
        }

        setLoading(true);
        setErrorMessage('');

        question.answer = answer;

        QuestionService.answerQuestion(question)
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

    const handleCancel = () => {

        QuestionService.freeQuestion(question.id)
            .then(response => {
                onActionPerformed()
            });
    }

    const handleSuccess = () => {

        setAnswer('');
        setLoading(false);
        onActionPerformed();
    };

    return (
        <Dialog sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            textAlign: 'center',
        }}
                fullWidth
                maxWidth="md" open={open} onClose={() => handleCancel()}>
            {loading && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress
                        size={40}
                        sx={{
                            color: green[500],
                            mt: 1,
                        }}
                    />
                </div>
            )}
            <Box>
                <HelpCenterIcon color='primary' fontSize="100%"/>
                <DialogTitle> Question </DialogTitle>
                {<p style={{color: red[500]}}>{errorMessage}</p>}
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={question && question.email}
                        type="text"
                        variant="outlined"
                        name="email"
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={question && question.name}
                        type="text"
                        variant="outlined"
                        name="name"
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="message"
                        label="Message"
                        multiline
                        minRows={4}
                        InputProps={{
                            readOnly: true,
                        }}
                        value={question && question.message}
                        type="text"
                        variant="outlined"
                        name="message"
                    />
                    <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Your answer"
                        value={answer}
                        type="text"
                        variant="outlined"
                        name="answer"
                        onChange={(event) => {
                            setAnswer(event.target.value);
                        }}
                        error={answerError}
                        helperText={answerError ? 'You have to answer the question' : ''}
                    />
                </DialogContent>
            </Box>
            <DialogActions>
                <Button variant="contained" onClick={handleAnswerQuestion}> Answer Question </Button>
                <Button variant="contained" onClick={handleCancel}> Cancel </Button>
            </DialogActions>
        </Dialog>
    );
}

export default QuestionDialog;