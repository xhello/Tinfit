import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import styles from './style'
import MapView, { Marker, Callout, MarkerAnimated } from 'react-native-maps';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';


class MapScreen extends Component {
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
                            let m = usersData[keys[i]]
                            m.key = keys[i]
                            markers.push(m)
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
                            coordinate={{ latitude: marker.location.lat, longitude: marker.location.lon }}
                            onPress={() => {
                                this.props.navigation.navigate("MatchUserDetailUnmatched", { userId: marker.key, userListedIn: "Trainer" });
                            }}
                        // title={marker.title}
                        // description={marker.description}
                        >
                            {marker.photoURL ?
                                (
                                    // <Callout>
                                    //     <Text style={{ zIndex: 100, height: 100, width: 100 }}>
                                    //         <Image source={{ uri: marker.photoURL }} style={{ height: 100, width: 100, zIndex: 10000 }} />
                                    //     </Text>
                                    // </Callout>
                                    <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: marker.photoURL }}
                                            style={{ width: 44, height: 44, borderRadius: 22, }}
                                        />
                                    </View>

                                )
                                :
                                null}

                        </Marker>
                    ))}

                </MapView>
            </View>
        )
    }
}

export default withNavigation(MapScreen)