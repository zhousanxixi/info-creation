import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CourseInfo.css'

export default function CourseInfo (props) {
  const [items, setItems] = useState(null)
  const [isDelete, setIsDeleted] = useState(false)
  const navigate = useNavigate()

  const handleEdit = (studentId) => {
    // 在点击修改按钮时导航到相应的编辑页面，传递学生序号
    navigate(`/courses/${studentId}`)
  }

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm('确定要删除吗？')
    if (!confirmDelete) {
      return
    }

    const response = await fetch(`/api/course/${studentId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      console.error(response)
      return
    }

    setIsDeleted(true) // 设置isDeleted为true，触发重新渲染
  }

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/course/list')
      if (!response.ok) {
        console.error(response)
        return
      }

      setItems(await response.json())

      console.log('course list loaded')
    })()
  }, [isDelete])

  return (
    <>
      <div className='paper'>
        <div className='paper-head'>
          <button
            className='btn'
            onClick={() => {
              navigate('/courses/new')
            }}
          >
            新建课程信息
          </button>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>课程号</th>
              <th>班次</th>
              <th>课程名称</th>
              <th>学期</th>
              <th>学分</th>
              <th>学时</th>
              <th>任课教师</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {items &&
                        items.map((item) => (
                          <tr key={`${item.course_sn}`}>
                            <td>{item.course_sn}</td>
                            <td>{item.course_no}</td>
                            <td>{item.course_banci}</td>
                            <td>{item.course_name}</td>
                            <td>{item.course_xueqi}</td>
                            <td>{item.course_credit}</td>
                            <td>{item.course_time}</td>
                            <td>{item.course_teacher}</td>
                            <td>
                              <button
                                className='btn'
                                onClick={() => handleEdit(item.course_sn)}
                              >
                                修改
                              </button>
                              <button
                                className='btn'
                                onClick={() => handleDelete(item.course_sn)}
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
