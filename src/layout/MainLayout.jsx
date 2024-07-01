import './MainLayout.css'
import logo from './logo.png'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { StudentEdit, StudentInfo, StudentNew } from '../student'
import { CourseEdit, CourseInfo, CourseNew } from '../course'
import { EntryList, EntryImport, EntryEdit } from '../entry'
import { GradeList, GradeEdit } from '../grade'
import CourseSelect from '../select/CourseSelect'
import SelectList from '../select/SelectList'

const MainLayout = ({ children }) => {
  return (
    <div className='main-layout'>
      <header className='header'>
        <img src={logo} alt="logo" /><h1>学生成绩管理系统</h1>
      </header>

      <BrowserRouter>
        <nav className='sidebar'>
          <ul>
            <li>
              <NavLink to='/students'>学生信息</NavLink>
            </li>
            <li>
              <NavLink to='/courses'>课程信息</NavLink>
            </li>
            <li>
              <NavLink to='/grades'>成绩信息</NavLink>
            </li>
            <li>
              <NavLink to='/select'>选课管理</NavLink>
            </li>
            <li>
              <NavLink to='/entry'>成绩录入</NavLink>
            </li>
          </ul>
        </nav>

        <main className='main-content'>
          <Routes>
            <Route path='/students' element={<StudentInfo />} />
            <Route path='/students/new' element={<StudentNew />} />
            <Route path='/students/:stuSn' element={<StudentEdit />} />
            <Route path='/grades' element={<GradeList />} />
            <Route path='/grades/:stuSn/:couSn' element={<GradeEdit />} />
            <Route path='/courses' element={<CourseInfo />} />
            <Route path='/courses/new' element={<CourseNew />} />
            <Route path='/courses/:couSn' element={<CourseEdit />} />
            <Route path='/select' element={<CourseSelect />} />
            <Route path='/entry' element={<EntryList />} />
            <Route path='/entry/:couSn' element={<EntryImport />} />
            <Route path='/entry/:couSn/:stuSn' element={<EntryEdit />} />
            <Route path='/select/:stuSn' element={<SelectList />} />
          </Routes>
        </main>
      </BrowserRouter>

      <footer className='footer'>
        &copy; {new Date().getFullYear()} 天津工业大学经济与管理学院. All rights reserved.
      </footer>
    </div>
  )
}

export default MainLayout
