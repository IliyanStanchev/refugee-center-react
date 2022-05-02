import React from "react";
function Footer() {
    return (
        <div className="main-footer">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h3>Contact us</h3>
                        <br></br>
                        <ui className="list-unstyled">
                            <li>Email:      safe_shelter@sshelter.com </li>
                            <li>Phone:      +359 08982231</li>
                        </ui>
                    </div>
                    <div className="col">
                        <h3>Address</h3>
                        <ui className="list-unstyled">
                            <li>Varna 9000</li>
                            <li>Gotse Delchev 9</li>
                            <li>Office open 9am - 5pm Monday - Friday</li>
                        </ui>
                    </div>
                    <div className="col">
                        <h4>&copy;{new Date().getFullYear()} Safe Shelter</h4>
                        <ui className="list-unstyled">
                            <li>All rights reserved</li>
                        </ui>
                    </div>
                </div>
                <hr />
                <div className="row">
                </div>
            </div>
        </div>
    );
}

export default Footer;