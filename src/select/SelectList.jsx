import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { fetcher } from '../utils'
import './CourseSelect.css'

export default function SelectList (props) {
  const { stuSn } = useParams()

  const { data: stuinfo, error } = useSWR(`/api/student/${stuSn}`, fetcher)
  const [items, setItems] = useState(null)
  const [selectionStatus, setSelectionStatus] = useState({})

  const handleSelect = async (studentId, courseId, banId) => {
    const isAlreadySelected = await checkSelection(studentId, courseId, banId)

    if (isAlreadySelected) {
      handleDeselect(studentId, courseId, banId)
    } else {
      handleEnroll(studentId, courseId, banId)
    }
  }

  const checkSelection = async (studentId, courseId, banId) => {
    try {
      const response = await fetch(
                `/api/select/check?studentId=${studentId}&courseId=${courseId}&banId=${banId}`
      )
      const data = await response.json()
      return data.isAlreadySelected
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const handleEnroll = async (studentId, courseId, banId) => {
    try {
      const response = await fetch('/api/select/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId,
          courseId,
          banId
        })
      })

      if (!response.ok) {
        console.error(response)
        return
      }

      setSelectionStatus((prevStatus) => ({
        ...prevStatus,
        [`${studentId}-${courseId}-${banId}`]: true
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeselect = async (studentId, courseId, banId) => {
    try {
      const response = await fetch('/api/select/deselect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId,
          courseId,
          banId
        })
      })

      if (!response.ok) {
        console.error(response)
        return
      }

      setSelectionStatus((prevStatus) => ({
        ...prevStatus,
        [`${studentId}-${courseId}-${banId}`]: false
      }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const response = await fetch('/api/course/list')
        if (!response.ok) {
          console.error(response)
          return
        }

        const courseList = await response.json()

        setItems(courseList)
        console.log('course list loaded')
      } catch (error) {
        console.error(error)
      }
    }

    const fetchSelectionStatus = async () => {
      // 这里有点小问题，还没有想好怎么修复
      try {
        const response = await fetch(`/api/select/status/${stuSn}`)
        if (!response.ok) {
          console.error(response)
          return
        }

        const selectionStatusData = await response.json()

        setSelectionStatus(selectionStatusData)
        console.log('selection status loaded')
      } catch (error) {
        console.error(error)
      }
    }

    fetchCourseList()
    fetchSelectionStatus()
  }, [stuSn])

  if (error) {
    return (
      <div className='paper'>
        <div>数据加载失败</div>
      </div>
    )
  }

  if (!stuinfo || !items) {
    return (
      <div className='paper'>
        <div>数据加载中...</div>
      </div>
    )
  }

  return (
    <div className='paper'>
      <div className='paper-head'>
        <h3>{`学生信息：${stuinfo.stu_name}  (#${stuinfo.stu_no})`}</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>课程号</th>
            <th>班次</th>
            <th>课程名称</th>
            <th>学期</th>
            <th>地点</th>
            <th>时间</th>
            <th>任课教师</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectionStatus[`${stuinfo.stu_no}-${item.course_no}-${item.course_banci}`]

            return (
              <tr key={`${item.course_sn}`}>
                <td>{item.course_sn}</td>
                <td>{item.course_no}</td>
                <td>{item.course_banci}</td>
                <td>{item.course_name}</td>
                <td>{item.course_xueqi}</td>
                <td>{item.course_didian}</td>
                <td>{item.course_shijian}</td>
                <td>{item.course_teacher}</td>
                <td>
                  <button
                    className='btn'
                    onClick={() => handleSelect(stuinfo.stu_no, item.course_no, item.course_banci)}
                  >
                    {isSelected ? '退课' : '选课'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
