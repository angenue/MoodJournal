
import styles from '../styles/ImageGallery.module.css'; // Adjust the path as needed

const ImageGallery = () => {
    return (
        <div className={styles.imagesContainer}>
            <div className={styles.imageItem}>
                <img src="/DiarySubmission.png" alt="Keep track of your moods throughout the day, month, and year!" />
                <p>Keep track of your moods throughout the day, month, and year!</p>
            </div>
            <div className={styles.imageItem}>
                <img src="/MultiCalendarView.png" alt="Dynamic and easy-to-use interactive calendar interface, allowing you to effortlessly navigate and review
past journal entries. Each mood has its own designated color!" />
                <p>Dynamic and easy-to-use interactive calendar interface, allowing you to effortlessly navigate and review
past journal entries. Each mood has its own designated color!</p>
            </div>
            <div className={styles.imageItem}>
                <img src="/MoodData.png" alt=" Mood trend visualization, providing you with insightful analytics of your emotional
patterns over time
" />
                <p>Mood trend visualization, providing you with insightful analytics of your emotional
patterns over time</p>
            </div>
        </div>
    );
};

export default ImageGallery;
