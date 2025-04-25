import styles from "./ImpactStatSection.module.css";
import learningPath from '../../../assets/Icons/ImpactStatsSectionImage/learningPath.svg';
import activeCommuntites from '../../../assets/Icons/ImpactStatsSectionImage/activeCommuntites.svg';
import successStories from '../../../assets/Icons/ImpactStatsSectionImage/successStories.svg';
import totalMember from '../../../assets/Icons/ImpactStatsSectionImage/totalMember.svg';

export default function ImpactStatSection() {


  const statsData = [
    { icon: activeCommuntites, value: '50+', label: 'Active Communities' },
    { icon: totalMember, value: '5,000+', label: 'Total Members' },
    { icon: learningPath, value: '200+', label: 'Learning Paths' },
    { icon: successStories, value: '10,000+', label: 'Success Stories' }
  ];

  return <>

    {/* ImpactStatSection */}
    <section className={`${styles.ImpactStatSection}`}>

      {/* ImpactStatContainer */}
      <div className={`${styles.ImpactStatContainer} specialContainer`}>

        {/* statsContainer */}
        <div className={`${styles.statsContainer} row w-100`}>

          {/* statItem */}
          {statsData.map((stat, index) => (

            <div key={index} className={`${styles.statItem}  col-md-3  col-5 `}>

              {/* icon */}
              <div className={`${styles.icon} `}>
                <img className="w-100" src={stat.icon} alt="" />
              </div>

              <h3 className={`${styles.value}`}>{stat.value}</h3>
              <p className={`${styles.label}`}>{stat.label}</p>
            </div>

          ))}

        </div>
      </div>


    </section>





  </>
}
