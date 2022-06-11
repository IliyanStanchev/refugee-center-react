import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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
import { visuallyHidden } from '@mui/utils';
import { Button, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import MessageService from "../../services/MessageService";
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import MessageDialog from "./MessageDialog";
import SendIcon from '@mui/icons-material/Send';
import InboxIcon from '@mui/icons-material/Inbox';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import RequestService from "../../services/RequestService";

const STOCKS_MODE = 0;
const LOCATION_CHANGE_MODE = 1;
const MEDICAL_HELP_MODE = 2;

const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };

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
        id: 'type',
        numeric: false,
        disablePadding: true,
    },
    {
        id: 'description',
        numeric: false,
        disablePadding: true,
        label: 'Description',
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Request date',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick
        , order
        , orderBy
        , numSelected
        , rowCount
        , onRequestSort
        , requestMode } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {requestMode != MEDICAL_HELP_MODE && <TableCell padding="checkbox" >

                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all mails',
                        }}
                    />
                </TableCell>}
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

const EnhancedTableToolbar = (props) => {
    const { selected
        , numSelected
        , onActionPerformed
        , onStockRequestClicked
        , onLocationChangeRequestClicked
        , onMedicalRequestClicked
        , requestMode } = props;


    const handleDeclineSelected = () => {

        if (requestMode === STOCKS_MODE) {

            RequestService.declineStockRequests(selected).then(() => {
                onActionPerformed();
            });
        }
        else if (requestMode === LOCATION_CHANGE_MODE) {
            RequestService.declineLocationChangeRequests(selected).then(() => {
                onActionPerformed();
            });
        }
        else if (requestMode === MEDICAL_HELP_MODE) {
            RequestService.declineMedicalHelpRequests(selected).then(() => {
                onActionPerformed();
            });
        }
    };

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 && requestMode != MEDICAL_HELP_MODE ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    <ToggleButtonGroup value={requestMode} color="primary">
                        <ToggleButton value={STOCKS_MODE} onClick={onStockRequestClicked} > <InventoryIcon color='primary' sx={{ mr: 2 }} /> Stock requests </ToggleButton>
                        <ToggleButton value={LOCATION_CHANGE_MODE} onClick={onLocationChangeRequestClicked}> <EditLocationAltIcon color='primary' sx={{ mr: 2 }} /> Location change requests </ToggleButton>
                        <ToggleButton value={MEDICAL_HELP_MODE} onClick={onMedicalRequestClicked}> <MedicalServicesIcon color='primary' sx={{ mr: 2 }} /> Medical help request </ToggleButton>
                    </ToggleButtonGroup>
                </Typography>
            )}
            {numSelected > 0 && requestMode != MEDICAL_HELP_MODE ? (
                <Grid container sx={{
                    justifyContent: 'flex-end',
                }} >
                    <Tooltip title="Decline all">
                        <IconButton onClick={() => { handleDeclineSelected() }}> <DeleteIcon color="primary" /></IconButton>
                    </Tooltip>
                </Grid>
            ) : (null)
            }
        </Toolbar >
    );
};

const Requests = () => {

    const id = ReactSession.get('id');

    const getStockRequests = async () => {
        try {

            RequestService.getStockRequests(id)
                .then(
                    response => {
                        setRequests(response.data);
                    }
                )

        } catch (error) {
            setRequests([]);
        }
    };

    useEffect(() => {
        getStockRequests();
    }, []);

    const getLocationChangeRequests = async () => {
        try {

            RequestService.getLocationChangeRequests(id)
                .then(
                    response => {
                        setRequests(response.data);
                    }
                )

        } catch (error) {
            setRequests([]);
        }
    };

    useEffect(() => {
        getLocationChangeRequests();
    }, []);

    const getMedicalHelpRequests = async () => {
        try {

            RequestService.getMedicalHelpRequests(id)
                .then(
                    response => {
                        setRequests(response.data);
                    }
                )

        } catch (error) {
            setRequests([]);
        }
    };

    useEffect(() => {
        getMedicalHelpRequests();
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [requests, setRequests] = React.useState([]);
    const [requestMode, setRequestMode] = React.useState(MEDICAL_HELP_MODE);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = requests.filter(n => n.requestStatus === 'Pending').map(n => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {

        if (row.requestStatus != 'Pending')
            return;

        if (requestMode === MEDICAL_HELP_MODE)
            return;

        const selectedIndex = selected.indexOf(row.id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row.id);
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

        if (requestMode === STOCKS_MODE) {

            getStockRequests();
        }
        else if (requestMode === LOCATION_CHANGE_MODE) {
            getLocationChangeRequests();
        }
        else if (requestMode === MEDICAL_HELP_MODE) {
            getMedicalHelpRequests();
        }
    };

    const handleStockRequestClicked = () => {

        getStockRequests();
        setRequestMode(STOCKS_MODE);
    };

    const handleMedicalHelpRequestClicked = () => {

        getMedicalHelpRequests();
        setRequestMode(MEDICAL_HELP_MODE);
    };

    const handleLocationChangeRequestClicked = () => {

        getLocationChangeRequests();
        setRequestMode(LOCATION_CHANGE_MODE);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - requests.length) : 0;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <Box sx={{ width: '80%' }}>
                <Paper variant='outlined' sx={{ width: '100%', mb: 2, borderRadius: '16px' }}>
                    <EnhancedTableToolbar
                        selected={selected}
                        numSelected={selected.length}
                        onActionPerformed={handleActionPerformed}
                        onStockRequestClicked={handleStockRequestClicked}
                        onLocationChangeRequestClicked={handleLocationChangeRequestClicked}
                        onMedicalRequestClicked={handleMedicalHelpRequestClicked}
                        requestMode={requestMode} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={requests.length}
                                requestMode={requestMode} />

                            <TableBody>
                                {stableSort(requests, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                sx={{
                                                    backgroundColor: row.requestStatus != 'Pending' ? "#f5f5f5" : "white"
                                                    , "& th": row.requestStatus != 'Pending' ? {} : {
                                                        fontSize: "1.10rem",
                                                    }
                                                }}
                                                onClick={(event) => handleClick(event, row)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                {requestMode != MEDICAL_HELP_MODE && <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>}
                                                <TableCell > {requestMode === STOCKS_MODE ? <InventoryIcon color="primary" /> : requestMode === LOCATION_CHANGE_MODE ? <EditLocationAltIcon color="primary" /> : <MedicalServicesIcon color="primary" />}  </TableCell>
                                                <TableCell component="th">{row.description}</TableCell>
                                                <TableCell component="th">{new Date(row.dateCreated).toLocaleString("en-US", options)}</TableCell>
                                                <TableCell component="th">{row.requestStatus}</TableCell>
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
                        count={requests.length}
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

export default Requests;