// // mobile/app/forum/[id].jsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import { BACKEND_URL } from '../../config';

// export default function PostDetail() {
//   const { id } = useLocalSearchParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [comment, setComment] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const router = useRouter();

//   const fetchPost = async () => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/forum`); // Currently fetching all, better to add getById endpoint later
//       const data = await response.json();
//       const foundPost = data.find(p => p._id === id); // Temporary client-side filtering
//       setPost(foundPost);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkUser = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem('user');
//       if (userStr) {
//         setCurrentUser(JSON.parse(userStr));
//       } else {
//         setCurrentUser(null);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     checkUser();
//     fetchPost();
//   }, [id]);

//   const handleComment = async () => {
//     if (!comment.trim()) return;

//     setSubmitting(true);
//     try {
//       const userStr = await AsyncStorage.getItem('user');
//       if (!userStr) {
//         Alert.alert('Login Required', 'Please log in to comment.');
//         router.push('/auth/login');
//         return;
//       }
//       const user = JSON.parse(userStr);

//       const response = await fetch(`${BACKEND_URL}/api/forum/${id}/comment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           text: comment,
//           authorId: user._id
//         }),
//       });

//       if (response.ok) {
//         setComment('');
//         fetchPost(); // Refresh
//       } else {
//         Alert.alert('Error', 'Failed to add comment');
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeletePost = async () => {
//     Alert.alert(
//       "Delete Post",
//       "Are you sure you want to delete this post?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const response = await fetch(`${BACKEND_URL}/api/forum/${id}`, {
//                 method: 'DELETE',
//               });
//               if (response.ok) {
//                 router.replace('/forum');
//               } else {
//                 Alert.alert("Error", "Failed to delete post");
//               }
//             } catch (error) {
//               console.error(error);
//               Alert.alert("Error", "Something went wrong");
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleDeleteComment = async (commentId) => {
//     Alert.alert(
//       "Delete Comment",
//       "Are you sure?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const response = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${commentId}`, {
//                 method: 'DELETE',
//               });
//               if (response.ok) {
//                 fetchPost(); // Refresh
//               } else {
//                 Alert.alert("Error", "Failed to delete comment");
//               }
//             } catch (error) {
//               console.error(error);
//               Alert.alert("Error", "Something went wrong");
//             }
//           }
//         }
//       ]
//     );
//   };

//   if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;
//   if (!post) return <View style={styles.center}><Text style={styles.errorText}>Post not found</Text></View>;

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={100}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Post Header */}
//         <View style={styles.postCard}>
//           <View style={styles.header}>
//             <View>
//               <Text style={styles.author}>{post.author?.name || 'Unknown'}</Text>
//               <Text style={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</Text>
//             </View>
//             {currentUser && post.author?._id === currentUser._id && (
//               <TouchableOpacity onPress={handleDeletePost}>
//                 <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
//               </TouchableOpacity>
//             )}
//           </View>
//           <Text style={styles.title}>{post.title}</Text>
//           <Text style={styles.content}>{post.content}</Text>
//         </View>

//         {/* Comments Section */}
//         <Text style={styles.sectionTitle}>Comments ({post.comments?.length || 0})</Text>
//         {post.comments?.map((c, index) => (
//           <View key={index} style={styles.commentCard}>
//             <View style={styles.commentHeader}>
//               <Text style={styles.commentAuthor}>{c.author?.name || 'User'}</Text>
//               {currentUser && c.author?._id === currentUser._id && (
//                 <TouchableOpacity onPress={() => handleDeleteComment(c._id)}>
//                    <Ionicons name="trash-outline" size={16} color="#ff4d4d" />
//                 </TouchableOpacity>
//               )}
//             </View>
//             <Text style={styles.commentText}>{c.text}</Text>
//           </View>
//         ))}
//         {post.comments?.length === 0 && (
//           <Text style={styles.emptyText}>Be the first to comment!</Text>
//         )}
//       </ScrollView>

//       {/* Input Area */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Write a comment..."
//           placeholderTextColor="#aaa"
//           value={comment}
//           onChangeText={setComment}
//         />
//         <TouchableOpacity onPress={handleComment} disabled={submitting}>
//           {submitting ? (
//             <ActivityIndicator color="#10b981" />
//           ) : (
//             <Ionicons name="send" size={24} color="#10b981" />
//           )}
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#071024',
//   },
//   scrollContent: {
//     padding: 15,
//     paddingBottom: 80,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#071024',
//   },
//   errorText: {
//     color: '#ff4d4d',
//     fontSize: 18,
//   },
//   postCard: {
//     backgroundColor: '#1a202c',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#2d3748',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   author: {
//     color: '#10b981',
//     fontWeight: 'bold',
//   },
//   date: {
//     color: '#a0aec0',
//     fontSize: 12,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   content: {
//     color: '#cbd5e0',
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   sectionTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   commentCard: {
//     backgroundColor: '#2d3748',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   commentHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   commentAuthor: {
//     color: '#10b981',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   commentText: {
//     color: '#e2e8f0',
//     fontSize: 14,
//   },
//   emptyText: {
//     color: '#aaa',
//     fontStyle: 'italic',
//     marginTop: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#2d3748',
//     backgroundColor: '#1a202c',
//     marginBottom: 30,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#071024',
//     color: '#fff',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#2d3748',
//   },
// });

// mobile/app/forum/[id].jsx
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
//   ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image, Share
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import { BACKEND_URL } from '../../config';
// import UserAvatar from '../../components/UserAvatar';

// export default function PostDetail() {
//   const { id } = useLocalSearchParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [comment, setComment] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [replyingTo, setReplyingTo] = useState(null); // { commentId, authorName }
//   const [replyText, setReplyText] = useState('');
//   const router = useRouter();
//   const scrollRef = useRef(null);

//   const fetchPost = async () => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/forum/${id}`);
//       const data = await response.json();
//       setPost(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       const userStr = await AsyncStorage.getItem('user');
//       setCurrentUser(userStr ? JSON.parse(userStr) : null);
//     };
//     init();
//     fetchPost();
//   }, [id]);

//   const requireLogin = () => {
//     Alert.alert('Login Required', 'Please log in to continue.');
//     router.push('/auth/login');
//   };

//   // ─── Post actions ────────────────────────────────────────────────────────────

//   const handleVotePost = async (vote) => {
//     if (!currentUser) return requireLogin();
//     const res = await fetch(`${BACKEND_URL}/api/forum/${id}/vote`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId: currentUser._id, vote }),
//     });
//     if (res.ok) {
//       const { upvotes, downvotes } = await res.json();
//       setPost(p => ({ ...p, upvotes, downvotes }));
//     }
//   };

//   const handleSavePost = async () => {
//     if (!currentUser) return requireLogin();
//     const res = await fetch(`${BACKEND_URL}/api/forum/${id}/save`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId: currentUser._id }),
//     });
//     if (res.ok) {
//       const { savedBy } = await res.json();
//       setPost(p => ({ ...p, savedBy }));
//     }
//   };

//   const handleSharePost = async () => {
//     try {
//       await Share.share({ message: `Check out this gardening post: ${post.title}` });
//     } catch (e) { console.error(e); }
//   };

//   const handleDeletePost = () => {
//     Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete', style: 'destructive', onPress: async () => {
//           const res = await fetch(`${BACKEND_URL}/api/forum/${id}`, { method: 'DELETE' });
//           if (res.ok) router.replace('/forum');
//           else Alert.alert('Error', 'Failed to delete post');
//         }
//       }
//     ]);
//   };

//   // ─── Comments ────────────────────────────────────────────────────────────────

//   const handleComment = async () => {
//     if (!comment.trim()) return;
//     if (!currentUser) return requireLogin();
//     setSubmitting(true);
//     try {
//       const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: comment, authorId: currentUser._id }),
//       });
//       if (res.ok) { setComment(''); fetchPost(); }
//       else Alert.alert('Error', 'Failed to add comment');
//     } catch (e) { console.error(e); }
//     finally { setSubmitting(false); }
//   };

//   const handleDeleteComment = (commentId) => {
//     Alert.alert('Delete Comment', 'Are you sure?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete', style: 'destructive', onPress: async () => {
//           const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${commentId}`, { method: 'DELETE' });
//           if (res.ok) fetchPost();
//           else Alert.alert('Error', 'Failed to delete comment');
//         }
//       }
//     ]);
//   };

//   const handleVoteComment = async (commentId, vote) => {
//     if (!currentUser) return requireLogin();
//     const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${commentId}/vote`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId: currentUser._id, vote }),
//     });
//     if (res.ok) fetchPost();
//   };

//   // ─── Replies ─────────────────────────────────────────────────────────────────

//   const handleReply = async () => {
//     if (!replyText.trim() || !replyingTo) return;
//     if (!currentUser) return requireLogin();
//     const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${replyingTo.commentId}/reply`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text: replyText, authorId: currentUser._id }),
//     });
//     if (res.ok) { setReplyText(''); setReplyingTo(null); fetchPost(); }
//     else Alert.alert('Error', 'Failed to add reply');
//   };

//   // ─── Render ──────────────────────────────────────────────────────────────────

//   if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;
//   if (!post) return <View style={styles.center}><Text style={styles.errorText}>Post not found</Text></View>;

//   const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
//   const userVotedUp = currentUser && post.upvotes?.some(id => id === currentUser._id || id?._id === currentUser._id);
//   const userVotedDown = currentUser && post.downvotes?.some(id => id === currentUser._id || id?._id === currentUser._id);
//   const isSaved = currentUser && post.savedBy?.some(id => id === currentUser._id || id?._id === currentUser._id);
//   const isOwner = currentUser && post.author?._id === currentUser._id;

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={100}
//       style={styles.container}
//     >
//       <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>

//         {/* Post Card */}
//         <View style={styles.postCard}>
//           {/* Meta with avatar */}
//           <View style={styles.postMetaRow}>
//             <UserAvatar
//               userId={post.author?._id}
//               name={post.author?.name}
//               picture={post.author?.profilePicture}
//               size={28}
//             />
//             <View style={styles.postMetaText}>
//               <Text style={styles.metaAuthorName}>u/{post.author?.name || 'Unknown'}</Text>
//               <Text style={styles.meta}>🌿 r/Gardening • {getTimeAgo(post.createdAt)}</Text>
//             </View>
//           </View>

//           {/* Title */}
//           <Text style={styles.title}>{post.title}</Text>

//           {/* Body */}
//           <Text style={styles.body}>{post.content}</Text>

//           {/* Images */}
//           {post.images?.length > 0 && (
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
//               {post.images.map((img, i) => (
//                 <Image key={i} source={{ uri: img }} style={styles.postImage} />
//               ))}
//             </ScrollView>
//           )}

//           {/* Post vote + actions row */}
//           <View style={styles.actionsRow}>
//             <View style={styles.voteRow}>
//               <TouchableOpacity onPress={() => handleVotePost('up')} style={styles.voteBtn}>
//                 <Ionicons name="arrow-up" size={20} color={userVotedUp ? '#ff6314' : '#6b7280'} />
//               </TouchableOpacity>
//               <Text style={[styles.score, userVotedUp && styles.scoreUp, userVotedDown && styles.scoreDown]}>
//                 {score}
//               </Text>
//               <TouchableOpacity onPress={() => handleVotePost('down')} style={styles.voteBtn}>
//                 <Ionicons name="arrow-down" size={20} color={userVotedDown ? '#7b68ee' : '#6b7280'} />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.actionBtn} onPress={handleSavePost}>
//               <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? '#10b981' : '#6b7280'} />
//               <Text style={[styles.actionText, isSaved && { color: '#10b981' }]}>{isSaved ? 'Saved' : 'Save'}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.actionBtn} onPress={handleSharePost}>
//               <Ionicons name="share-social-outline" size={18} color="#6b7280" />
//               <Text style={styles.actionText}>Share</Text>
//             </TouchableOpacity>

//             {isOwner && (
//               <>
//                 <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/forum/edit/${id}`)}>
//                   <Ionicons name="pencil-outline" size={18} color="#6b7280" />
//                   <Text style={styles.actionText}>Edit</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.actionBtn} onPress={handleDeletePost}>
//                   <Ionicons name="trash-outline" size={18} color="#ef4444" />
//                   <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>

//         {/* Comments */}
//         <View style={styles.commentsSection}>
//           <Text style={styles.sectionTitle}>{post.comments?.length || 0} Comments</Text>

//           {post.comments?.length === 0 && (
//             <Text style={styles.emptyText}>Be the first to comment! 🌱</Text>
//           )}

//           {post.comments?.map((c) => {
//             const cScore = (c.upvotes?.length || 0) - (c.downvotes?.length || 0);
//             const cVotedUp = currentUser && c.upvotes?.some(uid => uid === currentUser._id || uid?._id === currentUser._id);
//             const cVotedDown = currentUser && c.downvotes?.some(uid => uid === currentUser._id || uid?._id === currentUser._id);
//             const cIsOwner = currentUser && c.author?._id === currentUser._id;

//             return (
//               <View key={c._id} style={styles.commentCard}>
//                 <View style={styles.commentMeta}>
//                   <UserAvatar
//                     userId={c.author?._id}
//                     name={c.author?.name}
//                     picture={c.author?.profilePicture}
//                     size={26}
//                   />
//                   <Text style={styles.commentAuthor}> u/{c.author?.name || 'User'}</Text>
//                   <Text style={styles.commentTime}> • {getTimeAgo(c.createdAt)}</Text>
//                 </View>

//                 <Text style={styles.commentText}>{c.text}</Text>

//                 <View style={styles.commentActions}>
//                   <TouchableOpacity onPress={() => handleVoteComment(c._id, 'up')} style={styles.miniVoteBtn}>
//                     <Ionicons name="arrow-up" size={16} color={cVotedUp ? '#ff6314' : '#6b7280'} />
//                   </TouchableOpacity>
//                   <Text style={[styles.miniScore, cVotedUp && { color: '#ff6314' }, cVotedDown && { color: '#7b68ee' }]}>
//                     {cScore}
//                   </Text>
//                   <TouchableOpacity onPress={() => handleVoteComment(c._id, 'down')} style={styles.miniVoteBtn}>
//                     <Ionicons name="arrow-down" size={16} color={cVotedDown ? '#7b68ee' : '#6b7280'} />
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.replyBtn}
//                     onPress={() => setReplyingTo(replyingTo?.commentId === c._id ? null : { commentId: c._id, authorName: c.author?.name })}
//                   >
//                     <Ionicons name="return-down-forward-outline" size={14} color="#6b7280" />
//                     <Text style={styles.replyBtnText}>Reply</Text>
//                   </TouchableOpacity>

//                   {cIsOwner && (
//                     <TouchableOpacity style={styles.replyBtn} onPress={() => handleDeleteComment(c._id)}>
//                       <Ionicons name="trash-outline" size={14} color="#ef4444" />
//                       <Text style={[styles.replyBtnText, { color: '#ef4444' }]}>Delete</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>

//                 {/* Reply input */}
//                 {replyingTo?.commentId === c._id && (
//                   <View style={styles.replyInputRow}>
//                     <TextInput
//                       style={styles.replyInput}
//                       placeholder={`Reply to u/${replyingTo.authorName}...`}
//                       placeholderTextColor="#4b5563"
//                       value={replyText}
//                       onChangeText={setReplyText}
//                       autoFocus
//                     />
//                     <TouchableOpacity onPress={handleReply} style={styles.replySendBtn}>
//                       <Ionicons name="send" size={16} color="#10b981" />
//                     </TouchableOpacity>
//                   </View>
//                 )}

//                 {/* Nested replies */}
//                 {c.replies?.length > 0 && (
//                   <View style={styles.repliesContainer}>
//                     {c.replies.map((r) => (
//                       <View key={r._id} style={styles.replyCard}>
//                         <View style={styles.commentMeta}>
//                           <UserAvatar
//                             userId={r.author?._id}
//                             name={r.author?.name}
//                             picture={r.author?.profilePicture}
//                             size={20}
//                           />
//                           <Text style={styles.commentAuthor}> u/{r.author?.name || 'User'}</Text>
//                           <Text style={styles.commentTime}> • {getTimeAgo(r.createdAt)}</Text>
//                         </View>
//                         <Text style={styles.commentText}>{r.text}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 )}
//               </View>
//             );
//           })}
//         </View>
//       </ScrollView>

//       {/* Comment Input */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Add a comment..."
//           placeholderTextColor="#4b5563"
//           value={comment}
//           onChangeText={setComment}
//           multiline
//         />
//         <TouchableOpacity onPress={handleComment} disabled={submitting} style={styles.sendBtn}>
//           {submitting
//             ? <ActivityIndicator color="#10b981" size="small" />
//             : <Ionicons name="send" size={22} color="#10b981" />
//           }
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// function getTimeAgo(dateStr) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return 'just now';
//   if (mins < 60) return `${mins}m`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h`;
//   const days = Math.floor(hrs / 24);
//   if (days < 30) return `${days}d`;
//   return new Date(dateStr).toLocaleDateString();
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f1923' },
//   scrollContent: { paddingBottom: 100 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1923' },
//   errorText: { color: '#ef4444', fontSize: 16 },

//   postCard: { backgroundColor: '#1a2535', padding: 16, borderBottomWidth: 6, borderBottomColor: '#0f1923' },
//   postMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   postMetaText: { marginLeft: 10 },
//   metaAuthorName: { color: '#10b981', fontSize: 13, fontWeight: '700' },
//   meta: { color: '#6b7280', fontSize: 11, marginTop: 1 },
//   metaAuthor: { color: '#9ca3af', fontWeight: '600' },
//   title: { color: '#f9fafb', fontSize: 20, fontWeight: '800', marginBottom: 10, lineHeight: 28 },
//   body: { color: '#d1d5db', fontSize: 15, lineHeight: 22, marginBottom: 12 },
//   imageRow: { marginBottom: 12 },
//   postImage: { width: 200, height: 150, borderRadius: 8, marginRight: 8 },

//   actionsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginTop: 4 },
//   voteRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f1923', borderRadius: 20, paddingHorizontal: 4 },
//   voteBtn: { padding: 6 },
//   score: { color: '#d1d5db', fontWeight: '700', fontSize: 14, minWidth: 24, textAlign: 'center' },
//   scoreUp: { color: '#ff6314' },
//   scoreDown: { color: '#7b68ee' },
//   actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#0f1923', borderRadius: 20 },
//   actionText: { color: '#6b7280', fontSize: 13, fontWeight: '600', marginLeft: 4 },

//   commentsSection: { padding: 16 },
//   sectionTitle: { color: '#f9fafb', fontSize: 16, fontWeight: '800', marginBottom: 16 },
//   emptyText: { color: '#6b7280', fontStyle: 'italic', marginTop: 8 },

//   commentCard: { marginBottom: 16, borderLeftWidth: 2, borderLeftColor: '#2d3748', paddingLeft: 12 },
//   commentMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
//   commentAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
//   replyAvatar: { backgroundColor: '#3b82f6', width: 18, height: 18, borderRadius: 9 },
//   commentAvatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
//   commentAuthor: { color: '#10b981', fontSize: 12, fontWeight: '700' },
//   commentTime: { color: '#6b7280', fontSize: 11 },
//   commentText: { color: '#d1d5db', fontSize: 14, lineHeight: 20, marginBottom: 8 },
//   commentActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   miniVoteBtn: { padding: 3 },
//   miniScore: { color: '#9ca3af', fontSize: 12, fontWeight: '700', minWidth: 18, textAlign: 'center' },
//   replyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3 },
//   replyBtnText: { color: '#6b7280', fontSize: 12, fontWeight: '600', marginLeft: 3 },

//   replyInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#0f1923', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
//   replyInput: { flex: 1, color: '#f9fafb', fontSize: 13 },
//   replySendBtn: { padding: 4 },

//   repliesContainer: { marginTop: 10, paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: '#374151' },
//   replyCard: { marginBottom: 10 },

//   inputContainer: {
//     flexDirection: 'row', alignItems: 'center', padding: 12,
//     borderTopWidth: 1, borderTopColor: '#1e2d3d', backgroundColor: '#1a2535',
//   },
//   input: {
//     flex: 1, backgroundColor: '#0f1923', color: '#f9fafb', borderRadius: 20,
//     paddingHorizontal: 16, paddingVertical: 10, marginRight: 8,
//     borderWidth: 1, borderColor: '#2d3748', fontSize: 14, maxHeight: 80,
//   },
//   sendBtn: { padding: 6 },
// });

// mobile/app/forum/[id].jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image, Share, Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BACKEND_URL } from '../../config';
import UserAvatar from '../../components/UserAvatar';
import ImageViewer from '../../components/ImageViewer';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const router = useRouter();
  const scrollRef = useRef(null);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/forum/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const userStr = await AsyncStorage.getItem('user');
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
    };
    init();
    fetchPost();
  }, [id]);

  const requireLogin = () => {
    Alert.alert('Login Required', 'Please log in to continue.');
    router.push('/auth/login');
  };

  // ─── Post actions ────────────────────────────────────────────────────────────

  const handleVotePost = async (vote) => {
    if (!currentUser) return requireLogin();
    const res = await fetch(`${BACKEND_URL}/api/forum/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id, vote }),
    });
    if (res.ok) {
      const { upvotes, downvotes } = await res.json();
      setPost(p => ({ ...p, upvotes, downvotes }));
    }
  };

  const handleSavePost = async () => {
    if (!currentUser) return requireLogin();
    const res = await fetch(`${BACKEND_URL}/api/forum/${id}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id }),
    });
    if (res.ok) {
      const { savedBy } = await res.json();
      setPost(p => ({ ...p, savedBy }));
    }
  };

  const handleSharePost = async () => {
    try {
      await Share.share({ message: `Check out this gardening post: ${post.title}` });
    } catch (e) { console.error(e); }
  };

  const handleDeletePost = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const res = await fetch(`${BACKEND_URL}/api/forum/${id}`, { method: 'DELETE' });
          if (res.ok) router.replace('/forum');
          else Alert.alert('Error', 'Failed to delete post');
        }
      }
    ]);
  };

  // ─── Comments ────────────────────────────────────────────────────────────────

  const handleComment = async () => {
    if (!comment.trim()) return;
    if (!currentUser) return requireLogin();
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment, authorId: currentUser._id }),
      });
      if (res.ok) { setComment(''); fetchPost(); }
      else Alert.alert('Error', 'Failed to add comment');
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert('Delete Comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${commentId}`, { method: 'DELETE' });
          if (res.ok) fetchPost();
          else Alert.alert('Error', 'Failed to delete comment');
        }
      }
    ]);
  };

  const handleVoteComment = async (commentId, vote) => {
    if (!currentUser) return requireLogin();
    const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${commentId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id, vote }),
    });
    if (res.ok) fetchPost();
  };

  // ─── Replies ─────────────────────────────────────────────────────────────────

  const handleReply = async () => {
    if (!replyText.trim() || !replyingTo) return;
    if (!currentUser) return requireLogin();
    const res = await fetch(`${BACKEND_URL}/api/forum/${id}/comment/${replyingTo.commentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: replyText, authorId: currentUser._id }),
    });
    if (res.ok) { setReplyText(''); setReplyingTo(null); fetchPost(); }
    else Alert.alert('Error', 'Failed to add reply');
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;
  if (!post) return <View style={styles.center}><Text style={styles.errorText}>Post not found</Text></View>;

  const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
  const userVotedUp = currentUser && post.upvotes?.some(id => id === currentUser._id || id?._id === currentUser._id);
  const userVotedDown = currentUser && post.downvotes?.some(id => id === currentUser._id || id?._id === currentUser._id);
  const isSaved = currentUser && post.savedBy?.some(id => id === currentUser._id || id?._id === currentUser._id);
  const isOwner = currentUser && post.author?._id === currentUser._id;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>

        {/* Post Card */}
        <View style={styles.postCard}>
          {/* Meta with avatar */}
          <View style={styles.postMetaRow}>
            <UserAvatar
              userId={post.author?._id}
              name={post.author?.name}
              picture={post.author?.profilePicture}
              size={28}
            />
            <View style={styles.postMetaText}>
              <Text style={styles.metaAuthorName}>u/{post.author?.name || 'Unknown'}</Text>
              <Text style={styles.meta}>🌿 r/Gardening • {getTimeAgo(post.createdAt)}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{post.title}</Text>

          {/* Body */}
          <Text style={styles.body}>{post.content}</Text>

          {/* Images — full width, tap to open fullscreen viewer */}
          {post.images?.length > 0 && (
            <View style={styles.imagesContainer}>
              {post.images.length === 1 ? (
                <TouchableOpacity onPress={() => { setViewerIndex(0); setViewerVisible(true); }} activeOpacity={0.92}>
                  <Image
                    source={{ uri: post.images[0] }}
                    style={styles.singleImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <View>
                  {/* First image full width */}
                  <TouchableOpacity onPress={() => { setViewerIndex(0); setViewerVisible(true); }} activeOpacity={0.92}>
                    <Image
                      source={{ uri: post.images[0] }}
                      style={styles.singleImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  {/* Rest in a row */}
                  <View style={styles.imageGrid}>
                    {post.images.slice(1).map((img, i) => (
                      <TouchableOpacity
                        key={i + 1}
                        onPress={() => { setViewerIndex(i + 1); setViewerVisible(true); }}
                        activeOpacity={0.92}
                        style={styles.gridImageWrapper}
                      >
                        <Image source={{ uri: img }} style={styles.gridImage} resizeMode="cover" />
                        {/* "more" overlay on last thumb if > 4 images */}
                        {i === 2 && post.images.length > 4 && (
                          <View style={styles.moreOverlay}>
                            <Text style={styles.moreText}>+{post.images.length - 4}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Fullscreen image viewer */}
          <ImageViewer
            images={post.images || []}
            initialIndex={viewerIndex}
            visible={viewerVisible}
            onClose={() => setViewerVisible(false)}
          />

          {/* Post vote + actions row */}
          <View style={styles.actionsRow}>
            <View style={styles.voteRow}>
              <TouchableOpacity onPress={() => handleVotePost('up')} style={styles.voteBtn}>
                <Ionicons name="arrow-up" size={20} color={userVotedUp ? '#ff6314' : '#6b7280'} />
              </TouchableOpacity>
              <Text style={[styles.score, userVotedUp && styles.scoreUp, userVotedDown && styles.scoreDown]}>
                {score}
              </Text>
              <TouchableOpacity onPress={() => handleVotePost('down')} style={styles.voteBtn}>
                <Ionicons name="arrow-down" size={20} color={userVotedDown ? '#7b68ee' : '#6b7280'} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={handleSavePost}>
              <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? '#10b981' : '#6b7280'} />
              <Text style={[styles.actionText, isSaved && { color: '#10b981' }]}>{isSaved ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleSharePost}>
              <Ionicons name="share-social-outline" size={18} color="#6b7280" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            {isOwner && (
              <>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/forum/edit/${id}`)}>
                  <Ionicons name="pencil-outline" size={18} color="#6b7280" />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={handleDeletePost}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Comments */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>{post.comments?.length || 0} Comments</Text>

          {post.comments?.length === 0 && (
            <Text style={styles.emptyText}>Be the first to comment! 🌱</Text>
          )}

          {post.comments?.map((c) => {
            const cScore = (c.upvotes?.length || 0) - (c.downvotes?.length || 0);
            const cVotedUp = currentUser && c.upvotes?.some(uid => uid === currentUser._id || uid?._id === currentUser._id);
            const cVotedDown = currentUser && c.downvotes?.some(uid => uid === currentUser._id || uid?._id === currentUser._id);
            const cIsOwner = currentUser && c.author?._id === currentUser._id;

            return (
              <View key={c._id} style={styles.commentCard}>
                <View style={styles.commentMeta}>
                  <UserAvatar
                    userId={c.author?._id}
                    name={c.author?.name}
                    picture={c.author?.profilePicture}
                    size={26}
                  />
                  <Text style={styles.commentAuthor}> u/{c.author?.name || 'User'}</Text>
                  <Text style={styles.commentTime}> • {getTimeAgo(c.createdAt)}</Text>
                </View>

                <Text style={styles.commentText}>{c.text}</Text>

                <View style={styles.commentActions}>
                  <TouchableOpacity onPress={() => handleVoteComment(c._id, 'up')} style={styles.miniVoteBtn}>
                    <Ionicons name="arrow-up" size={16} color={cVotedUp ? '#ff6314' : '#6b7280'} />
                  </TouchableOpacity>
                  <Text style={[styles.miniScore, cVotedUp && { color: '#ff6314' }, cVotedDown && { color: '#7b68ee' }]}>
                    {cScore}
                  </Text>
                  <TouchableOpacity onPress={() => handleVoteComment(c._id, 'down')} style={styles.miniVoteBtn}>
                    <Ionicons name="arrow-down" size={16} color={cVotedDown ? '#7b68ee' : '#6b7280'} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.replyBtn}
                    onPress={() => setReplyingTo(replyingTo?.commentId === c._id ? null : { commentId: c._id, authorName: c.author?.name })}
                  >
                    <Ionicons name="return-down-forward-outline" size={14} color="#6b7280" />
                    <Text style={styles.replyBtnText}>Reply</Text>
                  </TouchableOpacity>

                  {cIsOwner && (
                    <TouchableOpacity style={styles.replyBtn} onPress={() => handleDeleteComment(c._id)}>
                      <Ionicons name="trash-outline" size={14} color="#ef4444" />
                      <Text style={[styles.replyBtnText, { color: '#ef4444' }]}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Reply input */}
                {replyingTo?.commentId === c._id && (
                  <View style={styles.replyInputRow}>
                    <TextInput
                      style={styles.replyInput}
                      placeholder={`Reply to u/${replyingTo.authorName}...`}
                      placeholderTextColor="#4b5563"
                      value={replyText}
                      onChangeText={setReplyText}
                      autoFocus
                    />
                    <TouchableOpacity onPress={handleReply} style={styles.replySendBtn}>
                      <Ionicons name="send" size={16} color="#10b981" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Nested replies */}
                {c.replies?.length > 0 && (
                  <View style={styles.repliesContainer}>
                    {c.replies.map((r) => (
                      <View key={r._id} style={styles.replyCard}>
                        <View style={styles.commentMeta}>
                          <UserAvatar
                            userId={r.author?._id}
                            name={r.author?.name}
                            picture={r.author?.profilePicture}
                            size={20}
                          />
                          <Text style={styles.commentAuthor}> u/{r.author?.name || 'User'}</Text>
                          <Text style={styles.commentTime}> • {getTimeAgo(r.createdAt)}</Text>
                        </View>
                        <Text style={styles.commentText}>{r.text}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#4b5563"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity onPress={handleComment} disabled={submitting} style={styles.sendBtn}>
          {submitting
            ? <ActivityIndicator color="#10b981" size="small" />
            : <Ionicons name="send" size={22} color="#10b981" />
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1923' },
  scrollContent: { paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1923' },
  errorText: { color: '#ef4444', fontSize: 16 },

  postCard: { backgroundColor: '#1a2535', padding: 16, borderBottomWidth: 6, borderBottomColor: '#0f1923' },
  postMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  postMetaText: { marginLeft: 10 },
  metaAuthorName: { color: '#10b981', fontSize: 13, fontWeight: '700' },
  meta: { color: '#6b7280', fontSize: 11, marginTop: 1 },
  metaAuthor: { color: '#9ca3af', fontWeight: '600' },
  title: { color: '#f9fafb', fontSize: 20, fontWeight: '800', marginBottom: 10, lineHeight: 28 },
  body: { color: '#d1d5db', fontSize: 15, lineHeight: 22, marginBottom: 12 },
  imageRow: { marginBottom: 12 },
  postImage: { width: 200, height: 150, borderRadius: 8, marginRight: 8 },
  imagesContainer: { marginBottom: 12, marginHorizontal: -16, overflow: 'hidden' },
  singleImage: { width: '100%', height: 260, marginBottom: 3 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  gridImageWrapper: { width: '32%', aspectRatio: 1, position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center',
  },
  moreText: { color: '#fff', fontSize: 22, fontWeight: '900' },

  actionsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  voteRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f1923', borderRadius: 20, paddingHorizontal: 4 },
  voteBtn: { padding: 6 },
  score: { color: '#d1d5db', fontWeight: '700', fontSize: 14, minWidth: 24, textAlign: 'center' },
  scoreUp: { color: '#ff6314' },
  scoreDown: { color: '#7b68ee' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#0f1923', borderRadius: 20 },
  actionText: { color: '#6b7280', fontSize: 13, fontWeight: '600', marginLeft: 4 },

  commentsSection: { padding: 16 },
  sectionTitle: { color: '#f9fafb', fontSize: 16, fontWeight: '800', marginBottom: 16 },
  emptyText: { color: '#6b7280', fontStyle: 'italic', marginTop: 8 },

  commentCard: { marginBottom: 16, borderLeftWidth: 2, borderLeftColor: '#2d3748', paddingLeft: 12 },
  commentMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  commentAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  replyAvatar: { backgroundColor: '#3b82f6', width: 18, height: 18, borderRadius: 9 },
  commentAvatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  commentAuthor: { color: '#10b981', fontSize: 12, fontWeight: '700' },
  commentTime: { color: '#6b7280', fontSize: 11 },
  commentText: { color: '#d1d5db', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniVoteBtn: { padding: 3 },
  miniScore: { color: '#9ca3af', fontSize: 12, fontWeight: '700', minWidth: 18, textAlign: 'center' },
  replyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3 },
  replyBtnText: { color: '#6b7280', fontSize: 12, fontWeight: '600', marginLeft: 3 },

  replyInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#0f1923', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  replyInput: { flex: 1, color: '#f9fafb', fontSize: 13 },
  replySendBtn: { padding: 4 },

  repliesContainer: { marginTop: 10, paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: '#374151' },
  replyCard: { marginBottom: 10 },

  inputContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    borderTopWidth: 1, borderTopColor: '#1e2d3d', backgroundColor: '#1a2535',
  },
  input: {
    flex: 1, backgroundColor: '#0f1923', color: '#f9fafb', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, marginRight: 8,
    borderWidth: 1, borderColor: '#2d3748', fontSize: 14, maxHeight: 80,
  },
  sendBtn: { padding: 6 },
});