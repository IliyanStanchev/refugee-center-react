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
import MyTheme from './../../controls/MyTheme';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FacilityService from "../../services/FacilityService";
import FacilityDialog from './FacilityDialog';
import UserInfo from './UserInfo';
import AddressResolver from './../../utils/AddressResolver';
import AddFacilityDialog from './AddFacilityDialog';

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
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Responsible user',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Facility type',
    },
    {
        id: 'address',
        numeric: false,
        disablePadding: false,
        label: 'Address',
    },
    {
        id: 'capacity',
        numeric: false,
        disablePadding: false,
        label: 'Capacity ( % )',
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
                Facilities
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
            <Tooltip title="Register facility">
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

const Facilities = () => {

    let newFacility = {
        id: 0,
        facilityType: 'OTHER',
        name: '',
        quantity: 1,
        unit: 'COUNT',
    }

    const navigate = useNavigate();

    const getFacilities = async () => {
        try {

            FacilityService.getAllFacilities()
                .then(
                    response => {
                        setFacilities(response.data);
                    }
                )

        } catch (error) {
            setFacilities([]);
        }
    };

    useEffect(() => {
        getFacilities();
    }, []);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [facilitys, setFacilities] = useState([]);

    const [selectedFacility, setSelectedFacility] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openFacilityDialog, setOpenFacilityDialog] = useState(false);
    const [readOnly, setReadOnly] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openAddFacilityDialog, setOpenAddFacilityDialog] = useState(false);

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
        setOpenAddFacilityDialog(true);
    };

    const handleFacilityActionPerformed = () => {

        getFacilities();
        setOpenFacilityDialog(false);
        setOpenAddFacilityDialog(false);
    };

    const getAddress = (facility) => {

        return AddressResolver.getFacilityData(facility);
    }

    const calculateCapacity = (facility) => {

        return (facility.currentCapacity / facility.maxCapacity) * 100;
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - facilitys.length) : 0;

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
                                    rowCount={facilitys.length}
                                />
                                <TableBody>
                                    {stableSort(facilitys, getComparator(order, orderBy))
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
                                                        <Link component="button" onClick={() => {
                                                            setSelectedUser(row.responsibleUser);
                                                            setOpenUserDialog(true);
                                                        }} underline="hover">
                                                            {row.responsibleUser.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell >{row.facilityType}</TableCell>
                                                    <TableCell >{getAddress(row)}</TableCell>
                                                    <TableCell >{calculateCapacity(row)}</TableCell>
                                                    <TableCell >
                                                        <Tooltip title="View details">
                                                            <Button onClick={() => {
                                                                setSelectedFacility(row);
                                                                setOpenFacilityDialog(true);
                                                                setReadOnly(true);
                                                            }}> <OpenInNewIcon /> </Button>
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
                            count={facilitys.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <UserInfo user={selectedUser} open={openUserDialog} onClose={() => { setOpenUserDialog(false); }} />
                        <FacilityDialog facility={selectedFacility} open={openFacilityDialog} onClose={handleFacilityActionPerformed} viewMode={false} />
                        <AddFacilityDialog open={openAddFacilityDialog} onClose={handleFacilityActionPerformed} />
                    </Paper>
                </Box>
            </div >
        </ThemeProvider>
    );
}

export default Facilities;