import React, { Component } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "react-native-firebase";
import DrawerIcon from "../../navigation/drawer_icon";
import colors from "res/colors";
import strings from "res/strings";
import _ from "lodash";

import styles from "./style";

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedTabIndex: 0, // 0 = trainerTab, 1 = clientTab
      allUsers: [],
      trainerList: [],
      clientList: [],
      requestedClientList: [],
      requestedBackClientList: [],
      requestedTrainerList: [],
      requestedBackTrainerList: [],
      userImageToDisplay: require("../../res/images/default_user.png"),
      isLoading: false,
      isRefreshing: false
    };
  }

  static navigationOptions = {
    title: strings.appStack.match.navHeading,
    headerTitleStyle: {
      color: colors.header_text,
      fontFamily: "Helvetica Neue"
    },
    headerStyle: {
      backgroundColor: colors.header
    },
    headerLeft: <DrawerIcon />
  };

  // componentWillMount() {
  //   this.setState({
  //     isLoading: true
  //   });
  //   this.readChangeData();
  // }

  onTabFocus = () => {
    console.warn('############', this.state.clientList.length);
    this.setState({
      isLoading: true
    });
    this.readChangeData();
  };

  readChangeData = async () => {
    console.log("#################@@@@@@@@@@@@@@@@@@####################");
    isUserLookingPT = await AsyncStorage.getItem("isUserLookingPT") || false;
    currentUser = firebase.auth().currentUser;
    console.log("currentUser ----------------------", currentUser);
    // if (isUserLookingPT == 'true') {
    //   if (currentUser._user.myClientProfile.price != null) {
    //     this.props.screenProps.userPrice = currentUser._user.myClientProfile.price;
    //   } else {
    //     this.props.screenProps.userPrice = 0;
    //   }
    // } else {
    //   if (currentUser._user.myTrainerProfile.price != null) {
    //     this.props.screenProps.userPrice = currentUser._user.myTrainerProfile.price;
    //   } else {
    //     this.props.screenProps.userPrice = 0;
    //   }
    // }

    // console.log(currentUser);

    this.setState(
      {
        user: currentUser._user,
        // isUserLookingPT: isUserLookingPT == 'true' ? true : false,
        selectedTabIndex: isUserLookingPT == 'true' ? 0 : 1
      },
      () => {
        this.getMatchingData();
      }
    );
  };

  getMatchingData = () => {
    this.setState({
      isRefreshing: true
    });
    firebase
      .database()
      .ref("/users")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const users = _.map(snapshot.val(), user => {
            return user;
          });
          console.log(users);
          this.setState({
            allUsers: users
          });
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref("/relationships/Clients/" + this.state.user.uid + "/requestedBack")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const requestedBackTrainerList = _.map(snapshot.val(), user => {
            return user;
          });
          console.log(requestedBackTrainerList);
          this.setState({
            requestedBackTrainerList: requestedBackTrainerList
          });
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref("/relationships/Clients/" + this.state.user.uid + "/requested")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const requestedTrainerList = _.map(snapshot.val(), user => {
            return user;
          });
          console.log(requestedTrainerList);
          this.setState({
            requestedTrainerList: requestedTrainerList
          });
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref("/relationships/Trainers/" + this.state.user.uid + "/requestedBack")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const requestedBackClientList = _.map(snapshot.val(), user => {
            return user;
          });
          console.log(requestedBackClientList);
          this.setState({
            requestedBackClientList: requestedBackClientList
          });
        },
        error => {
          console.log("Error: " + error);
        }
      );

    firebase
      .database()
      .ref("/relationships/Trainers/" + this.state.user.uid + "/requested")
      .once(
        "value",
        snapshot => {
          console.log(snapshot.val());
          const requestedClientList = _.map(snapshot.val(), user => {
            return user;
          });
          console.log(requestedClientList);
          this.setState({
            requestedClientList: requestedClientList
          });
          this.createMatchedUsers();
        },
        error => {
          console.log("Error: " + error);
        }
      );
    this.setState({
      isRefreshing: false
    });
  };

  createMatchedUsers = () => {
    // console.warn("createMatchedUsers");
    const requestedTrainerList = this.state.requestedTrainerList;
    const requestedClientList = this.state.requestedClientList;
    const requestedBackTrainerList = this.state.requestedBackTrainerList;
    const requestedBackClientList = this.state.requestedBackClientList;
    // console.log("requestedBackClientList", this.state.requestedBackClientList);
    console.log("requestedTrainerList ####", requestedTrainerList);
    console.log("requestedClientList ####", requestedClientList);
    // console.log("allUsers", this.state.allUsers);
    const matchingClientUsersTemp = _.intersectionBy(
      this.state.requestedBackClientList,
      this.state.requestedClientList,
      "uid"
    );

    const matchingTrainerUsersTemp = _.intersectionBy(
      this.state.requestedTrainerList,
      this.state.requestedBackTrainerList,      
      "uid"
    );

    _.remove(matchingClientUsersTemp, user => {
      console.log(user);
      return user.deleted == true;
    });

    _.remove(matchingTrainerUsersTemp, user => {
      console.log(user);
      return user.deleted == true;
    });

    // const trainerListTemp = _.map(matchingUsersTemp, user => {
    //   return user;
    // });
    // const clientListTemp = _.map(matchingUsersTemp, user => {
    //   return user;
    // });
    // _.remove(trainerListTemp, user => {
    //   return user.currentRole === "client";
    // });

    // _.remove(clientListTemp, user => {
    //   return user.currentRole === "trainer"
    // });

    console.log("this.state.allUsers", this.state.allUsers);

    var allUsersForTrainerListing = JSON.parse(JSON.stringify(this.state.allUsers));
    var allUsersForClientListing = JSON.parse(JSON.stringify(this.state.allUsers));

    var trainerList = [];
    if (matchingTrainerUsersTemp.length > 0) {
      trainerList = _.intersectionBy(
        allUsersForTrainerListing,
        matchingTrainerUsersTemp,
        "uid"
      );
    }

    var clientList = [];
    if (matchingClientUsersTemp.length > 0) {
      clientList = _.intersectionBy(
        allUsersForClientListing,
        matchingClientUsersTemp,
        "uid"
      );
    }

    if (clientList.length > 0) {
      matchingClientUsersTemp.forEach(function (item) {
        var index = _.findIndex(clientList, (o) => { return o.uid == item.uid; });
        var indexInRequestedList = _.findIndex(requestedClientList, (o) => { return o.uid == item.uid; });
        var indexInRequestedBackList = _.findIndex(requestedBackClientList, (o) => { return o.uid == item.uid; });
        console.log("indexInRequestedList - ", indexInRequestedList);
        if (index > -1 && indexInRequestedList > -1) {
          clientList[index].price = requestedBackClientList[indexInRequestedList].currentPrice;
          clientList[index].userCode = requestedClientList[indexInRequestedList].userCode;
          clientList[index].userCodeToRequest = requestedBackClientList[indexInRequestedBackList].userCode;
          clientList[index].userListedIn = "Clients"
        }
      });
    }

    if (trainerList.length > 0) {
      matchingTrainerUsersTemp.forEach(function (item) {
        var index = _.findIndex(trainerList, (o) => { return o.uid == item.uid; });
        var indexInRequestedList = _.findIndex(requestedTrainerList, (o) => { return o.uid == item.uid; });
        var indexInRequestedBackList = _.findIndex(requestedBackTrainerList, (o) => { return o.uid == item.uid; });
        if (index > -1 && indexInRequestedList > -1) {
          trainerList[index].price = requestedTrainerList[indexInRequestedList].currentPrice;
          trainerList[index].userCode = requestedTrainerList[indexInRequestedList].userCode;
          trainerList[index].userCodeToRequest = requestedBackTrainerList[indexInRequestedBackList].userCode;
          trainerList[index].userListedIn = "Trainers"
        }
      });
    }

    this.setState({
      trainerList: trainerList,
      clientList: clientList,
      isLoading: false
    });

  };

  didTapPhoto = (id, name, photo, code, codeToRequest, userListedIn) => {
    // updater functions are preferred for transactional updates
    // console.warn(id);
    this.props.navigation.navigate("UserChat", { userId: id, loggedUserId: this.state.user.uid, userName: name, userAvatar: photo, userListedIn: userListedIn, userCode: code, codeToRequest: codeToRequest });
  };
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardView}
        onPress={() => this.didTapPhoto(item.uid, item.displayName, item.photoURL, item.userCode, item.userCodeToRequest, item.userListedIn)}
      >
        <View style={styles.cardViewLeftSideArea}>
          <Image
            source={
              item.photoURL == null
                ? this.state.userImageToDisplay
                : { uri: item.photoURL }
            }
            style={styles.userPic}
          />
          <Text style={styles.userName}>{item.displayName}</Text>
        </View>

        <View style={styles.cardViewRightSideArea}>
          <Text style={styles.price}>${item.price}</Text>
          <Image
            style={styles.forwardArrow}
            source={require("../../res/images/foward_arrow_icon.png")}
          />
        </View>
      </TouchableOpacity>
    );
  };
  renderEmptyContainerToTrainerList = () => {
    return (
      <View style={styles.notFoundMessage}>
        <Text style={styles.notFoundMessageFont}>No matching trainers found yet</Text>
      </View>
    )
  }

  renderEmptyContainerToClientList = () => {
    return (
      <View style={styles.notFoundMessage}>
        <Text style={styles.notFoundMessageFont}>No matching clients found yet</Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onWillFocus={this.onTabFocus} />
        <Spinner
          visible={this.state.isLoading}
          textContent={"Loading ..."}
          textStyle={styles.spinnerTextStyle}
          color={"#FE007A"}
        />
        <View style={styles.segmentRow}>
          <TouchableOpacity
            onPress={() => this.setState({ selectedTabIndex: 0 })}
            style={
              this.state.selectedTabIndex == 0
                ? styles.trainerSegmentActive
                : styles.trainerSegment
            }
          >
            <Text
              style={
                this.state.selectedTabIndex == 0
                  ? styles.segmentTextActive
                  : styles.segmentText
              }
            >
              Trainers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ selectedTabIndex: 1, })}
            style={
              this.state.selectedTabIndex == 1
                ? styles.clientSegmentActive
                : styles.clientSegment
            }
          >
            <Text
              style={
                this.state.selectedTabIndex == 1
                  ? styles.segmentTextActive
                  : styles.segmentText
              }
            >
              Clients
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.selectedTabIndex == 0 &&
          <View style={styles.trainerView}>
            <FlatList
              data={this.state.trainerList}
              renderItem={this.renderItem}
              keyExtractor={item => item.uid}
              onRefresh={() => this.readChangeData()}
              refreshing={this.state.isRefreshing}
              ListEmptyComponent={this.renderEmptyContainerToTrainerList()}
            />
          </View>
        }

        {this.state.selectedTabIndex == 1 &&
          <View style={styles.clientView}>
            <FlatList
              data={this.state.clientList}
              renderItem={this.renderItem}
              keyExtractor={item => item.uid}
              onRefresh={() => this.readChangeData()}
              refreshing={this.state.isRefreshing}
              ListEmptyComponent={this.renderEmptyContainerToClientList()}
            />
          </View>
        }
      </SafeAreaView>
    );
  }
}
