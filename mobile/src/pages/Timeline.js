import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import socket from 'socket.io-client'

import api from '../services/Api'
import Tweet from '../components/Tweet'

export default class Timeline extends React.Component {

    state = {
        tweets: []
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Início',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('New')}>
                <Icon
                    style={{ marginRight: 20 }}
                    name='add-circle-outline'
                    size={24}
                    color='#4BB0EE'
                />
            </TouchableOpacity>
        )
    })

    async componentDidMount() {
        
        this.subscribeToEvents()

        const response = await api.get('tweets')

        this.setState({ tweets: response.data })
    }

    subscribeToEvents = () => {
        const io = socket('http://10.0.3.2:3000')

        io.on('tweet', data => {
            this.setState(previousState => ({
                tweets: [data, ...previousState.tweets]
            }))
        })

        io.on('like', data => {
            this.setState(previousState => ({

                tweets: previousState.tweets.map(tweet => tweet._id === data._id ? data : tweet)
            }))
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.tweets}
                    keyExtractor={tweet => tweet._id}
                    renderItem={({ item }) => <Tweet tweet={item} />}
                >
                </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});
