// Authentication Service
// Handles user authentication, registration, and data persistence using localStorage

const USERS_KEY = 'chargesphere_users';
const CURRENT_USER_KEY = 'chargesphere_current_user';
const BOOKINGS_KEY = 'chargesphere_bookings';
const FAVORITES_KEY = 'chargesphere_favorites';

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Get all users from localStorage
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Save current user to localStorage
const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  return password.length >= 6;
};

// Register new user
export const signup = (userData) => {
  const { name, email, password, phone, role = USER_ROLES.CUSTOMER } = userData;

  // Validation
  if (!name || !email || !password) {
    return { success: false, error: 'Name, email, and password are required' };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  if (!isValidPassword(password)) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Check if user already exists
  const users = getUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password, // In production, this should be hashed
    phone: phone || '',
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save user
  users.push(newUser);
  saveUsers(users);

  // Auto-login after signup
  const userWithoutPassword = { ...newUser };
  delete userWithoutPassword.password;
  setCurrentUser(userWithoutPassword);

  return { success: true, user: userWithoutPassword };
};

// Login user
export const login = (email, password) => {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Remove password from user object before storing
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  setCurrentUser(userWithoutPassword);

  return { success: true, user: userWithoutPassword };
};

// Logout user
export const logout = () => {
  setCurrentUser(null);
  return { success: true };
};

// Update user profile
export const updateProfile = (userId, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  // Update user data
  const updatedUser = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  // Don't allow changing email to an existing email
  if (updates.email && updates.email !== users[userIndex].email) {
    const emailExists = users.some(
      u => u.id !== userId && u.email.toLowerCase() === updates.email.toLowerCase()
    );
    if (emailExists) {
      return { success: false, error: 'Email already in use' };
    }
  }

  users[userIndex] = updatedUser;
  saveUsers(users);

  // Update current user if it's the logged-in user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const userWithoutPassword = { ...updatedUser };
    delete userWithoutPassword.password;
    setCurrentUser(userWithoutPassword);
    return { success: true, user: userWithoutPassword };
  }

  return { success: true, user: updatedUser };
};

// Check if user has admin role
export const isAdmin = (user) => {
  return user && user.role === USER_ROLES.ADMIN;
};

// Check if user has customer role
export const isCustomer = (user) => {
  return user && user.role === USER_ROLES.CUSTOMER;
};

// ===== BOOKING MANAGEMENT =====

// Get user's bookings
export const getUserBookings = (userId) => {
  const bookings = localStorage.getItem(BOOKINGS_KEY);
  const allBookings = bookings ? JSON.parse(bookings) : [];
  return allBookings.filter(b => b.userId === userId);
};

// Get all bookings (admin only)
export const getAllBookings = () => {
  const bookings = localStorage.getItem(BOOKINGS_KEY);
  return bookings ? JSON.parse(bookings) : [];
};

// Save booking
export const saveBooking = (bookingData) => {
  const bookings = getAllBookings();
  const newBooking = {
    id: Date.now().toString(),
    ...bookingData,
    createdAt: new Date().toISOString(),
    status: 'upcoming'
  };
  bookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return { success: true, booking: newBooking };
};

// Cancel booking
export const cancelBooking = (bookingId, userId) => {
  const bookings = getAllBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId && b.userId === userId);

  if (bookingIndex === -1) {
    return { success: false, error: 'Booking not found' };
  }

  bookings[bookingIndex].status = 'cancelled';
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return { success: true };
};

// ===== FAVORITES MANAGEMENT =====

// Get user's favorite stations
export const getUserFavorites = (userId) => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  const allFavorites = favorites ? JSON.parse(favorites) : {};
  return allFavorites[userId] || [];
};

// Add station to favorites
export const addToFavorites = (userId, stationId) => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  const allFavorites = favorites ? JSON.parse(favorites) : {};

  if (!allFavorites[userId]) {
    allFavorites[userId] = [];
  }

  if (!allFavorites[userId].includes(stationId)) {
    allFavorites[userId].push(stationId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(allFavorites));
  }

  return { success: true };
};

// Remove station from favorites
export const removeFromFavorites = (userId, stationId) => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  const allFavorites = favorites ? JSON.parse(favorites) : {};

  if (allFavorites[userId]) {
    allFavorites[userId] = allFavorites[userId].filter(id => id !== stationId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(allFavorites));
  }

  return { success: true };
};

// Check if station is favorited
export const isFavorite = (userId, stationId) => {
  const favorites = getUserFavorites(userId);
  return favorites.includes(stationId);
};

// ===== ADMIN FUNCTIONS =====

// Get all users (admin only)
export const getAllUsers = () => {
  return getUsers().map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

// Update user role (admin only)
export const updateUserRole = (userId, newRole) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  users[userIndex].role = newRole;
  users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(users);

  return { success: true };
};

// Delete user (admin only)
export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);

  if (users.length === filteredUsers.length) {
    return { success: false, error: 'User not found' };
  }

  saveUsers(filteredUsers);
  return { success: true };
};

// Get statistics (admin only)
export const getStatistics = () => {
  const users = getAllUsers();
  const bookings = getAllBookings();

  return {
    totalUsers: users.length,
    totalCustomers: users.filter(u => u.role === USER_ROLES.CUSTOMER).length,
    totalAdmins: users.filter(u => u.role === USER_ROLES.ADMIN).length,
    totalBookings: bookings.length,
    upcomingBookings: bookings.filter(b => b.status === 'upcoming').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length
  };
};
