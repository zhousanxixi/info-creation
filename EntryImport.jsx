import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EntryList.css'

export default function EntryImport (props) {
  const { couSn } = useParams()

  const [items, setItems] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [grade, setGrade] = useState('')

  const navigate = useNavigate()

  const handleEdit = (studentId, courseId) => {
    // 在点击录入按钮时导航到相应的编辑页面，传递学生序号，课程序号
    navigate(`/entry/${courseId}/${studentId}`)
  }

  const handleEntry = async () => {
    try {
      const response = await fetch('/api/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentName,
          grade,
          courseId: couSn
        })
      })

      if (!response.ok) {
        console.error(response)
        return
      }

      setStudentName('')
      setGrade('')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/entry/list/${couSn}`)
      if (!response.ok) {
        console.error(response)
        return
      }

      setItems(await response.json())

      console.log('grade list loaded')
    })()
  }, [grade])

  return (
    <div>
      <div className='input-container'>
        <input
          type='text'
          placeholder='学生姓名'
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type='text'
          placeholder='成绩'
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <button className='btn' onClick={handleEntry}>
          录入
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>成绩</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items &&
                        items.map((item) => (
                          <tr key={`${item.stu_sn}-${item.cou_sn}`}>
                            <td>{item.stu_name}</td>
                            <td>{item.grade}</td>
                            <td>
                              <button
                                className='btn'
                                onClick={() => handleEdit(item.stu_sn, item.cou_sn)}
                              >
                                修改
                              </button>
                            </td>
                          </tr>
                        ))}
        </tbody>
      </table>
    </div>
  )
}
