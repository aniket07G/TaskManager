import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import UserIcon from "react-native-vector-icons/FontAwesome";
import auth from '@react-native-firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setEmail("");
            setPassword("");
        }, [])
    );

    const storeSession = async () => {
        try {
            console.log("StoreSession");
            await AsyncStorage.clear();
            await AsyncStorage.setItem("userLoggedIn", "true");
            navigation.replace('Task');
        } catch (error) {
            navigation.replace('Task');
        }
        setLoading(false);
    }

    const loginUser = () => {
        setLoading(true);
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
                storeSession(); // Stores the session for persistence.
            })
            .catch(error => {
                setLoading(false);
                if (error.code === "auth/invalid-credential") {
                    Alert.alert("Invalid email or password!");
                    setEmail('');
                    setPassword('');
                } else if (error.code === "auth/network-request-failed") {
                    Alert.alert("No internet connection. Please check your network.");
                } else {
                    Alert.alert("An unknown error occurred.");
                }
            });
    }

    return (
        <View style={styles.container}>
            <View style={{ marginTop: windowHight * 0.2, alignSelf: 'center' }}>
                <UserIcon name='user-circle' size={windowWidth * 0.2} color={'#007bff'} />
            </View>
            <TextInput
                style={styles.forUsername}
                value={email}
                placeholder="Enter your email"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                    setEmail(text);
                }}
            />
            <TextInput
                style={styles.forPassword}
                value={password}
                placeholder="Type your password"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                    setPassword(text);
                }}
            />
            <TouchableOpacity style={styles.loginButton} onPress={() => loginUser()}>
                {!loading ?
                    <Text style={styles.buttonText}>Login</Text>
                    : <ActivityIndicator size={"large"} color={'white'} />
                }
            </TouchableOpacity>
            {!loading ?
                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.resgisterText}>Register</Text>
                </TouchableOpacity> : null
            }
        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    forUsername: {
        width: windowWidth * 0.85, // Responsive width
        height: windowHight * 0.071,
        borderWidth: 2,  // Required for visible border
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: windowWidth * 0.04,
        alignSelf: 'center',
        marginTop: windowHight * 0.03,
        paddingLeft: windowWidth * 0.04,
        fontFamily: "Roboto-Regular"
    },
    forPassword: {
        width: windowWidth * 0.85, // Responsive width
        height: windowHight * 0.071,
        borderWidth: 2,  // Required for visible border
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: windowWidth * 0.04,
        alignSelf: 'center',
        marginTop: windowHight * 0.03,
        paddingLeft: windowWidth * 0.04
    },
    loginButton: {
        width: windowWidth * 0.85,
        height: windowHight * 0.073,
        backgroundColor: '#007bff',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: windowHight * 0.03,
        alignItems: 'center',
        justifyContent: 'center'
    },
    registerButton: {
        width: windowWidth * 0.85,
        height: windowHight * 0.073,
        backgroundColor: '#dc3545',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: windowHight * 0.03,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: windowWidth * 0.06,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium'
    },
    resgisterText: {
        color: 'white',
        fontSize: windowWidth * 0.06,
        fontWeight: '500',
        fontFamily: 'Poppins-Medium'
    }
})

export default Login;