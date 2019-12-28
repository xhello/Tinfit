import React from "react";
import {
  ScrollView,
  Text,
  Button,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "react-native-firebase";
import {
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from "react-navigation";

import AuthLoadingScreen from "../views/auth_screens/auth_loading";
import SignInScreen from "../views/auth_screens/sign_in";
import SignUpScreen from "../views/auth_screens/sign_up";
import ForgotPassScreen from "../views/auth_screens/forgot_pass";
import InfoScreen from "../views/info_screen/info";
import MyReviewsScreen from "../views/myrates_screen/myrates";
import OtherScreen from "../views/other_screen/other";
import BottomNav from "./tab_navigation";
import IntroScreen1 from "../views/auth_screens/intro_screen_1";
import IntroScreen2 from "../views/auth_screens/intro_screen_2";
import IntroScreen3 from "../views/auth_screens/intro_screen_3";

import styles from "./style";

const createStars = userRating => {
  let stars = [];
  let rating = userRating;
  for (let i = 0; i < rating; i++) {
    stars.push(
      <Image
        source={require("../res/images/star_filled.png")}
        style={styles.star}
        key={i}
      />
    );
  }
  for (let i = 0; i < 5 - rating; i++) {
    stars.push(
      <Image
        source={require("../res/images/star_empty.png")}
        style={styles.star}
        key={i + 5}
      />
    );
  }
  return stars;
};

const signOutAsync = async props => {
  firebase.auth().signOut();
  await AsyncStorage.multiRemove(["userToken", "isUserLookingPT", "userLookingDistance", "fcmToken"]); 

  props.navigation.navigate("SignIn");
};

const AuthStack = createStackNavigator(
  {
    Intro1: IntroScreen1,
    Intro2: IntroScreen2,
    Intro3: IntroScreen3,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPassScreen
  },
  {
    headerMode: "none"
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    Tabs: BottomNav
  },
  {
    initialRouteName: "Tabs",
    contentComponent: props => {
      console.log("props in custom component are: ", props);
      return (
        <ScrollView>
          <View style={styles.topGrayArea}>
            <Image
              source={
                props.screenProps.userImageUrl == null
                  ? require("../res/images/default_user.png")
                  : { uri: props.screenProps.userImageUrl }
              }
              style={styles.profilePic}
            />
            <Text style={styles.userNameText}>{props.screenProps.userId}</Text>
            {/* <View style={styles.ratingRow}>
              {createStars(props.screenProps.userRating)}
            </View> */}
            <View style={styles.symbolRow}>
              <Image
                source={
                  props.screenProps.userIsGymAccess
                    ? require("../res/images/gym_icon_enable.png")
                    : require("../res/images/gym_icon_disable.png")
                }
                style={styles.gymIcon}
              />
              <Text style={styles.rateFont}>
                ${props.screenProps.userPrice}
              </Text>
            </View>
          </View>
          <View style={styles.drawerBottomArea}>
            <View style={styles.menuArea}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  props.navigation.navigate("Info");
                  props.navigation.closeDrawer();
                }}
              >
                <Text style={styles.menuText}>Info</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  props.navigation.navigate("Reviews");
                  props.navigation.closeDrawer();
                }}
              >
                <Text style={styles.menuText}>My Reviews</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  props.navigation.navigate("Other");
                  props.navigation.closeDrawer();
                }}
              >
                <Text style={styles.menuText}>OtherScreen</Text>
              </TouchableOpacity> */}
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => signOutAsync(props)}
            >
              <Text style={styles.logoutButtonFont}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
  }
);

const AppStack = createStackNavigator({
  Drawer: {
    screen: DrawerNavigator,
    navigationOptions: {
      header: null
    }
  },
  Info: InfoScreen,
  Reviews: MyReviewsScreen,
  Other: OtherScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
