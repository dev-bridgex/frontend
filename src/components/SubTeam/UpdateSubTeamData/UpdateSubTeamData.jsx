/* eslint-disable react/prop-types */
import UploadSubTeamImages from "./Components/UploadSubTeamImages/UploadSubTeamImages";
import styles from "./UpdateSubTeamData.module.css";
import UploadSubTeamLogo from './components/UploadSubTeamLogo/UploadSubTeamLogo';
import UploadSubTeamInfo from './components/UploadSubTeamInfo/UploadSubTeamInfo';

export default function UpdateSubTeamData({ communityId, teamId, subTeamId, refetch }) {
  return (
    <section className={`${styles.UpdateSubTeamData}`}>
      {/* updateSubTeamModal */}
      <div className="modal fade" id="updateSubTeamModal" tabIndex="-1" aria-labelledby="updateSubTeamModalLabel" aria-hidden="true">
        {/* modal-dialog */}
        <div className="modal-dialog modal-dialog-centered modal-xl">
          {/* updateSubTeamContent */}
          <div className={`modal-content ${styles.updateSubTeamContent}`}>
            {/* modalHeader */}
            <div className={`modal-header ${styles.modalHeader}`}>
              <h4 className={styles.headerTitle} id="updateSubTeamModalLabel">Update Sub-Team Data</h4>
              <i className={`${styles.closeBtn} fas fa-xmark`} data-bs-dismiss="modal" aria-label="Close"></i>
            </div>

            {/* updateSubTeamBody */}
            <div className={`modal-body ${styles.updateSubTeamBody}`}>
              <UploadSubTeamImages communityId={communityId} teamId={teamId} subTeamId={subTeamId} refetch={refetch} />
              <UploadSubTeamLogo communityId={communityId} teamId={teamId} subTeamId={subTeamId} refetch={refetch} />
              <UploadSubTeamInfo communityId={communityId} teamId={teamId} subTeamId={subTeamId} refetch={refetch} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
