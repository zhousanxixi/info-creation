import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './EntryList.css'

export default function EntryList (props) {
  const [items, setItems] = useState(null)
  const navigate = useNavigate()

  const handleEdit = (courseId) => {
    // 在点击录入按钮时导航到相应的录入页面，传递课程序号
    navigate(`/entry/${courseId}`)
  }

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/course/list')
      if (!response.ok) {
        console.error(response)
        return
      }

      setItems(await response.json())
    })()
  }, [])

  return (

    <div>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>课程号</th>
            <th>班次</th>
            <th>课程名称</th>
            <th>学期</th>
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
                                <td>{item.course_teacher}</td>
                                <td>
                                  <button
                                    className='btn'
                                    onClick={() => handleEdit(item.course_sn)}
                                  >
                                    录入
                                  </button>
                                </td>
                              </tr>
                            ))}
        </tbody>
      </table>
    </div>
  )
}
