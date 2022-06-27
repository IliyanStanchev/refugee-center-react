import {Country, State} from 'country-state-city';

class AddressResolver {

    getCountryData(countryCode) {
        let country = Country.getCountryByCode(countryCode);
        return country.name;
    }

    getStateData = (stateCode, countryCode) => {
        let state = State.getStateByCodeAndCountry(stateCode, countryCode);
        return state.name;
    }

    getFacilityData(facility) {

        let facilityCountry = this.getCountryData(facility.address.countryIsoCode);
        let facilityState = this.getStateData(facility.address.stateIsoCode, facility.address.countryIsoCode);
        return facilityCountry + ' / ' + facilityState + ' / ' + facility.address.cityName;
    }

    getFacilityLocation(facility) {
        let facilityState = State.getStateByCodeAndCountry(facility.address.stateIsoCode, facility.address.countryIsoCode);
        return {lat: parseFloat(facilityState.latitude), lng: parseFloat(facilityState.longitude)};

    }
}

export default new AddressResolver;