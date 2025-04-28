import { useState, useCallback } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ManageProfile.module.css';
import ProfileHeader from '../../components/ManageProfile/ProfileHeader/ProfileHeader';
import ProfilePhotoSection from '../../components/ManageProfile/ProfilePhotoSection/ProfilePhotoSection';
import ProfileViewMode from '../../components/ManageProfile/ProfileViewMode/ProfileViewMode';
import ProfileEditForm from '../../components/ManageProfile/ProfileEditForm/ProfileEditForm';
import PasswordChangeSection from '../../components/ManageProfile/PasswordChangeSection/PasswordChangeSection';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token');

const fetchUserProfile = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (data.Success) {
      return data.Data;
    }
    throw new Error(data.Message || 'Failed to fetch profile');
  } catch (error) {
    throw new Error(error.response?.data?.Message || 'An error occurred while fetching profile');
  }
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] = useState(false);

  const { data: profileData, isLoading, isError, error, refetch } = useQuery(
    'userProfile',
    fetchUserProfile,
    {
      staleTime: 300000, // 5 minutes
      cacheTime: 3600000, // 1 hour
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false
    }
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    queryClient.setQueryData('userProfile', old => ({
      ...old,
      [name]: value
    }));
  }, [queryClient]);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData) return;

    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${baseUrl}/api/users/profile`,
        {
          FirstName: profileData.FirstName,
          LastName: profileData.LastName,
          StudentId: profileData.StudentId,
          PhoneNumber: profileData.PhoneNumber,
          Usertype: profileData.Usertype
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.Success) {
        toast.success('Profile updated successfully', { position: "top-center" });
        setEditMode(false);
        await refetch();
      } else {
        toast.error(data.Message || 'Failed to update profile', { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response?.data?.Message || 'An error occurred while updating profile', { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match', { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${baseUrl}/api/users/profile/password`,
        {
          NewPassword: passwordForm.newPassword,
          ConfirmPassword: passwordForm.confirmPassword,
          OldPassword: passwordForm.oldPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.Success) {
        toast.success('Password changed successfully', { position: "top-center" });
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsPasswordSectionVisible(false);
      } else {
        toast.error(data.Message || 'Failed to change password', { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response?.data?.Message || 'An error occurred while changing password', { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first', { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const { data } = await axios.post(
        `${baseUrl}/api/users/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.Success) {
        toast.success('Profile photo uploaded successfully', { position: "top-center" });
        setSelectedFile(null);
        await refetch();
      } else {
        toast.error(data.Message || 'Failed to upload photo', { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response?.data?.Message || 'An error occurred while uploading photo', { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${baseUrl}/api/users/profile/photo`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.Success) {
        toast.success('Profile photo deleted successfully', { position: "top-center" });
        await refetch();
      } else {
        toast.error(data.Message || 'Failed to delete photo', { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response?.data?.Message || 'An error occurred while deleting photo', { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (isError) {
    toast.error(error.message, {
      position: "top-center",
      autoClose: 5000,
    });
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  if (!profileData) return null;

  return (
    <section className={styles.manageProfilePage}>
      <ScrollToTop />
      <div className="specialContainer">
        <div className={styles.profileContainer}>
          <ProfileHeader />

          <div className={styles.profileSection}>
            <ProfilePhotoSection
              profileData={profileData} // Pass the entire profileData
              loading={loading}
              onFileChange={handleFileChange}
              onUploadPhoto={handleUploadPhoto}
              onDeletePhoto={handleDeletePhoto}
              selectedFile={selectedFile}
            />

            <div className={`${styles.profileFormSection}`}>
              {!editMode ? (
                <ProfileViewMode
                  profile={{
                    firstName: profileData.FirstName,
                    lastName: profileData.LastName,
                    email: profileData.Email,
                    phoneNumber: profileData.PhoneNumber,
                    studentId: profileData.StudentId,
                    userType: profileData.Usertype
                  }}
                  onEditClick={() => setEditMode(true)}
                />
              ) : (
                <ProfileEditForm
                  profile={{
                    firstName: profileData.FirstName,
                    lastName: profileData.LastName,
                    email: profileData.Email,
                    phoneNumber: profileData.PhoneNumber,
                    studentId: profileData.StudentId,
                    userType: profileData.Usertype
                  }}
                  loading={loading}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  onCancel={() => setEditMode(false)}
                />
              )}

              <button
                type="button"
                onClick={() => setIsPasswordSectionVisible(!isPasswordSectionVisible)}
                className={styles.togglePasswordButton}
              >
                <i className={`fas fa-key`}></i>
                {isPasswordSectionVisible ? 'Hide Password Form' : 'Change Password'}
                <i className={`fas fa-chevron-${isPasswordSectionVisible ? 'up' : 'down'}`}></i>
              </button>

              <PasswordChangeSection
                isVisible={isPasswordSectionVisible}
                passwordForm={passwordForm}
                loading={loading}
                onPasswordChange={handlePasswordChange}
                onSubmit={handlePasswordSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
