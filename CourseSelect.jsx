import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CourseSelect.css'

export default function GradeList (props) {
  const [items, setItems] = useState(null)

  const navigate = useNavigate()
  const handleSelect = (studentId) => {
    // 在点击修改按钮时导航到相应的单个学生选课页面，传递学生序号
    navigate(`/select/${studentId}`)
  }

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/student/list')
      if (!response.ok) {
        console.error(response)
        return
      }

      setItems(await response.json())

      console.log('student list loaded')
    })()
  }, [])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>学号</th>
            <th>性别</th>
            <th>入学时间</th>
            <th>学院</th>
            <th>年级</th>
            <th>班级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items &&
                            items.map((item) => (
                              <tr key={`${item.stu_sn}`}>
                                <td>{item.stu_sn}</td>
                                <td>{item.stu_name}</td>
                                <td>{item.stu_no}</td>
                                <td>{item.stu_gender}</td>
                                <td>{item.stu_enroll_date}</td>
                                <td>{item.stu_academy}</td>
                                <td>{item.stu_grade}</td>
                                <td>{item.stu_class}</td>
                                <td>
                                  <button
                                    className='btn'
                                    onClick={() => handleSelect(item.stu_sn)}
                                  >
                                    选课
                                  </button>
                                </td>
                              </tr>
                            ))}
        </tbody>
      </table>
    </div>
  )
}
