import UploadCommunityInfo from "./components/UploadCommunityInfo/UploadCommunityInfo";
import UploadCommunityImages from "./components/UploadCommunityImages/UploadCommunityImages";
import UploadCommunityLogo from "./components/UploadCommunityLogo/UploadCommunityLogo";
import styles from "./UpdateCommunityData.module.css";

// eslint-disable-next-line react/prop-types
export default function UpdateCommunityData({ communityId, refetch }) {

  return (

    // UpdateCommunityData
    <section className={`${styles.UpdateCommunityData}  `}>

      {/*updateCommunityModal */}
      <div className="modal fade" id="updateCommunityModal" tabIndex="-1" aria-labelledby="updateCommunityModalLabel" aria-hidden="true">

        {/* modal-dialog */}
        <div className="modal-dialog modal-dialog-centered modal-xl ">

          {/* updateCommunityContent */}
          <div className={`modal-content ${styles.updateCommunityContent}`}>

            {/* modalHeader */}
            <div className={`modal-header ${styles.modalHeader}`}>
              <h4 className={styles.headerTitle} id="updateCommunityModalLabel">Update Community Data</h4>
              <i className={`${styles.closeBtn} fas fa-xmark`} data-bs-dismiss="modal" aria-label="Close"></i>
            </div>

            {/* updateCommunityBody */}
            <div className={`modal-body ${styles.updateCommunityBody}`}>

              {/* UploadCommunityImages */}
              <UploadCommunityImages communityId={communityId} refetch={refetch} />



              <UploadCommunityLogo communityId={communityId} refetch={refetch} />


              <UploadCommunityInfo communityId={communityId} refetch={refetch} />


            </div>



          </div>
        </div>
      </div>
    </section>
  );
}
