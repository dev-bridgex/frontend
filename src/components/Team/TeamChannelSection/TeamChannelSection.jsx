/* eslint-disable react/prop-types */
import { useQuery } from 'react-query';
import axios from 'axios';
import styles from "./TeamChannelSection.module.css";
import LoadingScreen from '../../LoadingScreen/LoadingScreen';
import ErrorDisplay from '../../ErrorDisplay/ErrorDisplay';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddNewTeamChannel from '../AddNewTeamChannel/AddNewTeamChannel';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Fetch channels function for team level
const fetchTeamChannels = async (communityId, teamId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${baseUrl}/api/communities/${communityId}/teams/${teamId}/channels`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: 'application/json'
                }
            }
        );


        return response.data.Data;
    } catch (error) {
        throw new Error(error.response?.data?.Message || 'Failed to fetch team channels data');
    }
};

export default function TeamChannelSection({ communityId, teamId, CanModify, isMember }) {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);
    const [newChannelName, setNewChannelName] = useState("");

    // Fetch channels data with React Query
    const {
        data: channelsData,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery(
        ['teamChannels', communityId, teamId],
        () => fetchTeamChannels(communityId, teamId),
        {
            staleTime: Infinity,
            cacheTime: 3600000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: false,
            enabled: !!communityId && !!teamId
        }
    );

    // Handle channel click with permission check
    const handleChannelClick = (channelId, channelName) => {

        if (isMember || CanModify) {
            navigate(`/communities/${communityId}/teams/${teamId}/channels/${channelName}/${channelId}`);
        } else {
            toast.error(
                <div className={styles.accessDeniedToast}>
                    <i className="fa-solid fa-lock"></i>
                    <div>
                        <strong>Access Restricted</strong>
                        <p>You need to create an account and join this team to access channels.</p>
                    </div>
                </div>,
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }
    };

    // Handle channel deletion
    const handleDeleteChannel = async (channelId, e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete button

        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Delete Channel',
            text: 'Are you sure you want to delete this channel? This action cannot be undone and all messages will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        // If user confirms deletion
        if (result.isConfirmed) {
            setIsDeleting(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    `${baseUrl}/api/communities/${communityId}/teams/${teamId}/channels/${channelId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'accept': '*/*'
                        }
                    }
                );

                if (response.status === 200 || response.status === 204) {
                    toast.success('Channel deleted successfully!', {
                        position: "top-center",
                        autoClose: 2000
                    });
                    refetch(); // Refresh the channels list
                }
            } catch (error) {
                const errorMessage = error.response?.data?.Message || 'Failed to delete channel';
                toast.error(errorMessage, {
                    position: "top-center",
                    autoClose: 3000
                });
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Handle edit channel mode
    const handleEditClick = (channel, e) => {
        e.stopPropagation(); // Prevent navigation
        setEditingChannel(channel.Id);
        setNewChannelName(channel.Name);
    };

    // Handle input change for channel name update
    const handleChannelNameChange = (e) => {
        const value = e.target.value.replace(/\s/g, ''); // Remove all spaces
        setNewChannelName(value);
    };

    // Handle channel name update
    const handleUpdateChannel = async (channelId, e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation

        if (!newChannelName.trim()) {
            toast.error('Channel name cannot be empty', {
                position: "top-center",
                autoClose: 2000
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No authentication token found");
            }

            // Prepare request body
            const requestBody = {
                Name: newChannelName
            };

            await axios.patch(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/channels/${channelId}`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        accept: "*/*"
                    }
                }
            );

            toast.success('Channel name updated successfully!', {
                position: "top-center",
                autoClose: 2000
            });

            // Reset form and refresh data
            setEditingChannel(null);
            setNewChannelName("");
            refetch(); // Refresh the channels list

        } catch (error) {
            const message = error.response?.data?.Message || error.message || "Failed to update channel name";
            toast.error(message, {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    // Cancel editing
    const handleCancelEdit = (e) => {
        e.stopPropagation(); // Prevent navigation
        setEditingChannel(null);
        setNewChannelName("");
    };

    // Loading state
    if (isLoading) return <LoadingScreen />;

    // Error state
    if (isError) return <ErrorDisplay error={error} onRetry={refetch} />;

    return (
        <>
            <section className={styles.channelsSection}>


                {CanModify && (
                    <div className={styles.addChannelCenter}>
                        <button
                            className={`${styles.addChannelButton} ButtonStyle`}
                            title="Add New Channel"
                            data-bs-toggle="modal"
                            data-bs-target="#addTeamChannelModal"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Add New Channel</span>
                        </button>
                    </div>
                )}
                <div className={styles.channelsContainer}>


                    <div className={styles.channelsHeader}>
                        <h3 className={styles.title}>Team Channels</h3>
                    </div>

                    <div className={styles.channelContent}>
                        {!channelsData || channelsData.length === 0 ? (
                            <div className={styles.emptyChannels}>
                                <p>No channels available</p>
                            </div>
                        ) : (
                            channelsData.map((channel) => (
                                <div
                                    key={channel.Id}
                                    className={styles.channel}
                                    onClick={() => handleChannelClick(channel.Id, channel.Name)}
                                >
                                    {editingChannel === channel.Id ? (
                                        <form
                                            className={styles.editChannelForm}
                                            onSubmit={(e) => handleUpdateChannel(channel.Id, e)}
                                            onClick={(e) => e.stopPropagation()} // Add this to prevent click propagation
                                        >
                                            <input
                                                type="text"
                                                value={newChannelName}
                                                onChange={handleChannelNameChange}
                                                onClick={(e) => e.stopPropagation()}
                                                autoFocus
                                            />
                                            <div className={styles.editActions}>
                                                <button
                                                    type="submit"
                                                    className={styles.saveButton}
                                                    title="Save"
                                                    onClick={(e) => e.stopPropagation()} // Add this to prevent click propagation
                                                >
                                                    <i className="fa-solid fa-check"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ensure propagation is stopped
                                                        handleCancelEdit(e);
                                                    }}
                                                    title="Cancel"
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <span className={styles.channelName}>{channel.Name}</span>
                                            {CanModify && (
                                                <div className={styles.channelActions}>
                                                    <button
                                                        className={styles.editButton}
                                                        onClick={(e) => handleEditClick(channel, e)}
                                                        title="Edit Channel"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={(e) => handleDeleteChannel(channel.Id, e)}
                                                        disabled={isDeleting}
                                                        title="Delete Channel"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </section>
            {CanModify && <AddNewTeamChannel communityId={communityId} teamId={teamId} refetch={refetch} />}
            <ToastContainer />
        </>
    );
}

