import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import './styles/Header.less'
import './styles/App.less'
import './styles/Home.less'
import './styles/main.less'
import Home from '../imports/components/Home.js';

Meteor.startup(()=>{
    render(<Home/>, document.getElementById('render-target'));
})