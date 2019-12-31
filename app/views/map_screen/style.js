import { StyleSheet, Dimensions } from "react-native";
var { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

})