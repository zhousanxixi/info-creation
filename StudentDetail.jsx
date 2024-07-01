import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentDetail (props) {
  const { stuinfo } = props
  const formRef = useRef(null)
  const navigate = useNavigate()

  const [isDirty, setDirty] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)

  //　空表单或获取学生信息后，给表单设置初始值
  useEffect(() => {
    if (!formRef.current) return

    if (!stuinfo) return

    const elements = formRef.current.elements

    elements.stu_no.value = stuinfo.stu_no ?? ''
    elements.stu_name.value = stuinfo.stu_name ?? ''
    elements.gender.value = stuinfo.gender ?? ''
    elements.enrolled.value = stuinfo.enrolled ?? ''
    elements.academy.value = stuinfo.academy ?? ''
    elements.grade.value = stuinfo.grade ?? ''
    elements.class_.value = stuinfo.class_ ?? ''

    setDirty(false)
  }, [stuinfo])

  const checkChange = (e) => {
    if (!formRef.current) return

    if (stuinfo.stu_sn === null) {
      if (!isDirty) setDirty(true)
      return
    }

    for (const fieldName of ['stu_no', 'stu_name', 'gender', 'enrolled', 'academy', 'grade', 'class_']) {
      if (
        stuinfo[fieldName] !== formRef.current.elements[fieldName].value
      ) {
        if (!isDirty) setDirty(true)
        return
      }
    }

    if (isDirty) {
      setDirty(false)
    }
  }

  const saveAction = async () => {
    if (!formRef.current) return

    const elements = formRef.current.elements
    const data = {
      stu_sn: stuinfo.stu_sn,
      stu_no: elements.stu_no.value,
      stu_name: elements.stu_name.value,
      gender: elements.gender.value,
      enrolled: elements.enrolled.value,
      academy: elements.academy.value,
      grade: elements.grade.value,
      class_: elements.class_.value
    }

    let url, http_method
    if (data.stu_sn === null) {
      // 新建学生记录
      url = '/api/student'
      http_method = 'POST'
    } else {
      // 更新学生记录信息
      url = `/api/student/${stuinfo.stu_sn}`
      http_method = 'PUT'
    }

    try {
      setBusy(true) // 开始向服务提交请求，设置为忙

      // 向服务器发送请求
      const response = await fetch(url, {
        method: http_method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data) // 将data对象序列化为JSON的字符串
      })

      if (!response.ok) {
        // TODO: 较草率处理错误
        const payload = await response.json()
        setActionError(payload.error.message)
        console.error(response)
        return
      }

      const student = await response.json()

      if (stuinfo.stu_sn === null) {
        // 创建新学生记录后，按照新分配的序号重新加载学生信息
        navigate(`/students/${student.stu_sn}`)
      }
    } finally {
      setBusy(false) // 动作结束，设置为非忙
    }
  }

  return (
  // 标签<> </>在JSX表示嵌套是一段JSX元素的片段
    <>
      <div className='paper-body'>
        <form ref={formRef}>
          <div className='field'>
            <label>学号: </label>
            <input
              type='text'
              name='stu_no'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>姓名: </label>
            <input
              type='text'
              name='stu_name'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>性别: </label>
            <div className='radio-choices'>
              <span className='option'>
                男
                <input
                  type='radio'
                  name='gender'
                  value='男'
                  onChange={checkChange}
                />
              </span>
              <span className='option'>
                女
                <input
                  type='radio'
                  name='gender'
                  value='女'
                  onChange={checkChange}
                />
              </span>
            </div>
          </div>
          <div className='field'>
            <label>入学时间: </label>
            <input
              type='date'
              name='enrolled'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>学院: </label>
            <input
              type='text'
              name='academy'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>年级: </label>
            <input
              type='text'
              name='grade'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>班级: </label>
            <input
              type='text'
              name='class_'
              onChange={checkChange}
            />
          </div>
        </form>
      </div>
      <div className='paper-footer'>
        <div className='btns'>
          <button
            className='btn'
            onClick={saveAction}
            disabled={isBusy || !isDirty}
          >
            保存
          </button>
          <button
            className='btn'
            onClick={() => {
              navigate('/students')
            }}
          >
            返回
          </button>
        </div>
      </div>
      <div className='statusbar'>
        {isBusy && <div className='message'>处理中，请稍后...</div>}
        {actionError && (
          <div className='message error'>
            <span>发生错误：{actionError}</span>
            <button onClick={() => setActionError(null)}>X</button>
          </div>
        )}
      </div>
    </>
  )
}

export default StudentDetail
