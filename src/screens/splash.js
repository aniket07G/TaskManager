import React, { useEffect } from "react";
import { Text, View, Dimensions, StyleSheet, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Splash = ({ navigation }) => {
    useEffect(() => {
        const retrieveEmailPass = async () => {
            try {
                const isLoggedIn = await AsyncStorage.getItem("userLoggedIn");
                if (isLoggedIn) {
                    navigation.replace("Task");
                } else {
                    navigation.replace("Login");
                }
            } catch (error) {
                console.error("Error retrieving data:", error);
                navigation.replace('Login')
            }
        };
        setTimeout(() => {
            retrieveEmailPass();
        }, 2000)
    }, [])
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.textmai}>Task</Text>
            <Text style={styles.textkisan}>Manager</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    textmai: {
        fontSize: windowWidth * 0.1,
        fontWeight: '600',
        color: '#0056b3',
        fontFamily: 'Poppins-SemiBold',
    },
    textkisan: {
        marginTop: -windowWidth * 0.095,
        fontSize: windowWidth * 0.1,
        fontWeight: '600',
        color: '#339af0',
        fontFamily: 'Poppins-SemiBold',
    }
})

export default Splash;