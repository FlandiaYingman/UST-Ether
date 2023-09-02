const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get("/courses", (req, res, next) => {
    const coursesFolder = path.join(__dirname, "courses");
    fs.readdir(coursesFolder, (err, files) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            try {
                const digests = [];
                for (const file of files) {
                    const courseFile = path.join(__dirname, "courses", file);
                    const courseData = JSON.parse(fs.readFileSync(courseFile, "utf-8"));
                    if (courseData.error) {
                        continue;
                    }
                    const digest = {
                        id: courseData.course.id,
                        subject: courseData.course.subject,
                        code: courseData.course.code,
                        name: courseData.course.name,
                        filename: file,
                    };
                    digests.push(digest);
                }
                res.send(digests);
            } catch (err) {
                next(err)
            }
        }
    });
});

app.get("/courses/:filename", (req, res, next) => {
    const courseFile = path.join(__dirname, "courses", req.params.filename);
    fs.readFile(courseFile, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            try {
                const courseData = JSON.parse(data);
                const reviews = courseData.reviews.map((review) => ({
                    semester: review.semester,
                    author: review.author,
                    date: review.date,
                    title: review.title,
                    comment_content: review.comment_content,
                    comment_teaching: review.comment_teaching,
                    comment_grading: review.comment_grading,
                    comment_workload: review.comment_workload,
                    rating_content: convertRatingToLetterGrade(review.rating_content),
                    rating_teaching: convertRatingToLetterGrade(review.rating_teaching),
                    rating_grading: convertRatingToLetterGrade(review.rating_grading),
                    rating_workload: convertRatingToLetterGrade(review.rating_workload),
                }));
                const course = {
                    id: courseData.course.id,
                    subject: courseData.course.subject,
                    code: courseData.course.code,
                    name: courseData.course.name,
                    description: courseData.course.description,
                    rating_content: convertRatingToLetterGrade(courseData.course.rating_content),
                    rating_teaching: convertRatingToLetterGrade(courseData.course.rating_teaching),
                    rating_grading: convertRatingToLetterGrade(courseData.course.rating_grading),
                    rating_workload: convertRatingToLetterGrade(courseData.course.rating_workload),
                    reviews,
                };
                res.send(course);
            } catch (err) {
                next(err)
            }
        }
    });
});

function convertRatingToLetterGrade(rating) {
    if (rating >= 4.5) {
        return "A+";
    } else if (rating >= 4) {
        return "A";
    } else if (rating >= 3.5) {
        return "A-";
    } else if (rating >= 3) {
        return "B+";
    } else if (rating >= 2.5) {
        return "B";
    } else if (rating >= 2) {
        return "B-";
    } else if (rating >= 1.5) {
        return "C+";
    } else if (rating >= 1) {
        return "C";
    } else if (rating >= 0.5) {
        return "C-";
    } else {
        return "D or N/A";
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});