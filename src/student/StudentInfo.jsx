import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentInfo.css'

export default function GradeList (props) {
  const [items, setItems] = useState(null)
  const [isDelete, setIsDeleted] = useState(false)

  const navigate = useNavigate()
  const handleEdit = (studentId) => {
    // 在点击修改按钮时导航到相应的编辑页面，传递学生序号
    navigate(`/students/${studentId}`)
  }

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm('确定要删除吗？')
    if (!confirmDelete) {
      return
    }

    const response = await fetch(`/api/student/${studentId}`, {
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
      const response = await fetch('/api/student/list')
      if (!response.ok) {
        console.error(response)
        return
      }

      setItems(await response.json())

      console.log('student list loaded')
    })()
  }, [isDelete]) // 监听isDelete的变化

  return (
    <>
      <div className='paper'>
        <div className='paper-head'>
          <button
            className='btn'
            onClick={() => {
              navigate('/students/new')
            }}
          >
            新建学生信息
          </button>
        </div>
      </div>
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
                                onClick={() => handleEdit(item.stu_sn)}
                              >
                                修改
                              </button>
                              <button
                                className='btn'
                                onClick={() => handleDelete(item.stu_sn)}
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
