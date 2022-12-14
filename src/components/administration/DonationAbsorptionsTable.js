import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
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
import {visuallyHidden} from '@mui/utils';
import {Button} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import {green} from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {ThemeProvider} from "@material-ui/styles";
import MyTheme from '../../controls/MyTheme';
import EditIcon from '@mui/icons-material/Edit';
import DonationAbsorptionService from "../../services/DonationAbsorptionService";
import DonationAbsorptionDialog from './DonationAbsorptionDialog';

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
        disablePadding: false,
        label: 'Donation type',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'Quantity',
    },
    {
        id: 'intake',
        numeric: false,
        disablePadding: false,
        label: 'Absorption/24',
    },
    {
        id: 'actions',
        numeric: false,
        disablePadding: false,
    }
];

const options = {year: 'numeric', month: 'long', day: 'numeric'};

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
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const {onActionPerformed, errorMessage, loading} = props;

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
            }}
        >
            <Typography
                sx={{flex: '1 1 100%'}}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Donations
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
            {<p style={{color: "red"}}>{errorMessage}</p>}
            <Tooltip title="Register donation">
                <IconButton onClick={onActionPerformed}> <AddBoxIcon color="primary"/></IconButton>
            </Tooltip>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    onActionPerformed: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
};

const DonationAbsorptionsTable = (props) => {

    const shelterId = props.shelterId;

    const navigate = useNavigate();

    const getDonations = async () => {
        try {

            DonationAbsorptionService.getDonationAbsorptions(shelterId)
                .then(
                    response => {
                        setDonations(response.data);
                    }
                )

        } catch (error) {
            setDonations([]);
        }
    };

    useEffect(() => {
        getDonations();
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('type');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [donations, setDonations] = React.useState([]);

    const [selectedDonation, setSelectedDonation] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [openDonationDialog, setOpenDonationDialog] = React.useState(false);

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

        let newDonation = {
            id: 0,
            donation: null,
            facility: {
                id: shelterId,
            },
            absorption: 0
        };

        setSelectedDonation(newDonation);
        setOpenDonationDialog(true);
    };

    const handleDonationActionPerformed = () => {

        getDonations();
        setOpenDonationDialog(false);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - donations.length) : 0;

    return (
        <ThemeProvider theme={MyTheme}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{width: '100%'}}>
                    <Paper variant='outlined' sx={{width: '100%', mb: 2, borderRadius: '16px'}}>
                        <EnhancedTableToolbar onActionPerformed={handleActionPerformed} errorMessage={errorMessage}
                                              loading={loading}/>
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
                                    rowCount={donations.length}
                                />
                                <TableBody>
                                    {stableSort(donations, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {


                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.id}
                                                >
                                                    <TableCell> {row.donation.donationType}  </TableCell>
                                                    <TableCell>{row.donation.name}</TableCell>
                                                    <TableCell>{row.donation.quantity + ' ' + row.donation.unit}</TableCell>
                                                    <TableCell>{row.absorption}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Edit absorption">
                                                            <Button onClick={() => {
                                                                setSelectedDonation(row);
                                                                setOpenDonationDialog(true);
                                                            }}> <EditIcon/> </Button>
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
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={donations.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <DonationAbsorptionDialog shelterId={shelterId} donation={selectedDonation}
                                                  open={openDonationDialog} onClose={handleDonationActionPerformed}/>
                    </Paper>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default DonationAbsorptionsTable;