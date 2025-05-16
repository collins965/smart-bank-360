import React, { useEffect, useState } from 'react';
import {
  Eye, EyeOff, ShieldCheck, ShieldX, Smartphone, LogOut
} from 'lucide-react';
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
  collection,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userId, setUserId] = useState(null);
  const [devices, setDevices] = useState([]);

  // Track current authenticated user and setup listeners
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          // Fetch twoFA status
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTwoFA(data.twoFA || false);
          }

          // Listen to real-time device sessions
          const sessionRef = collection(db, 'users', user.uid, 'sessions');
          const unsubscribeSessions = onSnapshot(sessionRef, (snapshot) => {
            const activeSessions = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDevices(activeSessions);
          });

          return () => unsubscribeSessions();
        } catch (error) {
          console.error('Error initializing security settings:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle password update logic
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({ type: 'error', message: 'All fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Password update failed:', error);
      setFeedback({ type: 'error', message: error.message });
    }
  };

  // Toggle 2FA and update in Firestore
  const handleTwoFAToggle = async () => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      const updatedTwoFA = !twoFA;
      await updateDoc(userRef, { twoFA: updatedTwoFA });
      setTwoFA(updatedTwoFA);
      setFeedback({ type: 'success', message: `2FA ${updatedTwoFA ? 'enabled' : 'disabled'}.` });
    } catch (error) {
      console.error('2FA toggle error:', error);
      setFeedback({ type: 'error', message: 'Failed to update 2FA setting.' });
    }
  };

  // Revoke a single device session
  const handleDeviceLogout = async (sessionId) => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'sessions', sessionId));
      setFeedback({ type: 'success', message: 'Session revoked.' });
    } catch (error) {
      console.error('Revoke session failed:', error);
      setFeedback({ type: 'error', message: 'Failed to revoke session.' });
    }
  };

  // Revoke all device sessions
  const handleLogoutAll = async () => {
    try {
      const sessionRef = collection(db, 'users', userId, 'sessions');
      const snapshot = await getDoc(doc(db, 'users', userId)); // To check user exists
      if (!snapshot.exists()) return;

      const sessionSnap = await onSnapshot(sessionRef, () => {});
      sessionSnap.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setFeedback({ type: 'success', message: 'Logged out from all devices.' });
    } catch (error) {
      console.error('Log out all error:', error);
      setFeedback({ type: 'error', message: 'Failed to log out of all devices.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-lg border-t-4 border-blue-500">
      <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Security Settings</h2>

      {feedback && (
        <div
          className={`p-3 rounded text-center mb-6 ${
            feedback.type === 'success'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">New Password</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative">
          <label className="block font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-emerald-500"
          />
          <span
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute top-9 right-3 text-gray-600 cursor-pointer"
          >
            {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-2 rounded-lg transition"
        >
          Update Password
        </button>
      </form>

      {/* Two-Factor Auth */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Enhance your account security by enabling 2FA.</p>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={twoFA} onChange={handleTwoFAToggle} className="sr-only" />
            <div
              className={`w-12 h-7 bg-gray-300 rounded-full relative transition ${
                twoFA ? 'bg-emerald-600' : ''
              }`}
            >
              <div
                className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition ${
                  twoFA ? 'translate-x-5' : ''
                }`}
              />
            </div>
            <span className="ml-3">
              {twoFA ? (
                <ShieldCheck className="text-emerald-600 w-5 h-5" />
              ) : (
                <ShieldX className="text-gray-500 w-5 h-5" />
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Sessions</h3>
        {devices.length > 0 ? (
          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex justify-between items-center p-4 border rounded-lg bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <Smartphone size={18} />
                    {device.name || 'Unknown Device'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {device.location || 'Unknown Location'} • Last active {device.lastActive || 'unknown'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeviceLogout(device.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Revoke
                </button>
              </div>
            ))}
            <button
              onClick={handleLogoutAll}
              className="flex items-center gap-2 text-sm text-red-700 font-medium hover:underline mt-2"
            >
              <LogOut size={16} />
              Log out of all devices
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No active sessions.</p>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
