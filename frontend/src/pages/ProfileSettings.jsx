import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { Eye, EyeOff, Bell, BellOff, Camera } from 'lucide-react';

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    newPassword: '',
    currentPassword: '',
    notifications: true,
    profilePicture: null,
    photoURL: '',
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const { displayName, email, photoURL, uid } = currentUser;
        const docSnap = await getDoc(doc(db, 'users', uid));
        const userData = docSnap.exists() ? docSnap.data() : {};

        setProfile({
          name: displayName || '',
          email: email || '',
          phone: userData.phone || '',
          password: '',
          newPassword: '',
          currentPassword: '',
          notifications: userData.notifications !== undefined ? userData.notifications : true,
          profilePicture: null,
          photoURL: photoURL || '',
        });
        setPreview(photoURL || null);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setProfile((prev) => ({ ...prev, profilePicture: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else if (type === 'checkbox') {
      setProfile((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const reauthenticate = async () => {
    const cred = EmailAuthProvider.credential(user.email, profile.currentPassword);
    await reauthenticateWithCredential(user, cred);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Re-authenticate if updating email or password
      if (profile.email !== user.email || profile.newPassword) {
        if (!profile.currentPassword) {
          throw new Error('Please enter your current password to update email or password.');
        }
        await reauthenticate();
      }

      // Update Firebase Auth profile
      if (profile.name !== user.displayName) {
        await updateProfile(user, { displayName: profile.name });
      }

      if (profile.email !== user.email) {
        await updateEmail(user, profile.email);
      }

      if (profile.newPassword) {
        await updatePassword(user, profile.newPassword);
      }

      // Upload profile picture if changed
      let photoURL = profile.photoURL;
      if (profile.profilePicture) {
        const fileRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(fileRef, profile.profilePicture);
        photoURL = await getDownloadURL(fileRef);
        await updateProfile(user, { photoURL });
      }

      // Update Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          phone: profile.phone,
          notifications: profile.notifications,
          photoURL,
        },
        { merge: true }
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!user) return;
    setProfile((prev) => ({
      ...prev,
      name: user.displayName || '',
      email: user.email || '',
      phone: '',
      password: '',
      newPassword: '',
      currentPassword: '',
      profilePicture: null,
      photoURL: user.photoURL || '',
    }));
    setPreview(user.photoURL || null);
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Profile Settings</h2>

      {saved && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center font-medium mb-4">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <img
              src={preview || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-semibold text-gray-700">{profile.name}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Enable Notifications</span>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="notifications"
                checked={profile.notifications}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`block w-12 h-7 rounded-full transition ${
                  profile.notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                  profile.notifications ? 'translate-x-5' : ''
                }`}
              ></div>
            </div>
            {profile.notifications ? (
              <Bell className="ml-3 text-blue-600 w-5 h-5" />
            ) : (
              <BellOff className="ml-3 text-gray-400 w-5 h-5" />
            )}
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
