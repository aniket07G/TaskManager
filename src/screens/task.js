import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles";
import SearchIcon from "react-native-vector-icons/EvilIcons";
import PlusIcon from "react-native-vector-icons/Feather";
import TaskIcon from "react-native-vector-icons/FontAwesome6";
import { Chip } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MoreIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EditIcon from 'react-native-vector-icons/Entypo';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import MarkIcon from 'react-native-vector-icons/MaterialIcons';
import CrossIcon from 'react-native-vector-icons/Entypo';


const windowWidth = Dimensions.get('window').width;
const TaskStyle = styles.TaskStyle;
const today = new Date();
const formatted = today.toISOString().split('T')[0];


let TasksGlobal = []

const Task = () => {
    const [todayTasks, setTodayTasks] = useState([]);
    const [tomorrowTasks, setTomorrowTasks] = useState([]);
    const [filterTasks, setFilterTasks] = useState([]);
    const [filterParameter, setFilterParameter] = useState("All");
    const [visible, setVisible] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDiscription, setTaskDiscription] = useState("");
    const [priority, setPriority] = useState("");
    const [dueDate, setDueDate] = useState(new Date());
    const [showCalender, setShowCalender] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [morekey, setMoreKey] = useState("");
    const [doesComeFromEdit, setDoesComeFromEdit] = useState(null);
    const [uid, setUid] = useState(null);
    const [creatingLoading, setCreatingLoading] = useState(false);
    const [firstLoading, setFirstLoading] = useState(true);
    const [isFullView, setFullView] = useState(false);
    const [taskInFull, setTaskInFull] = useState({});

    const onDueDateChange = (event, selectedDate) => {
        setShowCalender(false);
        if (selectedDate) {
            setDueDate(selectedDate);
        } else {
            console.log("User canceled the date picker");
        }
    };

    const handleCreate = async () => {
        setCreatingLoading(true);
        try {
            if (taskTitle.trim() === "") throw new Error("Title is required");
            if (taskDiscription.trim() === "") throw new Error("Discription is required");
            if (!priority) throw new Error("Please select a priority");
            const taskToBeSaved = {
                id: Date.now(),
                title: taskTitle.trim(),
                description: taskDiscription.trim(),
                priority: priority,
                isComplete: false,
                dueDate: dueDate.toISOString().split('T')[0],
            }
            if (doesComeFromEdit) {
                await deleteTask(doesComeFromEdit);
            }
            TasksGlobal.push(taskToBeSaved);

            await firestore()
                .collection('users_tasks')
                .doc(uid)
                .set({ tasks: TasksGlobal });

            setVisible(false);
            setTimeout(() => {
                sortBasedonToday(TasksGlobal);
                sortBasedonTomorrow(TasksGlobal);
                filtering(filterParameter);
                setPriority("");
                setTaskTitle("");
                setTaskDiscription("");
                setDueDate(new Date());
                setDoesComeFromEdit(null);
            }, 0);
        } catch (e) {
            Alert.alert(e.message);
        } finally {
            setCreatingLoading(false);
        }
    }

    const formatDate = (date) => {
        if (!date) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const date = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${date}`;
        } else {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }

    const sortBasedonTomorrow = (tasks) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = formatDate(tomorrow);
        const filteredByTomorrow = tasks.filter(task => task.dueDate === tomorrowString);
        setTomorrowTasks(filteredByTomorrow);
    }

    const sortBasedonToday = (tasks) => {
        const todayDate = formatDate(false);
        const filteredByToday = tasks.filter(item => item.dueDate === todayDate);
        setTodayTasks(filteredByToday);
    }

    const filtering = (parameter) => {
        setFilterParameter(parameter)
        if (parameter === "All") {
            const sortedTasks = TasksGlobal.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            setFilterTasks(sortedTasks);
        } else if (parameter === "low" || parameter === "medium" || parameter === "high") {
            const sortedTasks = TasksGlobal.filter((item) => item.priority === parameter);
            setFilterTasks(sortedTasks);
        } else if (parameter === "Complete") {
            const sortedTasks = TasksGlobal.filter((item) => item.isComplete);
            setFilterTasks(sortedTasks);
        } else if (parameter === "Incomplete") {
            const sortedTasks = TasksGlobal.filter((item) => !item.isComplete);
            setFilterTasks(sortedTasks);
        }
    }

    const deleteTask = async (taskToBeDeleted) => {
        TasksGlobal = TasksGlobal.filter(task => task.id !== taskToBeDeleted.id);
        try {
            await firestore()
                .collection('users_tasks')
                .doc(uid)
                .set({ tasks: TasksGlobal });
            console.log("Deleted");
            if (!doesComeFromEdit) {
                setTimeout(() => {
                    sortBasedonToday(TasksGlobal);
                    sortBasedonTomorrow(TasksGlobal);
                    filtering(filterParameter);
                }, 0);
            }

        } catch (e) {
            console.log(e);
        }
    }

    const editTask = (task) => {
        console.log(task);
        setDoesComeFromEdit(task);
        setTaskTitle(task.title);
        setTaskDiscription(task.description);
        setPriority(task.priority);
        setDueDate(new Date(task.dueDate));
        setVisible(true);
    }

    const markTask = async (taskToBeMarked) => {
        try {
            await deleteTask(taskToBeMarked);
            const updatedTask = { ...taskToBeMarked, isComplete: true };
            TasksGlobal.push(updatedTask);
            await firestore()
                .collection('users_tasks')
                .doc(uid)
                .set({ tasks: TasksGlobal });
            setTimeout(() => {
                sortBasedonToday(TasksGlobal);
                sortBasedonTomorrow(TasksGlobal);
                filtering(filterParameter);
                setDoesComeFromEdit(null);
            }, 0);
        } catch (e) {
            console.log(e);
            setDoesComeFromEdit(null);
        }
    }

    const fetchTasks = async () => {
        try {
            const docSnap = await firestore()
                .collection('users_tasks')
                .doc(uid)
                .get();

            if (docSnap.exists && docSnap.data().tasks) {
                TasksGlobal = JSON.parse(JSON.stringify(docSnap.data().tasks));
                console.log("Fetched Data", docSnap.data().tasks);
                sortBasedonToday(docSnap.data().tasks);
                sortBasedonTomorrow(docSnap.data().tasks);
                filtering("All");
            } else {
                console.log("No Tasks");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setFirstLoading(false);
        }
    }

    useEffect(() => {
        const user = auth().currentUser;
        if (user && user.uid) {
            setUid(user.uid);
        }
    }, []);

    useEffect(() => {
        if (uid) {
            fetchTasks();
        }
    }, [uid]);

    return (
        <SafeAreaView style={TaskStyle.conatiner}>
            <View style={TaskStyle.innerContainer}>
                <View style={TaskStyle.header}>
                    <View style={TaskStyle.left}>
                        <Text style={TaskStyle.myTaskText}>My Tasks</Text>
                        <Text style={TaskStyle.dataText}>{formatted}</Text>
                    </View>
                    <View style={TaskStyle.middle}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={TaskStyle.filterContainer}>
                            <Chip style={[TaskStyle.chipStyle, filterParameter === "All" && { backgroundColor: '#5AA4E8' }]} textStyle={{ color: "#FFFFFF", fontFamily: 'Poppins-SemiBold' }} onPress={() => filtering("All")}>All</Chip>
                            <Chip style={[TaskStyle.chipStyle, filterParameter === "low" && { backgroundColor: '#5AA4E8' }]} textStyle={{ color: "#FFFFFF", fontFamily: 'Poppins-SemiBold' }} onPress={() => filtering("low")}>Low</Chip>
                            <Chip style={[TaskStyle.chipStyle, filterParameter === "medium" && { backgroundColor: '#5AA4E8' }]} textStyle={{ color: "#FFFFFF", fontFamily: 'Poppins-SemiBold' }} onPress={() => filtering("medium")}>Medium</Chip>
                            <Chip style={[TaskStyle.chipStyle, filterParameter === "high" && { backgroundColor: '#5AA4E8' }]} textStyle={{ color: "#FFFFFF", fontFamily: 'Poppins-SemiBold' }} onPress={() => filtering("high")}>High</Chip>
                            <Chip style={[TaskStyle.chipStyle, filterParameter === "Complete" && { backgroundColor: '#5AA4E8' }]} textStyle={{ color: "#FFFFFF", fontFamily: 'Poppins-SemiBold' }} onPress={() => filtering("Complete")}>Complete</Chip>
                            <Chip style={[TaskStyle.chipStyle, filterParameter === "Incomplete" && { backgroundColor: '#5AA4E8' }]} textStyle={{ color: "#FFFFFF", fontFamily: 'Poppins-SemiBold' }} onPress={() => filtering("Incomplete")}>Incomplete</Chip>
                        </ScrollView>
                        <SearchIcon name="search" style={TaskStyle.searchIcon} size={windowWidth * 0.12} color={"#FFFFFF"} />
                    </View>
                    <View style={TaskStyle.right}>
                        <TouchableOpacity style={TaskStyle.plusContainer} onPress={() => setVisible(true)}>
                            <PlusIcon name="plus-circle" size={windowWidth * 0.08} color={"#FFFFFF"} />
                        </TouchableOpacity>
                    </View>
                </View>
                {firstLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator color={"#4A90E2"} size={50} />
                    </View>
                ) : (
                    <>
                        {!todayTasks.length && !tomorrowTasks.length && !filterTasks.length ? (
                            <>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={TaskStyle.noTaskText}>No Tasks Yet</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                {todayTasks.length !== 0 &&
                                    <View style={TaskStyle.todayContainer}>
                                        <Text style={TaskStyle.todayTaskText}>Today Tasks</Text>
                                        <FlatList
                                            data={todayTasks}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <View style={[TaskStyle.taskContainer, { opacity: item.isComplete ? 0.6 : 1 }]} >
                                                    <View style={TaskStyle.leftTaskC}>
                                                        <TaskIcon name="clipboard-list" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#4CAF50"} />
                                                    </View>
                                                    <TouchableOpacity 
                                                    style={TaskStyle.middleTaskC} 
                                                    disabled={item.isComplete && showMore && item.id === morekey}
                                                    onPress={() => {
                                                        setTaskInFull(item);
                                                        setFullView(true);
                                                    }}>
                                                        {showMore && item.id === morekey ? (
                                                            <>
                                                                <View style={TaskStyle.showMoreConainer}>
                                                                    <TouchableOpacity onPress={() => {
                                                                        setDoesComeFromEdit(null);
                                                                        deleteTask(item)
                                                                    }}>
                                                                        <DeleteIcon name="delete-forever" size={windowWidth * 0.08} color={"#4A90E2"} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        disabled={item.isComplete}
                                                                        onPress={() => editTask(item)}>
                                                                        <EditIcon name="edit" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#B0B0B0"} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        disabled={item.isComplete}
                                                                        onPress={() => {
                                                                            setDoesComeFromEdit(item);
                                                                            markTask(item);
                                                                        }}>
                                                                        <MarkIcon name="check-circle" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#4CAF50"} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </>) : (
                                                            <>
                                                                <Text
                                                                    style={TaskStyle.titleText}
                                                                    numberOfLines={1}
                                                                    ellipsizeMode="tail">
                                                                    {item.title}
                                                                </Text>
                                                                <Text
                                                                    style={TaskStyle.discriptionText}
                                                                    numberOfLines={2}
                                                                    ellipsizeMode="tail">
                                                                    {item.description}
                                                                </Text>
                                                            </>
                                                        )}
                                                    </TouchableOpacity>
                                                    <View style={TaskStyle.rightTaskC}>
                                                        <Text
                                                            style={[TaskStyle.priorityText,
                                                            item.priority === "high" ? { color: '#FF3B30' } : item.priority === "low" ? { color: "#34C759" } : { color: "#FF9500" }]}>
                                                            {item.priority === "high" ? "H" : item.priority === "low" ? "L" : "M"}</Text>
                                                        <Text style={TaskStyle.dueText}>{item.dueDate}</Text>
                                                    </View>
                                                    <TouchableOpacity style={TaskStyle.moreContainer} onPress={() => {
                                                        if (!showMore) {
                                                            setShowMore(true);
                                                            setMoreKey(item.id);
                                                        } else {
                                                            setShowMore(false);
                                                            setMoreKey("");
                                                        }
                                                    }}>
                                                        <MoreIcon name="dots-horizontal" size={windowWidth * 0.05} color={"#FFFFFF"} />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        />
                                    </View>
                                }
                                {tomorrowTasks.length !== 0 &&
                                    <View style={[TaskStyle.todayContainer, { paddingTop: 0 }]}>
                                        <Text style={TaskStyle.todayTaskText}>Tomorrow Tasks</Text>
                                        <FlatList
                                            data={tomorrowTasks}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <View style={[TaskStyle.taskContainer, { opacity: item.isComplete ? 0.6 : 1 }]}>
                                                    <View style={TaskStyle.leftTaskC}>
                                                        <TaskIcon name="clipboard-list" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#4CAF50"} />
                                                    </View>
                                                    <TouchableOpacity 
                                                    style={TaskStyle.middleTaskC} 
                                                    disabled={item.isComplete && showMore && item.id === morekey}
                                                    onPress={() => {
                                                        setTaskInFull(item);
                                                        setFullView(true);
                                                    }}>
                                                        {showMore && item.id === morekey ? (
                                                            <>
                                                                <View style={TaskStyle.showMoreConainer}>
                                                                    <TouchableOpacity onPress={() => {
                                                                        setDoesComeFromEdit(null);
                                                                        deleteTask(item)
                                                                    }}>
                                                                        <DeleteIcon name="delete-forever" size={windowWidth * 0.08} color={"#4A90E2"} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        disabled={item.isComplete}
                                                                        onPress={() => editTask(item)}>
                                                                        <EditIcon name="edit" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#B0B0B0"} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        disabled={item.isComplete}
                                                                        onPress={() => {
                                                                            setDoesComeFromEdit(item);
                                                                            markTask(item);
                                                                        }}>
                                                                        <MarkIcon name="check-circle" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#4CAF50"} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </>) : (
                                                            <>
                                                                <Text
                                                                    style={TaskStyle.titleText}
                                                                    numberOfLines={1}
                                                                    ellipsizeMode="tail">
                                                                    {item.title}
                                                                </Text>
                                                                <Text
                                                                    style={TaskStyle.discriptionText}
                                                                    numberOfLines={2}
                                                                    ellipsizeMode="tail">
                                                                    {item.description}
                                                                </Text>
                                                            </>
                                                        )}
                                                    </TouchableOpacity>
                                                    <View style={TaskStyle.rightTaskC}>
                                                        <Text
                                                            style={[TaskStyle.priorityText,
                                                            item.priority === "high" ? { color: '#FF3B30' } : item.priority === "low" ? { color: "#34C759" } : { color: "#FF9500" }]}>
                                                            {item.priority === "high" ? "H" : item.priority === "low" ? "L" : "M"}</Text>
                                                        <Text style={TaskStyle.dueText}>{item.dueDate}</Text>
                                                    </View>
                                                    <TouchableOpacity style={TaskStyle.moreContainer} onPress={() => {
                                                        if (!showMore) {
                                                            setShowMore(true);
                                                            setMoreKey(item.id);
                                                        } else {
                                                            setShowMore(false);
                                                            setMoreKey("");
                                                        }
                                                    }}>
                                                        <MoreIcon name="dots-horizontal" size={windowWidth * 0.05} color={"#FFFFFF"} />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        />
                                    </View>
                                }
                                {filterTasks &&
                                    <View style={[TaskStyle.basedonFilterContainer, { paddingTop: 0, paddingBottom: 0 }]}>
                                        <View style={TaskStyle.filterHeaderContainer}>
                                            <SearchIcon name="search" style={TaskStyle.searchIcon} size={windowWidth * 0.09} color={"#0D47A1"} />
                                            <Text style={TaskStyle.filterText}>{filterParameter.charAt(0).toUpperCase() + filterParameter.slice(1)}</Text>
                                        </View>
                                        <FlatList
                                            data={filterTasks}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <View style={[TaskStyle.taskContainer, { opacity: item.isComplete ? 0.6 : 1 }]}>
                                                    <View style={TaskStyle.leftTaskC}>
                                                        <TaskIcon name="clipboard-list" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#4CAF50"} />
                                                    </View>
                                                    <TouchableOpacity 
                                                    style={TaskStyle.middleTaskC}
                                                    disabled={item.isComplete && showMore && item.id === morekey}
                                                    onPress={() => {
                                                        setTaskInFull(item);
                                                        setFullView(true);
                                                    }}>
                                                        {showMore && item.id === morekey ? (
                                                            <>
                                                                <View style={TaskStyle.showMoreConainer}>
                                                                    <TouchableOpacity onPress={() => {
                                                                        setDoesComeFromEdit(null);
                                                                        deleteTask(item)
                                                                    }}>
                                                                        <DeleteIcon name="delete-forever" size={windowWidth * 0.08} color={"#4A90E2"} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        disabled={item.isComplete}
                                                                        onPress={() => editTask(item)}>
                                                                        <EditIcon name="edit" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#B0B0B0"} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        disabled={item.isComplete}
                                                                        onPress={() => {
                                                                            setDoesComeFromEdit(item);
                                                                            markTask(item);
                                                                        }}>
                                                                        <MarkIcon name="check-circle" size={windowWidth * 0.08} color={!item.isComplete ? "#4A90E2" : "#4CAF50"} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </>) : (
                                                            <>
                                                                <Text
                                                                    style={TaskStyle.titleText}
                                                                    numberOfLines={1}
                                                                    ellipsizeMode="tail">
                                                                    {item.title}
                                                                </Text>
                                                                <Text
                                                                    style={TaskStyle.discriptionText}
                                                                    numberOfLines={2}
                                                                    ellipsizeMode="tail">
                                                                    {item.description}
                                                                </Text>
                                                            </>
                                                        )}
                                                    </TouchableOpacity>
                                                    <View style={TaskStyle.rightTaskC}>
                                                        <Text
                                                            style={[TaskStyle.priorityText,
                                                            item.priority === "high" ? { color: '#FF3B30' } : item.priority === "low" ? { color: "#34C759" } : { color: "#FF9500" }]}>
                                                            {item.priority === "high" ? "H" : item.priority === "low" ? "L" : "M"}</Text>
                                                        <Text style={TaskStyle.dueText}>{item.dueDate}</Text>
                                                    </View>
                                                    <TouchableOpacity style={TaskStyle.moreContainer} onPress={() => {
                                                        if (!showMore) {
                                                            setShowMore(true);
                                                            setMoreKey(item.id);
                                                        } else {
                                                            setShowMore(false);
                                                            setMoreKey("");
                                                        }
                                                    }}>
                                                        <MoreIcon name="dots-horizontal" size={windowWidth * 0.05} color={"#FFFFFF"} />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        />
                                    </View>
                                }
                            </>
                        )}
                    </>
                )}
                <Modal
                    visible={visible}
                    animationType="fade"
                    transparent={true}
                >
                    <View style={TaskStyle.modalContainer}>
                        <View style={TaskStyle.mainDataModal}>
                            {creatingLoading ? (
                                <>
                                    <ActivityIndicator color={"#4A90E2"} size={50} />
                                </>
                            ) : (
                                <>
                                    <Text style={TaskStyle.titleTextModal}>Task Title</Text>
                                    <TextInput
                                        value={taskTitle}
                                        onChangeText={setTaskTitle}
                                        placeholder="Enter the task title"
                                        style={TaskStyle.titleInput}
                                    />
                                    <Text style={TaskStyle.discriptionTextModal}>Task Discription</Text>
                                    <TextInput
                                        value={taskDiscription}
                                        onChangeText={setTaskDiscription}
                                        placeholder="Enter the task discription"
                                        style={TaskStyle.discTitleInput}
                                        multiline={true}
                                        textAlignVertical="top"
                                        numberOfLines={5}
                                    />
                                    <View style={TaskStyle.radioContainer}>
                                        <Text style={TaskStyle.priorityTextModal}>Priority</Text>
                                        <Text style={[TaskStyle.LMHText, { marginLeft: windowWidth * 0.15 }]}>L</Text>
                                        <TouchableOpacity style={{ marginLeft: windowWidth * 0.008 }} onPress={() => setPriority("low")}>
                                            <View style={TaskStyle.outerCircle}>
                                                {priority == "low" ? <View style={[TaskStyle.innerCircle, { backgroundColor: '#34C759' }]}></View> : null}
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={[TaskStyle.LMHText, { marginLeft: windowWidth * 0.05 }]}>M</Text>
                                        <TouchableOpacity style={{ marginLeft: windowWidth * 0.008 }} onPress={() => setPriority("medium")}>
                                            <View style={TaskStyle.outerCircle}>
                                                {priority == "medium" ? <View style={[TaskStyle.innerCircle, { backgroundColor: '#FF9500' }]}></View> : null}
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={[TaskStyle.LMHText, { marginLeft: windowWidth * 0.05 }]}>H</Text>
                                        <TouchableOpacity style={{ marginLeft: windowWidth * 0.008 }} onPress={() => setPriority("high")}>
                                            <View style={TaskStyle.outerCircle}>
                                                {priority == "high" ? <View style={[TaskStyle.innerCircle, { backgroundColor: '#FF3B30' }]}></View> : null}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={TaskStyle.dueDateContainer}>
                                        <Text style={TaskStyle.deadLineText}>DeadLine</Text>
                                        <TouchableOpacity style={TaskStyle.selectDateContainer} onPress={() => setShowCalender(true)}>
                                            <Text style={TaskStyle.selecteddueDate}>{dueDate.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {showCalender && <DateTimePicker
                                        value={dueDate}
                                        mode="date"
                                        display="default"
                                        onChange={onDueDateChange}
                                        minimumDate={new Date()}
                                    />}
                                    <View style={TaskStyle.buttonContainer}>
                                        <TouchableOpacity style={TaskStyle.button} onPress={() => {
                                            setTaskTitle("");
                                            setTaskDiscription("");
                                            setPriority("");
                                            setDueDate(new Date());
                                            setVisible(false);
                                        }}>
                                            <Text style={TaskStyle.cancelCreateText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={TaskStyle.button} onPress={() => handleCreate()}>
                                            <Text style={TaskStyle.cancelCreateText}>Create</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={isFullView}
                    animationType="fade"
                    transparent={true}
                >
                    <View style={TaskStyle.fullViewmodalContainer}>
                        <View style={TaskStyle.fullViewContainer}>
                            <Text style={TaskStyle.fullViewTitle}>{taskInFull.title}</Text>
                            <Text style={TaskStyle.fullViewDescription}>{taskInFull.description}</Text>
                            <TouchableOpacity style={TaskStyle.crossContainer} onPress={() => {
                                setTaskInFull({});
                                setFullView(false);
                            }}>
                                <CrossIcon name="circle-with-cross" size={windowWidth * 0.08} color={"#333333"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

export default Task;