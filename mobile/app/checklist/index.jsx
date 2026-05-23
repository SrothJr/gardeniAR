import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, SectionList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

export default function Checklist() {
  const { colors, resolvedTheme } = useTheme();
  const { t, i18n } = useTranslation();
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
  const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);

  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        Alert.alert(t('checklist.login_required'), t('checklist.login_msg'));
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
          localDate: getLocalDateString(),
          lang: i18n.language,
        }),
      });

      if (response.ok) {
        setSmartInput('');
        setModalVisible(false);
        fetchTasks();
      } else {
        Alert.alert(t('plant.error'), t('checklist.error_smart'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('plant.error'), t('checklist.error_smart_generic'));
    } finally {
      setIsSmartLoading(false);
    }
  };

  const handleOptimize = async () => {
    // Find overdue tasks to check if we even need to optimize
    const overdueGroup = groupedTasks.find(g => g.title === t('checklist.overdue'));
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
          localDate: getLocalDateString(),
          lang: i18n.language,
        }),
      });

      if (response.ok) {
        Alert.alert(t('plant.added'), t('checklist.optimize_success'));
        fetchTasks();
      } else {
        Alert.alert(t('plant.error'), t('checklist.error_optimize'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('plant.error'), t('checklist.error_optimize_generic'));
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateRoutine = async () => {
    setIsGeneratingRoutine(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);

      const response = await fetch(`${BACKEND_URL}/api/tasks/generate-routine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          localDate: getLocalDateString(),
          lang: i18n.language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✨ ' + t('plant.added'), t('checklist.routine_success', { count: data.tasksAdded }));
        fetchTasks();
      } else {
        Alert.alert(t('plant.error'), data.message || t('checklist.error_routine'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('plant.error'), t('checklist.error_routine_generic'));
    } finally {
      setIsGeneratingRoutine(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle) {
      Alert.alert(t('plant.error'), t('checklist.title_required'));
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
        Alert.alert(t('plant.error'), t('checklist.error_add'));
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
      t('checklist.delete_title'),
      t('checklist.delete_confirm'),
      [
        { text: t('checklist.cancel'), style: "cancel" },
        { 
          text: t('checklist.delete_btn'), 
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
    if (groups.overdue.length > 0) sections.push({ type: 'overdue', title: t('checklist.overdue'), data: groups.overdue, color: '#ef4444' });
    if (groups.today.length > 0) sections.push({ type: 'today', title: t('checklist.today'), data: groups.today, color: '#10b981' });
    if (groups.tomorrow.length > 0) sections.push({ type: 'tomorrow', title: t('checklist.tomorrow'), data: groups.tomorrow, color: '#3b82f6' });
    if (groups.upcoming.length > 0) sections.push({ type: 'upcoming', title: t('checklist.upcoming'), data: groups.upcoming, color: '#a855f7' });
    if (groups.completed.length > 0) sections.push({ type: 'completed', title: t('checklist.completed'), data: groups.completed, color: '#6b7280' });

    return sections;
  }, [tasks, t]);


  const getLocalizedTitle = (item) => {
    // Only attempt translation for AI tasks that aren't in the current language
    if (!item.aiGenerated || !item.taskType || item.language === i18n.language) {
      return item.title;
    }

    // Try to extract the plant name from the title
    // Titles are usually "Action PlantName" (e.g., "Water Zozo")
    const actionWords = {
      en: ['Water', 'Fertilize', 'Prune', 'Harvest', 'Pest-control'],
      bn: ['জল দিন', 'সার দিন', 'ছাঁটাই করুন', 'ফসল সংগ্রহ করুন', 'কীটপতঙ্গ নিয়ন্ত্রণ']
    };

    let plantName = item.title;
    const currentActions = actionWords[item.language] || [];
    
    currentActions.forEach(action => {
      plantName = plantName.replace(action, '').trim();
    });

    // If we couldn't find a clean plant name, return original
    if (!plantName || plantName === item.title) return item.title;

    // Construct localized title: "PlantName + Action" for Bangla, "Action + PlantName" for English
    const localizedAction = t(`checklist.task_${item.taskType}`);
    
    if (i18n.language === 'bn') {
      return `${plantName}কে ${localizedAction}`;
    } else {
      return `${localizedAction} ${plantName}`;
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity onPress={() => toggleTask(item._id)} style={styles.checkbox}>
        <Ionicons 
          name={item.isCompleted ? "checkbox" : "square-outline"} 
          size={24} 
          color={item.isCompleted ? colors.primary : colors.textMuted} 
        />
      </TouchableOpacity>
      
      <View style={styles.taskInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          {item.aiGenerated && (
            <Ionicons name="sparkles" size={14} color="#facc15" style={{ marginRight: 6 }} />
          )}
          <Text style={[styles.taskTitle, { color: colors.text }, item.isCompleted && styles.completedText]}>
            {getLocalizedTitle(item)}
          </Text>
        </View>
        
        {item.description ? <Text style={[styles.taskDesc, { color: colors.textMuted }]}>{item.description}</Text> : null}
        
        {item.aiReasoning && !item.isCompleted ? (
          <Text style={[styles.aiReasoningText, { color: "#facc15" }]}>{item.aiReasoning}</Text>
        ) : null}

        {item.dueDate && (
          <Text style={[styles.taskDate, { color: colors.primary }]}>
            {t('checklist.due')}: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => deleteTask(item._id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={[styles.sectionHeaderContainer, { backgroundColor: colors.background }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIndicator, { backgroundColor: section.color }]} />
        <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
      </View>
      {section.type === 'overdue' && (
        <TouchableOpacity 
          style={[styles.optimizeBtn, { backgroundColor: '#d97706' }, isOptimizing && { opacity: 0.7 }]} 
          onPress={handleOptimize}
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={[styles.optimizeBtnText, { color: "#fff" }]}>{t('checklist.smart_reschedule')}</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* AI Generate Routine Banner */}
      <View style={styles.aiBannerContainer}>
        <TouchableOpacity 
          style={[styles.aiBannerBtn, { backgroundColor: colors.surface, borderColor: colors.primary }, isGeneratingRoutine && { opacity: 0.7 }]} 
          onPress={handleGenerateRoutine}
          disabled={isGeneratingRoutine}
        >
          {isGeneratingRoutine ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#facc15" style={{ marginRight: 8 }} />
              <View>
                <Text style={[styles.aiBannerTitle, { color: colors.primary }]}>{t('checklist.generate_routine')}</Text>
                <Text style={[styles.aiBannerSub, { color: colors.textMuted }]}>{t('checklist.generate_routine_sub')}</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <SectionList
          sections={groupedTasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('checklist.empty')}</Text>}
          stickySectionHeadersEnabled={false}
        />
      )}

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
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
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('checklist.smart_add')}</Text>
            <View style={styles.smartInputContainer}>
              <TextInput
                style={[styles.smartInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.primary }]}
                placeholder={t('checklist.smart_input_placeholder')}
                placeholderTextColor={colors.textMuted}
                value={smartInput}
                onChangeText={setSmartInput}
                editable={!isSmartLoading}
                onSubmitEditing={handleSmartAdd}
              />
              <TouchableOpacity 
                style={[styles.smartAddBtn, { backgroundColor: colors.primary }, isSmartLoading && { opacity: 0.7 }]} 
                onPress={handleSmartAdd} 
                disabled={isSmartLoading}
              >
                {isSmartLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Ionicons name="sparkles" size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Text style={[styles.orText, { color: colors.textMuted }]}>{t('checklist.add_manually')}</Text>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>
            
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder={t('checklist.task_title_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder={t('checklist.desc_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={newTaskDesc}
              onChangeText={setNewTaskDesc}
              multiline
            />

            <TouchableOpacity 
              style={[styles.dateBtn, { backgroundColor: colors.background, borderColor: colors.border }]} 
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.dateBtnText, { color: colors.text }]}>
                {t('checklist.due')}: {date.toLocaleDateString()}
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
                style={[styles.btn, styles.cancelBtn, { backgroundColor: colors.border }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.btnText, { color: colors.text }]}>{t('checklist.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.saveBtn, { backgroundColor: colors.primary }]} 
                onPress={handleAddTask}
              >
                <Text style={[styles.btnText, { color: "#000" }]}>{t('checklist.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aiBannerContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  aiBannerBtn: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  aiBannerTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  aiBannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    marginRight: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#718096',
  },
  taskDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  aiReasoningText: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  taskDate: {
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
  },
  smartAddBtn: {
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
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
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
    borderRadius: 8,
    borderWidth: 1,
  },
  dateBtnText: {
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
  },
  saveBtn: {
  },
  btnText: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  optimizeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});
