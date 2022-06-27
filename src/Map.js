import React, {useEffect, useState} from 'react'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import FacilityService from './services/FacilityService';
import AddressResolver from './utils/AddressResolver';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
    width: '700px',
    height: '400px'
};

const center = {
    lat: 42.8,
    lng: 25.5
};

const Map = () => {

    const [locations, setLocations] = useState([]);

    const getLocation = (facility) => {

        return AddressResolver.getFacilityLocation(facility);

    }

    const getFacilities = async () => {
        try {

            FacilityService.getAllShelters()
                .then(
                    response => {
                        let extractedLocations = response.data.map(function (facility) {
                            return getLocation(facility)
                        });
                        setLocations(extractedLocations);
                    }
                )

        } catch (error) {
            setLocations([]);
        }
    };

    useEffect(() => {
        getFacilities();
    }, []);

    return (
        <LoadScript
            googleMapsApiKey={GOOGLE_API_KEY}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={7}
            >
                {locations.map((location, index) => {
                    return (<Marker position={location}/>)

                })}

            </GoogleMap>
        </LoadScript>
    )
}

export default Map;
