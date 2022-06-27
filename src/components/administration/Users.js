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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {visuallyHidden} from '@mui/utils';
import {Button, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import RefugeeService from "../../services/RefugeeService";
import CircularProgress from '@mui/material/CircularProgress';
import {green} from '@mui/material/colors';
import UserService from "../../services/UserService";
import SearchIcon from '@mui/icons-material/Search';
import UserCheckDialog from "./UserCheckDialog";
import RefugeeCheckDialog from './RefugeeCheckDialog';

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
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'identifier',
        numeric: false,
        disablePadding: false,
        label: 'Identifier',
    },
    {
        id: 'roleType',
        numeric: false,
        disablePadding: false,
        label: 'Role',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'actions',
        numeric: false,
        disablePadding: false,
    }
];

function EnhancedTableHead(props) {
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
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
    const {selected, numSelected, onActionPerformed} = props;

    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const handleApproveSelected = () => {
        setLoading(true);

        RefugeeService.approvePendingRegistrations(selected)
            .then((response) => {
                handleResponse(response);
            })
            .catch((error) => {
                handleError(error)
            });
    };

    const handleDeleteSelected = () => {
        setLoading(true);

        RefugeeService.deletePendingRegistrations(selected)
            .then((response) => {
                handleResponse(response);
            })
            .catch((error) => {
                handleError(error)
            });
    };

    const handleResponse = (response) => {

        setErrorMessage(null);

        if (response.status != process.env.REACT_APP_HTTP_STATUS_OK) {
            setErrorMessage("Something went wrong, please try again later");
        }

        setLoading(false);
        onActionPerformed();
    };

    const handleError = (error) => {
        setErrorMessage(null);

        setErrorMessage("Something went wrong, please try again later");
        setLoading(false);
        onActionPerformed();
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
                    Users
                </Typography>
            )}
            {loading && (
                <CircularProgress
                    size={60}
                    sx={{
                        color: green[500],
                        position: 'center',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                    }}
                />
            )}
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
            {numSelected > 0 ? (
                <Grid container sx={{
                    justifyContent: 'flex-end',
                }}>
                    <Tooltip title="Approve selected">
                        <IconButton onClick={handleApproveSelected}> <HowToRegIcon color='primary'/></IconButton>
                    </Tooltip>
                    <Tooltip title="Decline selected">
                        <IconButton onClick={handleDeleteSelected}> <DeleteIcon color='primary'/></IconButton>
                    </Tooltip>
                </Grid>
            ) : (
                <div></div>
            )
            }
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    selected: PropTypes.array.isRequired,
    numSelected: PropTypes.number.isRequired,
    onActionPerformed: PropTypes.func.isRequired,
};

const Users = () => {

    const id = ReactSession.get('id');

    const getUsers = async () => {

        setEmail('');
        try {

            UserService.getUsers(id)
                .then(
                    response => {
                        setPendingRegistrations(response.data);
                    }
                )

        } catch (error) {
            setPendingRegistrations([]);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('email');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [pendingRegistrations, setPendingRegistrations] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleActionPerformed = () => {
        setUser(null);
        setSelected([]);
        getUsers();
        setOpen(false);
    };

    const doFilter = () => {

        if (email.length <= 0)
            return;

        setLoading(true);
        UserService.getUsersFiltered(id, email)
            .then(response => {
                    setPendingRegistrations(response.data);
                    setLoading(false);
                }
            );
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pendingRegistrations.length) : 0;

    return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
            <Box sx={{width: '80%'}}>
                <Paper variant='outlined' sx={{width: '100%', mb: 2, borderRadius: '16px'}}>
                    <EnhancedTableToolbar selected={selected} numSelected={selected.length}
                                          onActionPerformed={handleActionPerformed}/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <FormControl variant="outlined" fullWidth sx={{width: '97%', mt: 2, mb: 2}}>
                            <InputLabel htmlFor="outlined-adornment-email"> Search email </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email"
                                type='text'
                                value={email}
                                onChange={(e) => {
                                    e.target.value.length <= 0 ? getUsers() : setEmail(e.target.value)
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Search email"
                                            onClick={() => doFilter()}
                                            edge="end"
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Search email"
                            />
                        </FormControl>
                    </div>
                    <TableContainer>
                        <Table
                            sx={{minWidth: 750}}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={pendingRegistrations.length}
                            />
                            <TableBody>
                                {stableSort(pendingRegistrations, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                            >
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.identifier}</TableCell>
                                                <TableCell>{row.role.roleType}</TableCell>
                                                <TableCell>{row.accountStatus.accountStatusType}</TableCell>
                                                <TableCell><Button onClick={() => {
                                                    setOpen(true);
                                                    setUser(row)
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
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={pendingRegistrations.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    {user == null ? null : user.role.roleType == process.env.REACT_APP_CUSTOMER ?
                        <RefugeeCheckDialog open={open} id={user && user.id} onAction={handleActionPerformed}/> :
                        <UserCheckDialog open={open} id={user && user.id} onAction={handleActionPerformed}/>}
                </Paper>
            </Box>
        </div>
    );
}

export default Users;