import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Checklist() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        Alert.alert('Login Required', 'Please log in to manage your garden tasks.');
        router.push('/auth/login');
        return;
      }
      const user = JSON.parse(userStr);

      const response = await fetch(`${BACKEND_URL}/api/tasks/${user._id}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleAddTask = async () => {
    if (!newTaskTitle) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);

      const response = await fetch(`${BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          dueDate: date,
          userId: user._id
        }),
      });

      if (response.ok) {
        setModalVisible(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        fetchTasks();
      } else {
        Alert.alert('Error', 'Failed to add task');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t._id === id ? { ...t, isCompleted: !t.isCompleted } : t));
      
      await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error(error);
      fetchTasks(); // Revert on error
    }
  };

  const deleteTask = async (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setTasks(prev => prev.filter(t => t._id !== id)); // Optimistic
              await fetch(`${BACKEND_URL}/api/tasks/${id}`, { method: 'DELETE' });
            } catch (error) {
              console.error(error);
              fetchTasks();
            }
          }
        }
      ]
    );
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity onPress={() => toggleTask(item._id)} style={styles.checkbox}>
        <Ionicons 
          name={item.isCompleted ? "checkbox" : "square-outline"} 
          size={24} 
          color={item.isCompleted ? "#10b981" : "#aaa"} 
        />
      </TouchableOpacity>
      
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, item.isCompleted && styles.completedText]}>
          {item.title}
        </Text>
        {item.description ? <Text style={styles.taskDesc}>{item.description}</Text> : null}
        {item.dueDate && (
          <Text style={styles.taskDate}>
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => deleteTask(item._id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one!</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#000" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Garden Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task Title (e.g., Water Roses)"
              placeholderTextColor="#aaa"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <TextInput
              style={StyleSheet.flatten([styles.input, styles.textArea])}
              placeholder="Description (Optional)"
              placeholderTextColor="#aaa"
              value={newTaskDesc}
              onChangeText={setNewTaskDesc}
              multiline
            />

            <TouchableOpacity 
              style={styles.dateBtn} 
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#10b981" />
              <Text style={styles.dateBtnText}>
                Due: {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={StyleSheet.flatten([styles.btn, styles.cancelBtn])} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={StyleSheet.flatten([styles.btn, styles.saveBtn])} 
                onPress={handleAddTask}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071024',
  },
  taskCard: {
    backgroundColor: '#1a202c',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  checkbox: {
    marginRight: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#718096',
  },
  taskDesc: {
    color: '#a0aec0',
    fontSize: 12,
    marginTop: 2,
  },
  taskDate: {
    color: '#10b981',
    fontSize: 12,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#10b981',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a202c',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#071024',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#071024',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  dateBtnText: {
    color: '#fff',
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#4a5568',
  },
  saveBtn: {
    backgroundColor: '#10b981',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
