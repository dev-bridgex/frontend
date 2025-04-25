/* eslint-disable react/prop-types */
import UploadTeamImages from "./components/UploadTeamImages/UploadTeamImages";
import styles from "./UpdateTeamData.module.css";
import UploadTeamLogo from './components/UploadTeamLogo/UploadTeamLogo';
import UploadTeamInfo from './components/UploadTeamInfo/UploadTeamInfo';
import AddAchievement from "./components/AddAchievement/AddAchievement";

export default function UpdateTeamData({ teamId, communityId, refetch }) {
  return (
    <section className={`${styles.UpdateTeamData}`}>
      {/* updateTeamModal */}
      <div className="modal fade" id="updateTeamModal" tabIndex="-1" aria-labelledby="updateTeamModalLabel" aria-hidden="true">
        {/* modal-dialog */}
        <div className="modal-dialog modal-dialog-centered modal-xl">
          {/* updateTeamContent */}
          <div className={`modal-content ${styles.updateTeamContent}`}>
            {/* modalHeader */}
            <div className={`modal-header ${styles.modalHeader}`}>
              <h4 className={styles.headerTitle} id="updateTeamModalLabel">Update Team Data</h4>
              <i className={`${styles.closeBtn} fas fa-xmark`} data-bs-dismiss="modal" aria-label="Close"></i>
            </div>

            {/* updateTeamBody */}
            <div className={`modal-body ${styles.updateTeamBody}`}>
              <UploadTeamImages teamId={teamId} communityId={communityId} refetch={refetch} />
              <UploadTeamLogo teamId={teamId} communityId={communityId} refetch={refetch} />
              <UploadTeamInfo teamId={teamId} communityId={communityId} refetch={refetch} />
              <AddAchievement teamId={teamId} communityId={communityId} refetch={refetch} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}