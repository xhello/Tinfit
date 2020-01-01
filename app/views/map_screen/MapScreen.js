import React, { Component } from 'react'
import { Text, View } from 'react-native'
import styles from './style'
import MapView, { Marker } from 'react-native-maps';
import firebase from 'react-native-firebase';


export default class MapScreen extends Component {
    state = {
        markers: []
    }

    componentDidMount() {
        this.getLocations()
    }

    getLocations = () => {
        firebase.database().ref()
            .child('/users/')
            .on('value', snap => {
                let markers = []
                if (snap.val()) {
                    let usersData = snap.val()
                    let keys = Object.keys(snap.val())
                    for (let i = 0; i < keys.length; i++) {
                        if (usersData[keys[i]].location) {
                            markers.push(usersData[keys[i]].location)
                        }
                    }
                    this.setState({
                        markers: markers
                    })
                }
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    // followsUserLocation={true}
                    initialRegion={{
                        latitude: this.props.lat,
                        longitude: this.props.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {this.state.markers.map(marker => (
                        <Marker
                            coordinate={{ latitude: marker.lat, longitude: marker.lon }}
                        // title={marker.title}
                        // description={marker.description}
                        />
                    ))}

                </MapView>
            </View>
        )
    }
}
