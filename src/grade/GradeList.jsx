import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './GradeList.css'

export default function GradeList (props) {
  const [items, setItems] = useState(null)
  const [isDelete, setIsDeleted] = useState(false)
  const [studentFilter, setStudentFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [xueqiFilter, setXueQiFilter] = useState('')

  const navigate = useNavigate()

  const handleEdit = (studentId, courseId) => {
    // 在点击修改按钮时导航到相应的编辑页面，传递学生序号，课程序号
    navigate(`/grades/${studentId}/${courseId}`)
  }

  const handleDelete = async (studentId, courseId) => {
    const confirmDelete = window.confirm('确定要删除吗？')
    if (!confirmDelete) {
      return
    }

    const response = await fetch(`/api/grade/${studentId}/${courseId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      console.error(response)
      return
    }

    setIsDeleted(true) // 设置isDeleted为true，触发重新渲染
  }

  
  // 设置重置按钮
  const handleReset = async () => {
    setStudentFilter("")
    setCourseFilter("")
    setXueQiFilter("")
    let url = '/api/grade/filter'
    const response = await fetch(url)
    if (!response.ok) {
      console.error(response)
      return
    }

    setItems(await response.json())

    console.log('grade list loaded')
  }


  const handleQuery = async () => {
    let url = '/api/grade/filter'

    // 构建查询参数
    const queryParams = []
    if (studentFilter) {
      queryParams.push(`student=${studentFilter}`)
    }
    if (courseFilter) {
      queryParams.push(`course=${courseFilter}`)
    }
    if (xueqiFilter) {
      queryParams.push(`xueqi=${xueqiFilter}`)
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      console.error(response)
      return
    }

    setItems(await response.json())

    console.log('grade list loaded')
  }

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/grade/filter')
      if (!response.ok) {
        console.error(response)
        return
      }

      setItems(await response.json())

      console.log('grade list loaded')
    })()
  }, [isDelete])

  return (
    <div>
      <div>
        <input
          type='text'
          placeholder='筛选学生'
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
        />
        <input
          type='text'
          placeholder='筛选课程'
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        />
        {/* <input
          type='text'
          placeholder='筛选学期'
          value={xueqiFilter}
          onChange={(e) => setXueQiFilter(e.target.value)}
        /> */}
        <select
          value={xueqiFilter}
          onChange={(e) => setXueQiFilter(e.target.value)}
        >
          <option value="">筛选学期</option>
          <option value="2023年春季学期">2023年春季学期</option>
          <option value="2022年秋季学期">2022年秋季学期</option>
          {/* 可以添加更多选项 */}
        </select>
        <button className="btn" onClick={handleQuery}>查询</button>
        <button className="btn" onClick={handleReset}>重置</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>课程</th>
            <th>成绩</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items &&
                        items.map((item) => (
                          <tr key={`${item.stu_sn}-${item.cou_sn}`}>
                            <td>{item.stu_name}</td>
                            <td>{item.cou_name}</td>
                            <td>{item.grade}</td>
                            <td>
                              <button
                                className='btn'
                                onClick={() => handleEdit(item.stu_sn, item.cou_sn)}
                              >
                                修改
                              </button>
                              <button
                                className='btn'
                                onClick={() => handleDelete(item.stu_sn, item.cou_sn)}
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ))}
        </tbody>
      </table>
    </div>
  )
}
