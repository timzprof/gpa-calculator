let courses = [];
let course = {};

window.onload = () => {
    if(localStorage.getItem('courseList')){
        let empty = document.getElementById('empty-row')
        empty.style.display = 'none';
        let localCourses = JSON.parse(localStorage.getItem('courseList',courses));
        console.log(localCourses)
        if(localCourses.length > 0){
            localCourses.forEach(course => {
                createRow(course);
            });
        }
    }
}
    

let addCourseForm = document.getElementById('course-form');

let calculateGpaBtn = document.getElementById('calculate-gpa');

const createRow = (params) => {
    let section = document.getElementById('table');
    let article = document.createElement('article');
    article.classList.add('table-row');
    let ul = document.createElement('ul');
    for(key in params){
        let li = document.createElement('li');
        li.classList.add('table-data');
        li.textContent = params[key];
        ul.appendChild(li);
    }
    ul.firstChild.classList.add('blue');
    let delLi = document.createElement('li');
    delLi.classList.add('table-data');
    let delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    let index = courses.indexOf(params);
    delBtn.setAttribute('onclick', `deleteCourse(${index})`);
    delLi.appendChild(delBtn);
    ul.appendChild(delLi);
    article.appendChild(ul);
    section.appendChild(article);
}

function deleteCourse(id) {
    let courseList = JSON.parse(localStorage.getItem('courseList'));
    courseList.splice(id, 1);
    localStorage.removeItem('courseList');
    localStorage.setItem('courseList', JSON.stringify(courseList));
    window.location.reload();
}

const calculateGpa = (courseList) => {
    let courses = JSON.parse(courseList);
    let totalUnits = 0;
    let gradePoints = 0;
    courses.forEach(course => {
            if(course.score > 69){
                gradePoints += course.unit * 5;
            } else if (course.score > 59 && course.score < 70){
                gradePoints += course.unit * 4;
            } else if (course.score > 49 && course.score < 60){
                gradePoints += course.unit * 3;
            } else if (course.score > 44 && course.score < 50){
                gradePoints += course.unit * 2;
            } else if (course.score > 39 && course.score < 45){
                gradePoints += course.unit * 1;
            }else {
                gradePoints += course.unit * 0;
            }
        totalUnits += Number(course.unit);
    });
    return gradePoints / totalUnits;
}
addCourseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let unit = document.getElementById('course-unit');
    let score = document.getElementById('course-score');
    if(!localStorage.getItem('courseList')){
        course = {
            id: 'Course 1',
            unit: unit.value,
            score: score.value
        };
        courses.push(course);
        localStorage.setItem('courseList',JSON.stringify(courses));
    }else {
        let courseList = JSON.parse(localStorage.getItem('courseList'));
        course = {
            id: 'Course ' + (courseList.length + 1),
            unit: unit.value,
            score: score.value
        };
        courseList.push(course);
        localStorage.removeItem('courseList');
        localStorage.setItem('courseList', JSON.stringify(courseList));
    }
    createRow(course);
    addCourseForm.reset();
    if (courses.length > 0) {
        let empty = document.getElementById('empty-row')
        empty.style.display = 'none';
    }
});

document.getElementById('calculate-gpa').addEventListener('click', () => {
    if(JSON.parse(localStorage.getItem('courseList')).length > 0){
        let cgpa = calculateGpa(localStorage.getItem('courseList'));
        document.getElementById('current-gpa').textContent = parseFloat(Math.round(cgpa * 100) / 100).toFixed(2);
        document.getElementById('gpa').style.display = 'block';
    }else {
        alert('Add Courses to Calculate GPA');
    } 
});