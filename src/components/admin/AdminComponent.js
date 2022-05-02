import React, { Component, useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

const AdminComponent = () => {

    const [locationKeys, setLocationKeys] = useState([]);

    const navigate = useNavigate();

    const location = useLocation();

    return (
        <div>
            {(location && location.state && location.state.id) ? (<div>{location.state.id}</div>) : (<Navigate to="/" />)}
        </div>
    );

}

export default AdminComponent