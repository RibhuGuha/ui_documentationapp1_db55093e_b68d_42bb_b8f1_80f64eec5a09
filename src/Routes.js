import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "screens/landing_page";
import {
PetCreate, PetEdit, PetView, 
PetList, 
PetCareCenterCreate, PetCareCenterEdit, PetCareCenterView, 
PetCareCenters, 
PetCareCenterTiles, 
PetOwnersSinglePageTable,
PetServiceInfoForm
} from "screens";

const Component = (props) => {

    return (
        <Routes>
            

                                                <Route path="/documentationapp1/html" element={<LandingPage {...props} title={'LandingPage'} nolistbar={true} />} />
                                                        <Route path="Pets/view/:id" element={<PetView {...props} title={'View Pet'} />} />
                        <Route path="Pets/edit/:id" element={<PetEdit {...props} title={'Edit Pet'} />} />
                        <Route path="Pets/create" element={<PetCreate {...props} title={'Create Pet'} />} />
                                            <Route path="PetCareCenters/view/:id" element={<PetCareCenterView {...props} title={'View PetCareCenter'} />} />
                        <Route path="PetCareCenters/edit/:id" element={<PetCareCenterEdit {...props} title={'Edit PetCareCenter'} />} />
                        <Route path="PetCareCenters/create" element={<PetCareCenterCreate {...props} title={'Create PetCareCenter'} />} />
                                                                        <Route path="/" element={<PetCareCenters {...props} title={'Table for PetCareCenter'} nolistbar={true} />} />
                                                                        
                                                                                                                <Route path="/infoforms1" element={<PetServiceInfoForm {...props} title={'Information Form Layout'} />} />
                <Route path="/pcc1" element={<PetCareCenters {...props} title={'Table for PetCareCenter'} />} />
                                                                                                                <Route path="/pccs1/list" element={<PetList {...props} title={'List for Pets'} />} />
                                                                                                                <Route path="/pccs2/tiles" element={<PetCareCenterTiles {...props} title={'Tiles'} />} />
                                                                                                                <Route path="/pccs_singlePageTable1" element={<PetOwnersSinglePageTable {...props} title={'Single Page Table Layout'} />} />
                                                                                                        </Routes>
    )

};

export default Component;
