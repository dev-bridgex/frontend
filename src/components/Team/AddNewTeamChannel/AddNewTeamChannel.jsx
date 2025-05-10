/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import styles from './AddNewTeamChannel.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AddNewTeamChannel({ communityId, teamId, refetch }) {
    const [channelName, setChannelName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input change
    const handleChannelNameChange = (e) => {
        const value = e.target.value.replace(/\s/g, ''); // Remove all spaces
        setChannelName(value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!channelName.trim()) {
            toast.error('Channel name cannot be empty', {
                position: "top-center",
                autoClose: 2000
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No authentication token found");
            }

            // Prepare request body
            const requestBody = {
                Name: channelName
            };

            // Make API request
            const response = await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/channels`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        accept: "application/json"
                    }
                }
            );

            if (response.status === 201 || response.status === 200) {
                toast.success('Channel created successfully!', {
                    position: "top-center",
                    autoClose: 2000
                });

                // Reset form
                setChannelName('');
                
                // Close modal
                document.getElementById('closeAddTeamChannelModal').click();
                
                // Refresh channels list
                refetch();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.Message || 'Failed to create channel';
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 3000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.AddNewTeamChannel}>
            <div
                className="modal fade"
                id="addTeamChannelModal"
                tabIndex="-1"
                aria-labelledby="addTeamChannelModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className={`${styles.channelContent} modal-content goldborder`}>
                        <div className={`${styles.channelHeader} modal-header border-0`}>
                            <h4 className={styles.headerTitle} id="addTeamChannelModalLabel">
                                Add New Channel
                            </h4>
                            <i
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                className={`${styles.closeBtn} fas fa-xmark`}
                                id="closeAddTeamChannelModal"
                            ></i>
                        </div>
                        
                        <div className={`${styles.channelBody} modal-body`}>
                            <form className={styles.channelForm} onSubmit={handleSubmit}>
                                <div className={styles.inputsWrapper}>
                                    <div className={styles.inputGroup}>
                                        <label className="lableStyle" htmlFor="channelName">
                                            Channel Name *
                                        </label>
                                        <input
                                            className="inputStyle"
                                            type="text"
                                            id="channelName"
                                            placeholder="Enter Channel Name"
                                            value={channelName}
                                            onChange={handleChannelNameChange}
                                            maxLength={30}
                                            required
                                        />
                                        <div className={styles.characterCount}>
                                            {channelName.length}/30 characters
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={styles.buttonsWrapper}>
                                    <button
                                        className="ButtonStyle"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Creating..." : "Create Channel"}
                                    </button>
                                    <button
                                        type="button"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        className="ButtonStyle"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
