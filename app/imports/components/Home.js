import React, { Component } from 'react';
import App from './App.js'
import Header from './header/Header.js'

export default class Home extends Component{
    render(){
        return (
            <div className="home">
                <Header/>
                <App/>
            </div>
        )
    }
}
