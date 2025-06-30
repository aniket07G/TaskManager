import { StyleSheet, Dimensions } from "react-native";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TaskStyle = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: '#4A90E2'
    },
    innerContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        width: windowWidth,
        height: windowHight * 0.085,
    },
    left: {
        flex: 1.1,
        // backgroundColor: 'pink',
        height: windowHight * 0.085,
        // justifyContent: 'center',
        paddingLeft: windowWidth * 0.03,
    },
    middle: {
        flex: 2,
        // backgroundColor: 'orange',
        height: windowHight * 0.085,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    right: {
        flex: 0.5,
        // backgroundColor: 'green',
        height: windowHight * 0.085,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: windowWidth * 0.03
    },
    myTaskText: {
        fontFamily: 'Poppins-Bold',
        fontSize: windowWidth * 0.055,
        color: '#FFFFFF',
        marginTop: windowHight * 0.01
    },
    dataText: {
        fontFamily: 'Poppins-Midium',
        fontSize: windowWidth * 0.035,
        color: '#FFFFFF',
        marginTop: -windowHight * 0.011
    },
    searchIcon: {
        marginTop: -8,
    },
    chipStyle: {
        backgroundColor: '#4A90E2',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    filterContainer: {
        width: windowWidth * 0.08,
        height: windowHight * 0.06,
        marginLeft: windowWidth * 0.025,
        // backgroundColor: 'green'
    },
    plusContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: windowWidth * 0.1,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: windowWidth * 0.01
    },
    todayContainer: {
        paddingHorizontal: windowWidth * 0.03,
        height: windowHight * 0.2,
        marginTop: windowHight * 0.015
    },
    taskContainer: {
        backgroundColor: '#FFFFFF',
        marginVertical: windowWidth * 0.01,
        height: windowHight * 0.08,
        flexDirection: 'row',
        borderRadius: 15,
    },
    todayTaskText: {
        fontSize: windowWidth * 0.05,
        fontFamily: 'Roboto-Medium',
        color: '#0D47A1',
    },
    leftTaskC: {
        flex: 0.35,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    middleTaskC: {
        flex: 2,
        // backgroundColor: 'orange',
        // justifyContent: 'center',
    },
    rightTaskC: {
        flex: 0.6,
        // backgroundColor: 'pink',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: windowWidth * 0.045,
        fontFamily: 'Poppins-Medium',
        marginTop: windowHight * 0.01
    },
    discriptionText: {
        fontSize: windowWidth * 0.025,
        fontFamily: 'Poppins-Light',
        marginTop: -windowHight * 0.008
    },
    priorityText: {
        fontSize: windowWidth * 0.05,
        fontFamily: 'Poppins-SemiBold'
    },
    dueText: {
        fontSize: windowWidth * 0.023,
        fontFamily: 'Poppins-Regular',
        marginTop: -windowHight * 0.01
    },
    basedonFilterContainer: {
        padding: windowWidth * 0.03,
        flex: 1,
        marginTop: windowHight * 0.015
        // backgroundColor: 'green'
    },
    filterHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    filterText: {
        fontSize: windowWidth * 0.05,
        fontFamily: 'Roboto-Medium',
        color: '#0D47A1',
    },
    blurView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // simulates blur
        // justifyContent: 'center',
        alignItems: 'center',
    },
    mainDataModal: {
        backgroundColor: '#FFFFFF',
        width: windowWidth * 0.85,
        height: windowHight * 0.6,
        borderRadius: windowWidth * 0.1,
        borderWidth: 2,
        borderColor: '#B0B0B0',
        paddingHorizontal: windowWidth * 0.04,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: windowHight * 0.15
    },
    titleInput: {
        height: windowHight * 0.057,
        width: windowWidth * 0.75,
        fontFamily: 'Poppins-Regular',
        borderWidth: 2,
        borderRadius: windowWidth * 0.04,
        color: '#333',
        borderColor: '#CCC',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: windowWidth * 0.03

    },
    titleTextModal: {
        // marginTop: windowHight * 0.05,
        fontSize: windowWidth * 0.05,
        fontFamily: 'Poppins-Bold',
        color: '#333333',
    },
    discriptionTextModal: {
        marginTop: windowHight * 0.015,
        fontSize: windowWidth * 0.05,
        fontFamily: 'Poppins-Bold',
        color: '#333333',
    },
    discTitleInput: {
        height: windowHight * 0.15,
        width: windowWidth * 0.75,
        fontFamily: 'Poppins-Regular',
        borderWidth: 2,
        borderRadius: windowWidth * 0.04,
        color: '#333',
        borderColor: '#CCC',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: windowWidth * 0.03
    },
    radioContainer: {
        marginTop: windowHight * 0.015,
        flexDirection: 'row',
        // backgroundColor: 'green',
        alignItems: 'center',
        height: windowHight * 0.035
    },
    priorityTextModal: {
        fontSize: windowWidth * 0.05,
        fontFamily: 'Poppins-Bold',
        color: '#333333',
    },
    outerCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
    LMHText: {
        fontSize: windowWidth * 0.05,
        fontFamily: 'Poppins-SemiBold',
        color: '#333333',
    },
    dueDateContainer: {
        marginTop: windowHight * 0.015,
        flexDirection: 'row',
        // backgroundColor: 'green',
        alignItems: 'center',
        height: windowHight * 0.08
    },
    deadLineText: {
        fontSize: windowWidth * 0.05,
        fontFamily: 'Poppins-Bold',
        color: '#333333',
    },
    selectDateContainer: {
        height: windowHight * 0.05,
        width: windowWidth * 0.4,
        borderWidth: 2,
        borderRadius: windowWidth * 0.04,
        color: '#333',
        borderColor: '#CCC',
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: windowWidth * 0.095
    },
    selecteddueDate: {
        fontFamily: 'Poppins-Thinitalic',
        fontSize: windowWidth * 0.05,
        color: '#4F4F4F'
    },
    buttonContainer: {
        flexDirection: 'row',
        height: windowHight * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: windowWidth * 0.07
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        width: windowWidth * 0.3,
        height: windowHight * 0.06,
        borderRadius: windowWidth * 0.09,
        backgroundColor: '#4A90E2', // Elegant blue
        borderColor: '#4A90E2',
    },
    cancelCreateText: {
        fontSize: windowWidth * 0.05,
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF'
    },
    moreContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: windowWidth * 0.015,
        top: windowHight * 0.006,
        backgroundColor: '#4A90E2',
        height: 20,
        width: 20,
        borderRadius: 10
    },
    showMoreConainer: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD', // pleasant light blue
        height: windowHight * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: windowWidth * 1,
        borderBottomLeftRadius: windowWidth * 1,
        gap: windowWidth * 0.045
    },
    noTaskText: {
        fontSize: windowWidth * 0.06,
        color: '#666666',
        fontFamily: 'Poppins-Medium',
        fontWeight: '500'
    },
    fullViewContainer: {
        backgroundColor: '#F5F5F5',
        width: windowWidth * 0.85,
        // height: windowHight * 0.6,
        borderRadius: windowWidth * 0.1,
        borderWidth: 2,
        borderColor: '#B0B0B0',
        paddingHorizontal: windowWidth * 0.04,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: windowWidth*0.08
    },
    fullViewmodalContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // simulates blur
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullViewTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: windowWidth*0.05,
        color: '#333333',
        marginBottom: 8,
        textAlign: 'center',
    },
    fullViewDescription: {
        fontFamily: 'Poppins-Regular',
        fontSize: windowWidth*0.04,
        color: '#555555',
        textAlign: 'center',
        lineHeight: 24,
    },
    crossContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: windowHight*0.015
    }
});

export default {
    TaskStyle: TaskStyle
}