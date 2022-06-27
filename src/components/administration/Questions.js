import React, {useEffect} from "react";
import {ReactSession} from 'react-client-session';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {visuallyHidden} from '@mui/utils';
import {Button, Grid} from "@mui/material";
import QuestionService from "../../services/QuestionService";
import QuestionDialog from './QuestionDialog';

const options = {year: 'numeric', month: 'long', day: 'numeric'};

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    {
        id: 'email',
        numeric: false,
        disablePadding: true,
        label: 'Sender',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Date received',
    },
    {
        id: 'actions',
        numeric: false,
        disablePadding: false,
    }
];

function EnhancedTableHead(props) {
    const {
        onSelectAllClick
        , order
        , orderBy
        , numSelected
        , rowCount
        , onRequestSort
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">

                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all mails',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const {
        selected
        , numSelected
        , onActionPerformed
    } = props;

    const handleDeleteSelected = () => {

        QuestionService.deleteSelectedQuestions(selected).then(() => {
            onActionPerformed();
        });
    };

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >

                </Typography>
            )}
            {numSelected > 0 && (
                <Grid container sx={{
                    justifyContent: 'flex-end',
                }}>
                    <Tooltip title="Delete selected">
                        <IconButton onClick={() => {
                            handleDeleteSelected()
                        }}> <DeleteIcon color="primary"/></IconButton>
                    </Tooltip>
                </Grid>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    selected: PropTypes.array.isRequired,
    numSelected: PropTypes.number.isRequired,
    onActionPerformed: PropTypes.func.isRequired,
    onNewMailClicked: PropTypes.func.isRequired,
    onSendMessagesClicked: PropTypes.func.isRequired,
    onReceivedMessagesClicked: PropTypes.func.isRequired,
};

const Questions = () => {

    const id = ReactSession.get('id');

    const getQuestions = async () => {
        try {

            QuestionService.getQuestions()
                .then(
                    response => {
                        setQuestions(response.data);
                    }
                )

        } catch (error) {
            setQuestions([]);
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [questions, setQuestions] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(false);

    const [question, setQuestion] = React.useState({
        id: 0,
        message: {
            id: 0
            , sender: {id: id}
            , messageType: 'Informative'
            , subject: ''
            , content: ''

        }, receivers: [],
    });

    const setAsSeen = async (questionId) => {

        QuestionService.setAsReserved(questionId);

    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = questions.map((refugee) => refugee.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {

        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleActionPerformed = () => {
        setSelected([]);
        getQuestions();
        setOpen(false);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questions.length) : 0;

    return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
            <Box sx={{width: '80%'}}>
                <Paper variant='outlined' sx={{width: '100%', mb: 2, borderRadius: '16px'}}>
                    <EnhancedTableToolbar
                        selected={selected}
                        numSelected={selected.length}
                        onActionPerformed={handleActionPerformed}/>
                    <TableContainer>
                        <Table
                            sx={{minWidth: 750}}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={questions.length}

                            />
                            <TableBody>
                                {stableSort(questions, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                sx={{
                                                    backgroundColor: "white"
                                                    , "& th": {
                                                        fontSize: "1.10rem",
                                                        fontWeight: "bold",
                                                    }
                                                }}
                                                onClick={(event) => handleClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.email}
                                                </TableCell>
                                                <TableCell component="th">{row.name}</TableCell>
                                                <TableCell
                                                    component="th">{new Date(row.dateReceived).toLocaleString("en-US", options)}</TableCell>
                                                <TableCell component="th"><Button onClick={() => {
                                                    setAsSeen(row.id);
                                                    setOpen(true);
                                                    setQuestion(row);
                                                }}> <OpenInNewIcon/> </Button></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <QuestionDialog open={open} question={question} onActionPerformed={handleActionPerformed}
                                        readOnly={readOnly}/>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={questions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </div>
    );
}

export default Questions;