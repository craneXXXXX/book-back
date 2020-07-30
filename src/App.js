import React, { Component } from 'react'
import {HashRouter as Router} from 'react-router-dom'
import RouterView from './router/AppRouter'


export default class App extends Component {
    render() {
        return (
            <>
                <Router>
                    <RouterView></RouterView>
                </Router>
            </>
        )
    }
}
