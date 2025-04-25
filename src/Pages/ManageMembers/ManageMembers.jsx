import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ManageMembers.module.css';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

const fetchMembers = async (communityId, teamId, subTeamId) => {
    try {
        const { data } = await axios.get(
            `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/members`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return data?.Data?.Data || [];
    } catch (error) {
        throw new Error(error.response?.data?.Message || 'Failed to fetch members');
    }
};

export default function ManageMembers() {
    const { communityId, teamId, subTeamId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const handleChangeRole = async (memberId) => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/members/${memberId}/head`,
                {},
                {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Member role changed successfully!', {
                    position: "top-center",
                    autoClose: 2000
                });
                // Refresh the members data
                queryClient.invalidateQueries(['subTeamMembers', communityId, teamId, subTeamId]);
            }
        } catch (error) {
            toast.error(error.response?.data?.Message || 'Failed to change member role', {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/members/${memberId}/decline`,
                {},
                {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Member removed successfully!', {
                    position: "top-center",
                    autoClose: 2000
                });
                // Refresh the members data
                queryClient.invalidateQueries(['subTeamMembers', communityId, teamId, subTeamId]);
            }
        } catch (error) {
            toast.error(error.response?.data?.Message || 'Failed to remove member', {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const handleAcceptMember = async (memberId) => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/communities/${communityId}/teams/${teamId}/subteams/${subTeamId}/members/${memberId}/accept`,
                {},
                {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Member accepted successfully!', {
                    position: "top-center",
                    autoClose: 2000
                });
                // Refresh the members data
                queryClient.invalidateQueries(['subTeamMembers', communityId, teamId, subTeamId]);
            }
        } catch (error) {
            toast.error(error.response?.data?.Message || 'Failed to accept member', {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const { data: members, isLoading, error } = useQuery(
        ['subTeamMembers', communityId, teamId, subTeamId],
        () => fetchMembers(communityId, teamId, subTeamId),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        }
    );
    
    

    if (isLoading) return <LoadingScreen />;
    if (error) {
        toast.error(error.message);
        return <div className={styles.error}>Error: {error.message}</div>;
    }

    return <>
        <section className={`${styles.manageMemberPage}`}>

            <div className={`${styles.manageMembersContainer} specialContainer`} >

                <div className={styles.header}>
                    <h1>Manage Members</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className={styles.backButton}
                    >
                        Back to SubTeam
                    </button>
                </div>

                <div className={styles.membersTableContainer}>
                    <table className={styles.membersTable}>
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Join Date</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members?.map((member) => (
                                <tr key={member.Id}>
                                    <td>
                                        <div className={styles.profilePhoto}>
                                            {member.User.ProfilePhoto ? (
                                                <img
                                                    src={member.User.ProfilePhoto}
                                                    alt={member.User.FirstName}
                                                />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}>
                                                    {member.User.FirstName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{member.User.FirstName}</td>
                                    <td>{member.User.Email}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${member.IsAccepted
                                            ? styles.accepted
                                            : styles.pending
                                            }`}>
                                            {member.IsAccepted ? 'Accepted' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {member.JoinDate
                                            ? new Date(member.JoinDate).toLocaleDateString()
                                            : '--'}
                                    </td>
                                    <td>
                                        {member.IsHead ? (
                                            <span className={styles.headBadge}>Head</span>
                                        ) : (
                                            <span className={styles.memberBadge}>Member</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            {!member.IsAccepted && (
                                                <button
                                                    className={styles.actionButton}
                                                    title="Accept Member"
                                                    onClick={() => handleAcceptMember(member.Id)}
                                                >
                                                    <i className="fa-solid fa-check"></i>
                                                </button>
                                            )}
                                            <button
                                                className={styles.actionButton}
                                                title="Change Role"
                                                disabled={!member.IsAccepted}
                                                onClick={() => handleChangeRole(member.Id)}
                                            >
                                                <i className="fa-solid fa-user-shield"></i>
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                title="Remove Member"
                                                onClick={() => handleRemoveMember(member.Id)}
                                            >
                                                <i className="fa-solid fa-user-minus"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <h3>Total Members</h3>
                        <p>{members?.length || 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Heads</h3>
                        <p>{members?.filter(m => m.IsHead).length || 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Pending</h3>
                        <p>{members?.filter(m => !m.IsAccepted).length || 0}</p>
                    </div>
                </div>

            </div>
        </section>


    </>

}
