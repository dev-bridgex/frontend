/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./OurTeamsSection.module.css";
import EditTeam from "../Roles/CommunityAdmin/EditTeam/EditTeam";
import { useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Function to construct full image URL
const getFullImageUrl = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) {
    return imgPath;
  }
  return `${baseUrl}/api${imgPath}`;
};

export default function OurTeamsSection({ teams, communityId, canModify, refetch }) {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamData, setSelectedTeamData] = useState(null);

  // Handle edit button click
  const handleEditClick = (teamId) => {
    setSelectedTeamId(teamId);
    // Find the team data from the list
    const teamToEdit = teams.find(team => team.Id === teamId);
    setSelectedTeamData(teamToEdit);
  };

  return (
    <>
      {canModify && selectedTeamData && (
        <EditTeam 
          communityId={communityId} 
          teamId={selectedTeamId}
          refetch={refetch}
          initialData={{
            name: selectedTeamData.Name,
            leaderEmail: selectedTeamData.Leader?.Email
          }} 
        />
      )}

      <section className={`${styles.ourTeamsPage} `}>
        <div className={`${styles.teamsContainer} specialContainer`}>
          <div className={styles.teamsHeader}>
            <h3 className={styles.title}>Our Teams</h3>
          </div>

          {teams.length > 0 ? (
            <div className={`${styles.teamCards} pb-1 `}>
              <div className={`${styles.cardsContainer} row mx-auto w-100 g-5`}>
                {teams.map((team) => (
                  <div key={team.Id} className={`${styles.teamCard} col-lg-4 col-md-6 mx-auto col-sm-9 col-10`}>
                    <div className={styles.teamCardWrapper}>
                      <img
                        src={team.Logo ? getFullImageUrl(team.Logo) : "/placeholder.webp"}
                        alt={team.Name}
                        className={styles.teamCardImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.webp";
                        }}
                      />
                      <div className={`${styles.teamCardContent} `}>
                        <div className={styles.teamContentHeader}>
                          <h4 className={styles.teamCardTitle}>{team.Name}</h4>
                          <p className={styles.numberOfMember}>
                            {team.MembersCount} {team.MembersCount === 1 ? 'member' : 'members'}
                          </p>
                        </div>
                        <p className={styles.teamCardDescription}>
                          {team.DescShort || "No description available"}
                        </p>
                        {/* cardFooter */}
                        <div className={`${styles.cardFooter}`}>
                          <Link to={`/communities/community/${communityId}/teams/${team.Id}`} className={styles.learnMore}>
                            Learn more <i className="fas fa-arrow-right"></i>
                          </Link>
                          {canModify && (
                            <i
                              data-bs-toggle="modal"
                              data-bs-target="#editTeamModal"
                              className={`${styles.editIon} fa-solid fa-pen-to-square`}
                              onClick={() => handleEditClick(team.Id)}
                            ></i>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noTeamsWrapper}>
              <div className={styles.noTeamsContent}>
                <i className="fa-solid fa-users-slash"></i>
                <h4>No Teams Found</h4>
                <p>This community doesn&apos;t have any teams yet.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}