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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { visuallyHidden } from '@mui/utils';
import { Button, Grid, LinearProgress, Link } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import GroupService from "../../services/GroupService";
import UserInfo from './UserInfo';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GroupDialog from './GroupDialog';
import { ThemeProvider } from "@material-ui/styles";
import MyTheme from './../../controls/MyTheme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
        id: 'responsibleUser',
        numeric: false,
        disablePadding: false,
        label: 'Responsible Person',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Group Email',
    },
    {
        id: 'groupType',
        numeric: false,
        disablePadding: false,
        label: 'Group Type',
    },
    {
        id: 'creationDate',
        numeric: false,
        disablePadding: false,
        label: 'Creation Date',
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
                Groups
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
            <Tooltip title="Add new group">
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

const Groups = () => {

    const id = ReactSession.get('id');

    const navigate = useNavigate();

    const getGroups = async () => {
        try {

            GroupService.getAllGroups()
                .then(
                    response => {
                        setGroups(response.data);
                    }
                )

        } catch (error) {
            setGroups([]);
        }
    };

    useEffect(() => {
        getGroups();
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [groups, setGroups] = React.useState([]);

    const [openGroupDialog, setOpenGroupDialog] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const [selectedUser, setSelectedUser] = React.useState(null);
    const [openUserDialog, setOpenUserDialog] = React.useState(false);

    const [newGroup, setNewGroup] = React.useState({
        id: 0,
        email: '@safe_shelter.com'
        , groupType: 'COMMON'
        , responsibleUser: null
        , groupUsers: []
    });

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

        setSelectedGroup(newGroup);
        setOpenGroupDialog(true);
    };

    const handleGroupActionPerformed = () => {

        getGroups();
        setOpenGroupDialog(false);
    };

    const handleUserActionPerformed = () => {
        setOpenUserDialog(false);
    };

    const handleOpenUserDialog = (user) => {

        setSelectedUser(user);
        setOpenUserDialog(true);
    };

    const handleDeleteGroup = (group) => {

        setLoading(true);
        setErrorMessage('');
        GroupService.deleteGroup(group.id)
            .then(
                response => {
                    getGroups();
                    setLoading(false);
                }
            )
            .catch(error => {
                setLoading(false);
                setErrorMessage(error.data);
            });
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - groups.length) : 0;

    return (
        <ThemeProvider theme={MyTheme}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <Box sx={{ width: '80%' }}>
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
                                    rowCount={groups.length}
                                />
                                <TableBody>
                                    {stableSort(groups, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {


                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.id}
                                                >
                                                    <TableCell>
                                                        <Link component="button" onClick={() => { handleOpenUserDialog(row.responsibleUser) }} underline="hover">
                                                            {row.responsibleUser.name}

                                                        </Link>
                                                    </TableCell>
                                                    <TableCell >{row.email}</TableCell>
                                                    <TableCell >{row.groupType}</TableCell>
                                                    <TableCell >{new Date(row.creationDate).toLocaleDateString("en-US", options)}</TableCell>
                                                    <TableCell >
                                                        <Tooltip title="Edit group">
                                                            <Button onClick={() => {
                                                                setSelectedGroup(row);
                                                                setOpenGroupDialog(true);
                                                            }}> <EditIcon /> </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Remove group">
                                                            <Button onClick={() => {
                                                                handleDeleteGroup(row);
                                                            }}> <DeleteIcon /> </Button>
                                                        </Tooltip></TableCell>
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
                            count={groups.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <UserInfo user={selectedUser} open={openUserDialog} onClose={handleUserActionPerformed} />
                        <GroupDialog selectedGroup={selectedGroup} open={openGroupDialog} onActionPerformed={handleGroupActionPerformed} readOnly={false} />
                    </Paper>
                </Box>
            </div >
        </ThemeProvider>
    );
}

export default Groups;