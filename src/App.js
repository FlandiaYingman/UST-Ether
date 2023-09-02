import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      const response = await fetch("http://localhost:4000/courses");
      const digests = await response.json();
      setCourses(digests);
    }

    fetchCourses();
  }, []);

  async function fetchCourseDetails(filename) {
    const response = await fetch(`http://localhost:4000/courses/${filename}`);
    const course = await response.json();
    setSelectedCourse(course);
  }

  function handleCourseClick(course) {
    fetchCourseDetails(course.filename);
  }

  function handleSearchInput(event) {
    setSearchText(event.target.value);
  }

  const filteredCourses = courses.filter((course) => {
    const subjectMatch = course.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const codeMatch = course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = course.name.toLowerCase().includes(searchTerm.toLowerCase());

    const stringMatch = `${course.subject} ${course.code}`.toLowerCase().includes(searchTerm.toLowerCase())

    return subjectMatch || codeMatch || nameMatch || stringMatch;
  });

  return (
    <div className="App">
      <div className="left-panel">
        <input
          id="search"
          type="text"
          placeholder="Type and press Enter to search."
          value={searchText}
          onChange={handleSearchInput}
          onKeyDown={(event) => { if (event.key === 'Enter') setSearchTerm(searchText) }}
        />
        <ul id="list">
          {filteredCourses.map((course) => (
            <li key={course.id} onClick={() => handleCourseClick(course)}>
              {course.subject} {course.code}: {course.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="right-panel">
        {selectedCourse && (
          <div class="course">
            <h1>
              {selectedCourse.subject} {selectedCourse.code}: {selectedCourse.name}
            </h1>
            <p>{selectedCourse.description}</p>
            <p>Rating Content: {selectedCourse.rating_content}</p>
            <p>Rating Teaching: {selectedCourse.rating_teaching}</p>
            <p>Rating Grading: {selectedCourse.rating_grading}</p>
            <p>Rating Workload: {selectedCourse.rating_workload}</p>
            <h2>Reviews</h2>
            {selectedCourse.reviews.map((review) => (
              <div class="review" key={review.id}>
                <h3>{review.author}: <span dangerouslySetInnerHTML={{ __html: review.title }}></span></h3>
                <div>
                  <p>Semester: {review.semester}</p>
                  <p>Date: {review.date}</p>
                  <p>Rating Content: {review.rating_content}</p>
                  <p>Rating Teaching: {review.rating_teaching}</p>
                  <p>Rating Grading: {review.rating_grading}</p>
                  <p>Rating Workload: {review.rating_workload}</p>
                  <h4>Content</h4>
                  <div dangerouslySetInnerHTML={{ __html: review.comment_content }} />
                  <h4>Teaching</h4>
                  <div dangerouslySetInnerHTML={{ __html: review.comment_teaching }} />
                  <h4>Grading</h4>
                  <div dangerouslySetInnerHTML={{ __html: review.comment_grading }} />
                  <h4>Workload</h4>
                  <div dangerouslySetInnerHTML={{ __html: review.comment_workload }} />
                </div>
                <hr></hr>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;