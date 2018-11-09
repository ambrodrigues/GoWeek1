import React from 'react'
import socket from 'socket.io-client'

import './Timeline.css'
import twitterLogo from '../twitter.svg'

import api from '../services/api'

import Tweet from '../components/Tweet'

export default class Timeline extends React.Component {

    state = {
        newTweet: '',
        tweets: []
    }

    async componentDidMount() {
        const response = await api.get('tweets')

        this.setState({ tweets: response.data })

        this.subscribeToEvents()
    }

    subscribeToEvents = () => {
        const io = socket('http://localhost:3000/')

        io.on('tweet', data => {
            this.setState(previousState => ({
                tweets: [data, ...previousState.tweets]
            }))
        })

        io.on('like', data => {
            this.setState(previousState => ({

                tweets: previousState.tweets.map(tweet => tweet._id === data._id ? data : tweet)

            })
            )
        })
    }

    handleInputChange = event => {
        this.setState({ newTweet: event.target.value })
    }

    handleNewTweet = async event => {

        if (event.keyCode !== 13) return

        const content = this.state.newTweet;
        const author = localStorage.getItem('@GoTwitter:username')

        await api.post('tweets', { content, author })

        this.setState({ newTweet: '' })
    }

    render() {
        return (
            <div className="timeline-wrapper" >
                <img height={24} src={twitterLogo} alt="GoTwitter" />

                <form>
                    <textarea
                        value={this.state.newTweet}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleNewTweet}
                        placeholder="O que está acontecendo?"
                    >
                    </textarea>
                    <ul className="tweet-list">
                        {
                            this.state.tweets.map(tweet => (
                                <Tweet key={tweet._id} tweet={tweet} />
                            ))
                        }
                    </ul>
                </form>
            </div>
        )
    }
}