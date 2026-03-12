import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, SectionList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
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
  
  // Smart Add States
  const [smartInput, setSmartInput] = useState('');
  const [isSmartLoading, setIsSmartLoading] = useState(false);
  
  // Smart Optimize States
  const [isOptimizing, setIsOptimizing] = useState(false);
  
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

  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleSmartAdd = async () => {
    if (!smartInput.trim()) return;
    setIsSmartLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);
      const response = await fetch(`${BACKEND_URL}/api/tasks/smart-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput: smartInput, 
          userId: user._id,
          localDate: getLocalDateString() 
        }),
      });

      if (response.ok) {
        setSmartInput('');
        setModalVisible(false);
        fetchTasks();
      } else {
        Alert.alert('Error', 'Failed to add smart task. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding smart task.');
    } finally {
      setIsSmartLoading(false);
    }
  };

  const handleOptimize = async () => {
    // Find overdue tasks to check if we even need to optimize
    const overdueGroup = groupedTasks.find(g => g.title === 'Overdue');
    if (!overdueGroup || overdueGroup.data.length === 0) return;

    // We want the AI to be load-aware, so we send ALL active tasks (not just overdue ones)
    // We filter out completed tasks so we don't send unnecessary data.
    const allActiveTasks = tasks.filter(t => !t.isCompleted).map(t => ({
      _id: t._id,
      title: t.title,
      dueDate: t.dueDate,
      taskType: t.taskType
    }));

    setIsOptimizing(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/tasks/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          allActiveTasks,
          localDate: getLocalDateString()
        }),
      });

      if (response.ok) {
        Alert.alert('Success', '✨ AI has successfully rescheduled your overdue tasks!');
        fetchTasks();
      } else {
        Alert.alert('Error', 'Failed to optimize tasks.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while optimizing.');
    } finally {
      setIsOptimizing(false);
    }
  };

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

  const groupedTasks = useMemo(() => {
    const now = new Date();
    // Reset time to start of day for accurate day comparisons
    now.setHours(0, 0, 0, 0);
    
    const todayStr = now.getTime();
    const tomorrowStr = todayStr + 24 * 60 * 60 * 1000;

    const groups = {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
      completed: []
    };

    tasks.forEach(task => {
      if (task.isCompleted) {
        groups.completed.push(task);
        return;
      }

      if (!task.dueDate) {
        groups.upcoming.push(task);
        return;
      }

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const dueTime = dueDate.getTime();

      if (dueTime < todayStr) {
        groups.overdue.push(task);
      } else if (dueTime === todayStr) {
        groups.today.push(task);
      } else if (dueTime === tomorrowStr) {
        groups.tomorrow.push(task);
      } else {
        groups.upcoming.push(task);
      }
    });

    const sections = [];
    if (groups.overdue.length > 0) sections.push({ title: 'Overdue', data: groups.overdue, color: '#ef4444' });
    if (groups.today.length > 0) sections.push({ title: 'Today', data: groups.today, color: '#10b981' });
    if (groups.tomorrow.length > 0) sections.push({ title: 'Tomorrow', data: groups.tomorrow, color: '#3b82f6' });
    if (groups.upcoming.length > 0) sections.push({ title: 'Upcoming', data: groups.upcoming, color: '#a855f7' });
    if (groups.completed.length > 0) sections.push({ title: 'Completed', data: groups.completed, color: '#6b7280' });

    return sections;
  }, [tasks]);


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
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          {item.aiGenerated && (
            <Ionicons name="sparkles" size={14} color="#facc15" style={{ marginRight: 6 }} />
          )}
          <Text style={[styles.taskTitle, item.isCompleted && styles.completedText]}>
            {item.title}
          </Text>
        </View>
        
        {item.description ? <Text style={styles.taskDesc}>{item.description}</Text> : null}
        
        {item.aiReasoning && !item.isCompleted ? (
          <Text style={styles.aiReasoningText}>{item.aiReasoning}</Text>
        ) : null}

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

  const renderSectionHeader = ({ section: { title, color } }) => (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIndicator, { backgroundColor: color }]} />
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      </View>
      {title === 'Overdue' && (
        <TouchableOpacity 
          style={[styles.optimizeBtn, isOptimizing && { opacity: 0.7 }]} 
          onPress={handleOptimize}
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.optimizeBtnText}>Smart Reschedule</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 20 }} />
      ) : (
        <SectionList
          sections={groupedTasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one!</Text>}
          stickySectionHeadersEnabled={false}
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
            
            <Text style={styles.modalTitle}>✨ Smart Add</Text>
            <View style={styles.smartInputContainer}>
              <TextInput
                style={styles.smartInput}
                placeholder='e.g., "Water tomatoes next Friday"'
                placeholderTextColor="#aaa"
                value={smartInput}
                onChangeText={setSmartInput}
                editable={!isSmartLoading}
                onSubmitEditing={handleSmartAdd}
              />
              <TouchableOpacity 
                style={[styles.smartAddBtn, isSmartLoading && { opacity: 0.7 }]} 
                onPress={handleSmartAdd} 
                disabled={isSmartLoading}
              >
                {isSmartLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="sparkles" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR ADD MANUALLY</Text>
              <View style={styles.line} />
            </View>
            
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
  aiReasoningText: {
    color: '#facc15',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
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
    marginBottom: 15,
    textAlign: 'center',
  },
  smartInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  smartInput: {
    flex: 1,
    backgroundColor: '#071024',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#facc15',
    marginRight: 10,
  },
  smartAddBtn: {
    backgroundColor: '#d97706',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#4a5568',
  },
  orText: {
    color: '#a0aec0',
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 'bold',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optimizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  optimizeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
