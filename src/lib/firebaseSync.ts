/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit,
  OperationType,
  handleFirestoreError
} from './firebase';
import { 
  User, 
  Course, 
  Announcement, 
  Assignment, 
  Quiz, 
  LibraryItem, 
  ForumTopic, 
  ForumPost, 
  ChatMessage 
} from '../types';
import { 
  INITIAL_USERS,
  INITIAL_COURSES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_QUIZZES, 
  INITIAL_LIBRARY, 
  INITIAL_FORUM_TOPICS, 
  INITIAL_FORUM_POSTS, 
  INITIAL_MESSAGES 
} from '../mockData';

// Seeding Firestore with default LMS data if collections are empty
export async function seedInitialDataIfEmpty() {
  try {
    // 1. Seed Courses
    const coursesRef = collection(db, 'courses');
    const coursesSnap = await getDocs(query(coursesRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'courses');
    });
    if (coursesSnap && coursesSnap.empty) {
      console.log('Seeding courses to Firestore...');
      for (const course of INITIAL_COURSES) {
        await setDoc(doc(db, 'courses', course.id), course).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `courses/${course.id}`);
        });
      }
    }

    // 2. Seed Announcements
    const announcementsRef = collection(db, 'announcements');
    const announcementsSnap = await getDocs(query(announcementsRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'announcements');
    });
    if (announcementsSnap && announcementsSnap.empty) {
      console.log('Seeding announcements to Firestore...');
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', ann.id), ann).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `announcements/${ann.id}`);
        });
      }
    }

    // 3. Seed Assignments
    const assignmentsRef = collection(db, 'assignments');
    const assignmentsSnap = await getDocs(query(assignmentsRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'assignments');
    });
    if (assignmentsSnap && assignmentsSnap.empty) {
      console.log('Seeding assignments to Firestore...');
      for (const assign of INITIAL_ASSIGNMENTS) {
        await setDoc(doc(db, 'assignments', assign.id), assign).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `assignments/${assign.id}`);
        });
      }
    }

    // 4. Seed Quizzes
    const quizzesRef = collection(db, 'quizzes');
    const quizzesSnap = await getDocs(query(quizzesRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'quizzes');
    });
    if (quizzesSnap && quizzesSnap.empty) {
      console.log('Seeding quizzes to Firestore...');
      for (const quiz of INITIAL_QUIZZES) {
        await setDoc(doc(db, 'quizzes', quiz.id), quiz).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `quizzes/${quiz.id}`);
        });
      }
    }

    // 5. Seed Library Items
    const libraryRef = collection(db, 'library');
    const librarySnap = await getDocs(query(libraryRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'library');
    });
    if (librarySnap && librarySnap.empty) {
      console.log('Seeding library to Firestore...');
      for (const lib of INITIAL_LIBRARY) {
        await setDoc(doc(db, 'library', lib.id), lib).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `library/${lib.id}`);
        });
      }
    }

    // 6. Seed Forum Topics
    const topicsRef = collection(db, 'forum_topics');
    const topicsSnap = await getDocs(query(topicsRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'forum_topics');
    });
    if (topicsSnap && topicsSnap.empty) {
      console.log('Seeding forum topics to Firestore...');
      for (const topic of INITIAL_FORUM_TOPICS) {
        await setDoc(doc(db, 'forum_topics', topic.id), topic).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `forum_topics/${topic.id}`);
        });
      }
    }

    // 7. Seed Forum Posts
    const postsRef = collection(db, 'forum_posts');
    const postsSnap = await getDocs(query(postsRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'forum_posts');
    });
    if (postsSnap && postsSnap.empty) {
      console.log('Seeding forum posts to Firestore...');
      for (const post of INITIAL_FORUM_POSTS) {
        await setDoc(doc(db, 'forum_posts', post.id), post).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `forum_posts/${post.id}`);
        });
      }
    }

    // 8. Seed Messages
    const msgsRef = collection(db, 'messages');
    const msgsSnap = await getDocs(query(msgsRef, limit(1))).catch(err => {
      handleFirestoreError(err, OperationType.GET, 'messages');
    });
    if (msgsSnap && msgsSnap.empty) {
      console.log('Seeding chat messages to Firestore...');
      for (const msg of INITIAL_MESSAGES) {
        await setDoc(doc(db, 'messages', msg.id), msg).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `messages/${msg.id}`);
        });
      }
    }

    console.log('Firestore initialization check complete.');
  } catch (error) {
    console.error('Error seeding initial data to Firestore:', error);
  }
}

