import React, { Component } from 'react';

export default class ErrorContainer extends Component{
    render(){
        return (
            <div className="container-row">
                <button className="container-cell" style={{color:"red"}}>{this.props.error}</button>
            </div>
        )
    }
}