import React, { Component } from 'react';
import Tab from './Tab.js'

export default class Header extends Component{
    getTabs(){
        return [
            {_id:1, name:"Home"},
            {_id:2, name:"About"},
            {_id:3, name:"Contact"},
        ]
    }

    renderTabs(){
        return this.getTabs().map((tab)=>(
            <Tab key={tab._id} tab={tab}></Tab>
        ))
    }

    render(){
        return (
            <div className="header">
                <div className="header-tabs">
                    {this.renderTabs()}
                </div>
            </div>
        )
    }
}