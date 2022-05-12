import React from 'react'
import {Route, Routes} from 'react-router-dom'

import Home from './home'

export default function Router() {
    return (
        <Routes>
            <Route exact path="/" element={<Home />}></Route>
        </Routes>
    )
}