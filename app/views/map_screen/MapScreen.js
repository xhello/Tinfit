import React, { Component } from 'react'
import { Text, View, Image, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import styles from './style'
import MapView, { Marker, Callout, MarkerAnimated } from 'react-native-maps';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import HomeCard from '../../components/home_card/home_card';



class MapScreen extends Component {
    state = {
        markers: [],
        showDetailsModal: false,
        selectedItem: null
    }

    componentDidMount() {
        this.getLocations()
        // console.warn(this.props.userList[0].user)
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

    renderItem = () => {
        let item = this.state.selectedItem;
        console.log("#####################@@@@@@@@@@@@@ - ", item.user.myTrainerProfile.price);
        var ratingToShow = 0;
        if (this.state.isUserLookingPT) {
            if (item.user.myTrainerProfile != undefined) {
                console.log("#####################@@@@@@@@@@@@@****** - ");
                ratingToShow = item.user.myTrainerProfile.rating != null ? item.user.myTrainerProfile.rating : 0
            }
        } else {
            if (item.user.myClientProfile != undefined) {
                ratingToShow = item.user.myClientProfile.rating != null ? item.user.myClientProfile.rating : 0
            }
        }
        if (this.state.isUserLookingPT) {
            var price = item.user.myTrainerProfile.price
        } else {
            var price = item.user.myClientProfile.price
        }
        console.warn("IMAGE URL", item.user.photoURL)

        return (

            <HomeCard
                onPressPhoto={() => {
                    this.props.didTapPhoto(item.user.uid, this.props.uid, price);
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}
                onPressRequest={() => {
                    this.props.didTapRequestButton(item.user.uid, item.user.fcmToken, item.user.displayName, price)
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}
                onPressMessage={() => {
                    this.props.didTapMessageButton(item.user.uid, item.user.fcmToken, item.user.displayName, price)
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}
                onPressCrossUser={() => {
                    this.props.crossUser(item.user.uid, this.props.uid)
                    this.setState({
                        showDetailsModal: false,
                        selectedItem: null
                    })
                }}




                userImage={
                    item.user.photoURL
                        ? { uri: item.user.photoURL }
                        : require("../../res/images/default_user.png")
                }
                name={item.user.displayName}
                isGymEnable={item.user.isGymAccess}
                rating={ratingToShow}
                isClientListing={!this.state.isUserLookingPT}
                price={"$" + price}
                messageText={item.user.message}
                isShowMessage={!this.state.isShowAllUsers}
            />
        );



    };

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
                    {this.props.userList.map(marker => (
                        marker.user.photoURL ?
                            (
                                <Marker
                                    coordinate={{ latitude: marker.user.location.lat, longitude: marker.user.location.lon }}
                                    onPress={() => {
                                        // this.props.navigation.navigate("MatchUserDetailUnmatched", { userId: marker.user.uid, userListedIn: "Trainer" });
                                        this.setState({
                                            showDetailsModal: true,
                                            selectedItem: marker
                                        })
                                    }}
                                // title={marker.title}
                                // description={marker.description}
                                >
                                    <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={{ uri: marker.user.photoURL }}
                                            style={{ width: 44, height: 44, borderRadius: 22, }}
                                        />
                                    </View>


                                </Marker>
                            )
                            :
                            null
                    ))
                    }

                </MapView>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showDetailsModal}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            showDetailsModal: false,
                            selectedItem: null
                        })
                    }}>
                        <View style={styles.modalBackground}>
                            <KeyboardAvoidingView behavior="position">
                                <View style={styles.reviewModal}>
                                    {this.state.selectedItem ?
                                        this.renderItem()
                                        :
                                        null}
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        )
    }
}

export default withNavigation(MapScreen)