import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';

const Donations = () => {

    const id = ReactSession.get('id');

    const navigate = useNavigate();

    useEffect(() => {
        if (id <= 0)
            navigate('/');
    });

    return (
        <div>
            Donations
            Donations
            Donations
            Donations
            Donations
            Donations
            Donations
            Donations
            Donations
            Donations
            Donations

        </div>
    );

}

export default Donations