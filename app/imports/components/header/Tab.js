import React, { Component } from 'react';

export default class Tab extends Component{
    render(){
        return (
            <div className="header-tab">{this.props.tab.name}</div>
        )
    }
}