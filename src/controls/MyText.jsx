import React, { Component } from 'react';
import env from 'react-dotenv';

export default class MyText extends Component {
    render() {
        return (
            <p style={{
                marginBottom: '12px',
                fontSize: 28,
                color: env.MAIN_COLOR
            }
            }>
                {this.props.children}
            </p >
        );
    }
}