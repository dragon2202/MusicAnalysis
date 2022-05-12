import React, {useState} from 'react'

import {DisplayDropdown, DisplayRender} from '../components/index'//All components


function Home() {
    const [display, setDisplay] = useState(1)
    const [MostPlayedNum, setMostPlayedNum] = useState(10)//Amount of songs displayed based of times listened
    const [MostRecentNum, setMostRecentNum] = useState(10)//Amount of songs displayed based of last heard

    return (
        <main className="home">
            <h3><b>Home</b></h3>
            <section className="content">
                <DisplayDropdown display={display} setDisplay={setDisplay} />
                <DisplayRender 
                    display={display}  
                    MostPlayedNum={MostPlayedNum} 
                    setMostPlayedNum={setMostPlayedNum} 
                    MostRecentNum={MostRecentNum} 
                    setMostRecentNum={setMostRecentNum}
                />
            </section>
        </main>
    )
}

export default Home;