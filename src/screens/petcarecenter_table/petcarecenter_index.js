
import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Container from "screens/container";
import { DataTable } from '../childs';
import * as Api from "shared/services";

import { SearchInput, ToggleButtons, CustomDialog } from "components";
import Helper from "shared/helper";
import { Add as AddBoxIcon } from '@mui/icons-material';

const columns = [
    { headerName: "PcId", field: "PcId", flex: 1 },
    { headerName: "Address", field: "Address", flex: 1 },
    { headerName: "Name", field: "Name", flex: 1 },
    { headerName: "Description", field: "Description", flex: 1 },
    { headerName: "BranchName", field: "BranchName", flex: 1 },
    { headerName: "Latitude", field: "Latitude", flex: 1 },
];

const defaultError = "Something went wroing while creating record!";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletedId, setDeletedId] = useState(0);

    const NavigateTo = useNavigate();

    const FetchResults = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);
        setDeletedId(0);
        setShowConfirm(false);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(Name, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await Api.GetPetCareCentersCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                } else {
                    console.log(res.statusText);
                }
            });

        if (!Helper.IsJSONEmpty(sortBy)) {
            filters.push(`$orderby=${sortBy.field} ${sortBy.sort}`);
        }

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [];


        await Api.GetPetCareCentersMulti(query, "")
            .then(async (res) => {
                if (res.status) {
                    _rows = res.values || [];
                    if (_rows.length > 0) {
                        _rows.forEach(x => {
                            x.id = Helper.GetGUID();
                        });
                    }
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        global.Busy(false);
        return _rows;
    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const OnDeleteClicked = (e) => { setDeletedId(e); }

    const OnCloseClicked = async (e) => {
        if (e) {
            const rslt = await Api.SetPetCareCenterSingle({ PcId: deletedId, Deleted: true });
            if (rslt.status) {
                setInitialize(true);
                global.AlertPopup("success", "Record is deleted successful.!");
            } else {
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
            }
        } else {
            setDeletedId(0);
            setShowConfirm(false);
        }
    }

    const OnActionClicked = (id, type) => {
        let _route;
        if (type === 'edit') _route = `/PetCareCenters/edit/${id}`;
        if (type === 'view') _route = `/PetCareCenters/view/${id}`;
        if (type === 'delete') setDeletedId(id);;
        if (_route) NavigateTo(_route);
    }

    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    useEffect(() => { if (deletedId > 0) setShowConfirm(true); }, [deletedId]);

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%', paddingBottom: 5 }}>
                    <Typography noWrap variant="subheader" component="div">
                        {title}
                    </Typography>
                    <Stack direction="row">
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                            <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="Add"
                                sx={{
                                    marginLeft: "2px",
                                    borderRadius: "4px",
                                    border: theme.borderBottom
                                }}
                                onClick={() => NavigateTo("/PetCareCenters/create")}
                            >
                                <AddBoxIcon />
                            </IconButton>
                        </Grid>
                    </Stack>
                </Box>
                <Box style={{ width: '100%' }}>
                    <DataTable keyId={'PcId'} columns={columns} rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                        onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
                </Box>
                <CustomDialog open={showConfirm} action={'delete'} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>
            </Container>
        </>

    );

};

export default Component;
