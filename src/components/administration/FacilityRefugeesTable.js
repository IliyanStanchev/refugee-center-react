import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import PropTypes from 'prop-types';
import AddBoxIcon from '@mui/icons-material/AddBox';
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
import { visuallyHidden } from '@mui/utils';
import { Button, Grid, LinearProgress, Link } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider } from "@material-ui/styles";
import MyTheme from '../../controls/MyTheme';
import RefugeeService from "../../services/RefugeeService";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import SelectUserDialog from './SelectUserDialog';

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
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'identifier',
        numeric: false,
        disablePadding: false,
        label: 'Identifier',
    },
    {
        id: 'age',
        numeric: true,
        disablePadding: false,
        label: 'Age',
    },
    {
        id: 'actions',
        numeric: false,
        disablePadding: false,
    }
];

const options = { year: 'numeric', month: 'long', day: 'numeric' };

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
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
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const { onActionPerformed, errorMessage, loading } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Refugees
            </Typography>
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
            {<p style={{ color: "red" }} >{errorMessage}</p>}
            <Tooltip title="Add refugee to shelter">
                <IconButton onClick={onActionPerformed}> <AddBoxIcon color="primary" /></IconButton>
            </Tooltip>
        </Toolbar >
    );
};

EnhancedTableToolbar.propTypes = {
    onActionPerformed: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
};

const FacilityRefugeesTable = (props) => {

    const { shelterId } = props;

    const id = ReactSession.get('id');

    const navigate = useNavigate();

    useEffect(() => {
        if (id <= 0)
            navigate('/');
    });

    const getRefugees = async () => {
        try {

            RefugeeService.getRefugeesInShelter(shelterId)
                .then(
                    response => {
                        setRefugees(response.data);
                    }
                )

        } catch (error) {
            setRefugees([]);
        }
    };

    useEffect(() => {
        getRefugees();
    }, []);

    const getUsersForAdding = async () => {
        try {

            RefugeeService.getUsersWithoutShelter()
                .then(
                    response => {
                        let extractedUsers = response.data?.map(({ user }) => ({
                            user
                        }));
                        setUsersForAdding(extractedUsers);
                    }
                )

        } catch (error) {
            setUsersForAdding([]);
        }
    };

    useEffect(() => {
        getUsersForAdding();
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('type');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [refugees, setRefugees] = React.useState([]);

    const [selectedRefugee, setSelectedRefugee] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [openAddUserDialog, setOpenAddUserDialog] = React.useState(false);
    const [openRefugeeDialog, setOpenRefugeeDialog] = React.useState(false);

    const [usersForAdding, setUsersForAdding] = React.useState([]);

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
        setOpenAddUserDialog(true);
    };

    const handleRefugeeActionPerformed = () => {
        getRefugees();
        setOpenAddUserDialog(false);
    };

    const handleAddUserActionPerformed = (user) => {

        setLoading(true);
        setErrorMessage('');

        try {
            RefugeeService.addRefugeeToShelter(user.id, shelterId)
                .then(
                    response => {
                        getRefugees();
                        getUsersForAdding();
                        setLoading(false);
                        setOpenAddUserDialog(false);
                    }
                )
                .catch(error => {
                    setLoading(false);
                    setErrorMessage(error.response.data);
                });
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.response.data);
        }
    };

    const handleRemoveFromShelter = (refugee) => {

        setLoading(true);
        setErrorMessage('');
        try {
            RefugeeService.removeRefugeeFromShelter(refugee.id)
                .then(
                    response => {
                        getRefugees();
                        getUsersForAdding();
                    }
                )
        } catch (error) {
            setErrorMessage(error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - refugees.length) : 0;

    return (
        <ThemeProvider theme={MyTheme}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%' }}>
                    <Paper variant='outlined' sx={{ width: '100%', mb: 2, borderRadius: '16px' }}>
                        <EnhancedTableToolbar onActionPerformed={handleActionPerformed} errorMessage={errorMessage} loading={loading} />
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={'medium'}
                            >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={refugees.length}
                                />
                                <TableBody>
                                    {stableSort(refugees, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {


                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.id}
                                                >
                                                    <TableCell> {row.user.email}  </TableCell>
                                                    <TableCell >{row.user.name}</TableCell>
                                                    <TableCell >{row.user.identifier}</TableCell>
                                                    <TableCell >{row.age}</TableCell>
                                                    <TableCell >
                                                        <Tooltip title="View details">
                                                            <Button onClick={() => {
                                                                setSelectedRefugee(row);
                                                                setOpenRefugeeDialog(true);
                                                            }}> <OpenInNewIcon /> </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Remove from shelter">
                                                            <Button onClick={() => {
                                                                handleRemoveFromShelter(row);
                                                            }}> <DeleteIcon /> </Button>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: (53) * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={refugees.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
                <SelectUserDialog loading={loading} open={openAddUserDialog} onClose={() => { setOpenAddUserDialog(false); }} users={usersForAdding} onActionPerformed={handleAddUserActionPerformed} />
            </div >
        </ThemeProvider>
    );
}

export default FacilityRefugeesTable;