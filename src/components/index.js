import React from 'react'
import moment from 'moment'

import Card from 'antd/lib/card'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import listenhistory from '../json/listen_history.json'

//This function takes the JSON, puts it into a hashmap, sorts hashmap and returns sorted hashmap
function MostPlayedSongs_Hash(songArray) {
    let hash = new Map()
    for (var i = 0; i < songArray.length; i++) {
        //name_artist checks if JSON has artist under subtitles attribute
        //It combines song title plus song author as hashkey to make it more unique in case songs have same name but different authors
        let name_artist = (songArray[i].hasOwnProperty('subtitles') ? songArray[i].title.slice(8).concat(" by ", songArray[i].subtitles[0].name) : songArray[i].title.slice(8))
        if (hash.has(name_artist)) { //If hashmap already has the same song with same author
            hash.set(name_artist, hash.get(name_artist) + 1)//If seen increment hash value
        } else {//if hashmap does not have the song
            hash.set(name_artist, 1)//sets default seen value
        }
    }
    let sortedHash = new Map([...hash.entries()].sort((item1, item2) => item2[1] - item1[1]))//sorts by hash value, how many times it's been seen
    return sortedHash
}
//This function takes the JSON, puts it into a hashmap, sorts hashmap and returns sorted hashmap
function MostRecent_Hash(songArray) {
    let hash = new Map()
    for (var i = 0; i < songArray.length; i++) {
        //name_artist checks if JSON has artist under subtitles attribute
        //It combines song title plus song author as hashkey to make it more unique in case songs have same name but different authors
        let name_artist = (songArray[i].hasOwnProperty('subtitles') ? songArray[i].title.slice(8).concat(" by ", songArray[i].subtitles[0].name) : songArray[i].title.slice(8))
        if (hash.has(name_artist)) { //If hashmap already has the song and same author
            if (moment(songArray[i].time).isAfter(hash.get(name_artist))) { //Current Iteration with same hash key and compares it by moment.isAfter with previously store hash value
                hash.set(name_artist, songArray[i].time)//sets most recent time
            } else {
                hash.set(name_artist, hash.get(name_artist))//sets previous time as it's more current to present time
            }
        } else {//if hashmap does not have the song, set time
            hash.set(name_artist, songArray[i].time)
        }
    }
    let sortedHash = new Map([...hash.entries()].sort((item1, item2) => moment(item2[1]) - moment(item1[1])))//sorts based off time. convert to moment time to compare
    return sortedHash
}

//Displays songs by the amount of times user listened to by frequency
const DisplayTop10 = ({hashmap, MostPlayedNum, setMostPlayedNum}) => {
    const iterator = hashmap.entries()//Grabs the first item from a sorted hashmap
    const cardList = []
    //Loops through the hashmap from first, second, third, ..etc.
    for (let i = 0; i < MostPlayedNum; i++) {
        let currentIteration = iterator.next().value//hashmap.entries.next.value just iterates next spot of the hashmap like array[0] to array[1]
        cardList.push(//puts it into an array later to display
            <Card type="inner" className='inner' key={i} title={(i + 1) + '. ' + currentIteration[0]} >{/* Card is numbered and concated with name(which is hash key) */}
                {"Number of times played: " + currentIteration[1]}
            </Card>
        )
    }
    return(
        <Card title="Top 10 most played songs" className='mostplayed'>
            <div className='displaynumber'>
                <h3 className='text'>Number of songs displayed</h3>
                <Input 
                    className='input' 
                    defaultValue={MostPlayedNum} 
                    onChange={(input) => (typeof parseInt(input.target.value) === 'number') ? setMostPlayedNum(parseInt(input.target.value)) : null}
                />
            </div>
            { cardList }
        </Card>
    )
}

//Displays Songs listened by most recent time
const DisplayMostRecent = ({hashmap, MostRecentNum, setMostRecentNum}) => {
    const iterator = hashmap.entries()
    const cardList = []
    //Loops through the hashmap from first, second, third, ..etc.
    for (let i = 0; i < MostRecentNum; i++) {
        let currentIteration = iterator.next().value//hashmap.entries.next.value just iterates next spot of the hashmap like array[0] to array[1]
        cardList.push (//puts it into an array later to display
            <Card type="inner" className='inner' key={i} title={(i + 1) + '. ' + currentIteration[0]} >{/* Card is numbered and concated with name(which is hash key) */}
                {"Last played: " + moment(currentIteration[1]).format('MMMM Do YYYY, h:mm:ss a')} {/*Format for the time for human readability */}
            </Card>
        )
    }
    return(
        <Card title="Most Recent Songs Played" className='mostrecent'>
            <div className='displaynumber'>
                <h3 className='text'>Number of songs displayed</h3>
                <Input // Input takes a number input and displays N number of songs
                    className='input' 
                    defaultValue={MostRecentNum} 
                    onChange={(input) => (typeof parseInt(input.target.value) === 'number') ? setMostRecentNum(parseInt(input.target.value)) : null}
                />
            </div>
            { cardList }
        </Card>
    )
}

//Allows user to access a dropdown to filter between songs based of number of watches or last listened 
const DisplayDropdown = ({ display, setDisplay }) => {
    const menu = (
        <Menu
            items={[
                {
                    label: (
                        <div onClick={() => setDisplay(1)}>
                            Top Songs Played
                        </div>
                    ),
                },
                {
                    label: (
                        <div onClick={() => setDisplay(2)}>
                            Most Recent Songs
                        </div>
                    ),
                },
            ]}
        />
    )
    return (
        <Dropdown overlay={menu} placement="bottom" arrow className='displaydropdown'>
            <Button>{(display === 1) ? "Top Songs Played" : "Most Recent Songs"}</Button>
        </Dropdown>
    )
} 

//Renders based of toggles from DisplayDropdown component above
const DisplayRender = ({ display, MostPlayedNum, setMostPlayedNum, MostRecentNum, setMostRecentNum }) => {
    if(display === 1) {
        return(
            <DisplayTop10 
                hashmap={MostPlayedSongs_Hash(listenhistory)}
                MostPlayedNum={MostPlayedNum}
                setMostPlayedNum={setMostPlayedNum}
            />
        )
    }
    if(display === 2) {
        return (
            <DisplayMostRecent 
                hashmap={MostRecent_Hash(listenhistory)}
                MostRecentNum={MostRecentNum}
                setMostRecentNum={setMostRecentNum}
            />
        )
    }
}

export {DisplayDropdown, DisplayRender}