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
import GroupService from "../../services/GroupService";
import UserInfo from './UserInfo';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider } from "@material-ui/styles";
import MyTheme from '../../controls/MyTheme';
import DeleteIcon from '@mui/icons-material/Delete';
import SelectUserDialog from "./SelectUserDialog";

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
        id: 'role',
        numeric: false,
        disablePadding: false,
        label: 'Role',
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
    const { onActionPerformed, errorMessage, successMessage } = props;

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
                Group users
                {<p style={{ color: "red" }} >{errorMessage}</p>}
                {<p style={{ color: "green" }} >{successMessage}</p>}
            </Typography>

            <Tooltip title="Add user to group">
                <IconButton onClick={onActionPerformed}> <AddBoxIcon color="primary" /></IconButton>
            </Tooltip>
        </Toolbar >
    );
};

EnhancedTableToolbar.propTypes = {
    onActionPerformed: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    successMessage: PropTypes.string.isRequired,
};

const GroupUsersTable = (props) => {

    const group = props.group;

    const [newGroup, setNewGroup] = useState(group.id == 0 ? true : false);

    const id = ReactSession.get('id');

    const navigate = useNavigate();

    useEffect(() => {
        if (id <= 0)
            navigate('/');
    });

    const getGroupUsers = async () => {
        try {

            GroupService.getGroupUsers(group.id)
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
        getGroupUsers();
    }, []);

    const getUsersForAdding = async () => {
        try {

            GroupService.getUsersForAdding(group)
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
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [users, setUsers] = React.useState([]);
    const [usersForAdding, setUsersForAdding] = React.useState([]);
    const [userForAdding, setUserForAdding] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const [selectedUser, setSelectedUser] = React.useState(null);
    const [openUserDialog, setOpenUserDialog] = React.useState(false);
    const [openAddUserDialog, setOpenAddUserDialog] = React.useState(false);

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

    const handleGroupActionPerformed = () => {
        getGroupUsers();
    };

    const handleUserActionPerformed = () => {
        setOpenUserDialog(false);
    };

    const handleAddUserActionPerformed = (user) => {

        setLoading(true);

        let userGroup = {
            user: user,
            group: group,
        }

        GroupService.addUserToGroup(userGroup)
            .then((response) => { actionsAfterResponse(response); })
            .catch((error) => { actionsAfterResponse(error.response); });

    }

    const handleRemoveUserFromGroup = (user) => {

        setLoading(true);

        let userGroup = {
            user: user,
            group: group,
        }

        GroupService.removeUserFromGroup(userGroup)
            .then((response) => { actionsAfterResponse(response); })
            .catch((error) => { actionsAfterResponse(error.response); });
    }

    const actionsAfterResponse = (response) => {

        if (response.status === process.env.REACT_APP_HTTP_STATUS_OK) {
            setSuccessMessage("Action processed successfully!")
        }

        if (response.status == process.env.REACT_APP_HTTP_STATUS_CUSTOM_SERVER_ERROR
            || response.status == process.env.REACT_APP_HTTP_STATUS_CUSTOM_SERVER_ERROR) {
            setErrorMessage(response.data);
        }

        getGroupUsers();
        getUsersForAdding();
        setOpenAddUserDialog(false);
        setLoading(false);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    return (
        <ThemeProvider theme={MyTheme}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <Box sx={{ width: '100%' }}>
                    <Paper variant='outlined' sx={{ width: '100%', mb: 2, borderRadius: '16px' }}>
                        <EnhancedTableToolbar onActionPerformed={handleActionPerformed} errorMessage={errorMessage} successMessage={successMessage} loading={loading} />
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
                                    rowCount={users.length}
                                />
                                <TableBody>
                                    {stableSort(users, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {


                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.id}
                                                >
                                                    <TableCell> {row.email}</TableCell>
                                                    <TableCell >{row.name}</TableCell>
                                                    <TableCell >{row.role.roleType}</TableCell>
                                                    <TableCell ><Button onClick={() => {
                                                        handleRemoveUserFromGroup(row);

                                                    }}> <DeleteIcon /> </Button></TableCell>
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
                            count={users.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <UserInfo user={selectedUser} open={openUserDialog} onClose={handleUserActionPerformed} />
                    </Paper>
                    <SelectUserDialog loading={loading} parentUser={userForAdding} open={openAddUserDialog} onClose={() => { setOpenAddUserDialog(false); }} users={usersForAdding} onActionPerformed={handleAddUserActionPerformed} />
                </Box>
            </div >
        </ThemeProvider>)
}

export default GroupUsersTable;