// User Profile management
export async function getOrCreateUserProfile(uid: string, fallbackUser: Omit<User, 'id'>): Promise<User> {
  const userDocRef = doc(db, 'users', uid);
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return { id: uid, ...userDocSnap.data() } as User;
    } else {
      const newUser: User = {
        id: uid,
        name: fallbackUser.name || 'Nouvel Utilisateur',
        email: fallbackUser.email || '',
        role: fallbackUser.role || 'student',
        faculty: fallbackUser.faculty || '',
        department: fallbackUser.department || '',
        status: fallbackUser.status || 'approved',
        studentId: fallbackUser.studentId || (fallbackUser.role === 'student' ? `UNIK-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
        matricule: fallbackUser.matricule,
        specialty: fallbackUser.specialty
      };
      await setDoc(userDocRef, newUser);
      return newUser;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
}

export async function updateUserProfileInFirestore(uid: string, updates: Partial<User>) {
  const userDocRef = doc(db, 'users', uid);
  try {
    await updateDoc(userDocRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}

// Real-time Subscriptions with Mandatory Error Callback
export function subscribeUsers(callback: (users: User[]) => void) {
  return onSnapshot(collection(db, 'users'), (snap) => {
    const users: User[] = [];
    snap.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() } as User);
    });
    callback(users);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'users');
  });
}

export function subscribeAnnouncements(callback: (announcements: Announcement[]) => void) {
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const announcements: Announcement[] = [];
    snap.forEach((docSnap) => {
      announcements.push({ id: docSnap.id, ...docSnap.data() } as Announcement);
    });
    callback(announcements);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'announcements');
  });
}

export async function addAnnouncementInFirestore(ann: Announcement) {
  try {
    await setDoc(doc(db, 'announcements', ann.id), ann);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `announcements/${ann.id}`);
  }
}

export async function updateAnnouncementInFirestore(ann: Announcement) {
  try {
    await setDoc(doc(db, 'announcements', ann.id), ann);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `announcements/${ann.id}`);
  }
}

export async function deleteAnnouncementInFirestore(announcementId: string) {
  try {
    await deleteDoc(doc(db, 'announcements', announcementId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `announcements/${announcementId}`);
  }
}

export function subscribeCourses(callback: (courses: Course[]) => void) {
  return onSnapshot(collection(db, 'courses'), (snap) => {
    const courses: Course[] = [];
    snap.forEach((docSnap) => {
      courses.push({ id: docSnap.id, ...docSnap.data() } as Course);
    });
    callback(courses);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'courses');
  });
}

export async function addCourseInFirestore(course: Course) {
  try {
    await setDoc(doc(db, 'courses', course.id), course);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courses/${course.id}`);
  }
}

export function subscribeAssignments(callback: (assignments: Assignment[]) => void) {
  return onSnapshot(collection(db, 'assignments'), (snap) => {
    const assignments: Assignment[] = [];
    snap.forEach((docSnap) => {
      assignments.push({ id: docSnap.id, ...docSnap.data() } as Assignment);
    });
    callback(assignments);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'assignments');
  });
}

export async function saveAssignmentInFirestore(assignment: Assignment) {
  try {
    await setDoc(doc(db, 'assignments', assignment.id), assignment);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `assignments/${assignment.id}`);
  }
}

export function subscribeQuizzes(callback: (quizzes: Quiz[]) => void) {
  return onSnapshot(collection(db, 'quizzes'), (snap) => {
    const quizzes: Quiz[] = [];
    snap.forEach((docSnap) => {
      quizzes.push({ id: docSnap.id, ...docSnap.data() } as Quiz);
    });
    callback(quizzes);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'quizzes');
  });
}

export async function saveQuizInFirestore(quiz: Quiz) {
  try {
    await setDoc(doc(db, 'quizzes', quiz.id), quiz);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `quizzes/${quiz.id}`);
  }
}

export function subscribeLibrary(callback: (libraryItems: LibraryItem[]) => void) {
  return onSnapshot(collection(db, 'library'), (snap) => {
    const items: LibraryItem[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as LibraryItem);
    });
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'library');
  });
}

export async function saveLibraryItemInFirestore(item: LibraryItem) {
  try {
    await setDoc(doc(db, 'library', item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `library/${item.id}`);
  }
}

export function subscribeForumTopics(callback: (topics: ForumTopic[]) => void) {
  const q = query(collection(db, 'forum_topics'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const topics: ForumTopic[] = [];
    snap.forEach((docSnap) => {
      topics.push({ id: docSnap.id, ...docSnap.data() } as ForumTopic);
    });
    callback(topics);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'forum_topics');
  });
}

export async function saveForumTopicInFirestore(topic: ForumTopic) {
  try {
    await setDoc(doc(db, 'forum_topics', topic.id), topic);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `forum_topics/${topic.id}`);
  }
}

export function subscribeForumPosts(callback: (posts: ForumPost[]) => void) {
  return onSnapshot(collection(db, 'forum_posts'), (snap) => {
    const posts: ForumPost[] = [];
    snap.forEach((docSnap) => {
      posts.push({ id: docSnap.id, ...docSnap.data() } as ForumPost);
    });
    callback(posts);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'forum_posts');
  });
}

export async function saveForumPostInFirestore(post: ForumPost) {
  try {
    await setDoc(doc(db, 'forum_posts', post.id), post);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `forum_posts/${post.id}`);
  }
}

export function subscribeChatMessages(callback: (messages: ChatMessage[]) => void) {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const messages: ChatMessage[] = [];
    snap.forEach((docSnap) => {
      messages.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
    });
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'messages');
  });
}

export async function sendChatMessageInFirestore(msg: ChatMessage) {
  try {
    await setDoc(doc(db, 'messages', msg.id), msg);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `messages/${msg.id}`);
  }
}

export async function markMessageAsReadInFirestore(messageId: string) {
  try {
    await updateDoc(doc(db, 'messages', messageId), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `messages/${messageId}`);
  }
}
