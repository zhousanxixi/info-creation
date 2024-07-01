import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CourseDetail (props) {
  const { couinfo } = props
  const formRef = useRef(null)
  const navigate = useNavigate()

  const [isDirty, setDirty] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)

  //　空表单或获取课程信息后，给表单设置初始值
  useEffect(() => {
    if (!formRef.current) return

    if (!couinfo) return

    const elements = formRef.current.elements

    elements.cou_no.value = couinfo.cou_no ?? ''
    elements.cou_name.value = couinfo.cou_name ?? ''
    elements.xueqi.value = couinfo.xueqi ?? ''
    elements.credit.value = couinfo.credit ?? ''
    elements.time.value = couinfo.time ?? ''
    elements.teacher.value = couinfo.teacher ?? ''
    elements.banci.value = couinfo.banci ?? ''
    elements.didian.value = couinfo.didian ?? ''
    elements.shijian.value = couinfo.shijian ?? ''

    setDirty(false)
  }, [couinfo])

  const checkChange = (e) => {
    if (!formRef.current) return

    if (couinfo.cou_sn === null) {
      if (!isDirty) setDirty(true)
      return
    }

    for (const fieldName of ['cou_no', 'cou_name', 'xueqi', 'credit', 'time', 'teacher', 'banci', 'didian', 'shijian']) {
      if (
        couinfo[fieldName] !== formRef.current.elements[fieldName].value
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
      cou_sn: couinfo.cou_sn,
      cou_no: elements.cou_no.value,
      cou_name: elements.cou_name.value,
      xueqi: elements.xueqi.value,
      credit: elements.credit.value,
      time: elements.time.value,
      teacher: elements.teacher.value,
      banci: elements.banci.value,
      didian: elements.didian.value,
      shijian: elements.shijian.value
    }

    let url, http_method
    if (data.cou_sn === null) {
      // 新建课程记录
      url = '/api/course'
      http_method = 'POST'
    } else {
      // 更新课程信息
      url = `/api/course/${couinfo.cou_sn}`
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
        const payload = await response.json()
        setActionError(payload.error.message)
        console.error(response)
        return
      }

      const course = await response.json()

      if (couinfo.cou_sn === null) {
        // 创建新课程后，按照新分配的序号重新加载课程
        navigate(`/courses/${course.cou_sn}`)
      }
    } finally {
      setBusy(false) // 动作结束，设置为非忙
    }
  }

  return (
    <>
      <div className='paper-body'>
        <form ref={formRef}>
          <div className='field'>
            <label>课程号: </label>
            <input
              type='text'
              name='cou_no'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>班次: </label>
            <input
              type='text'
              name='banci'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>课程名称: </label>
            <input
              type='text'
              name='cou_name'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>学期: </label>
            <input
              type='text'
              name='xueqi'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>学分: </label>
            <input
              type='text'
              name='credit'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>学时: </label>
            <input
              type='text'
              name='time'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>时间: </label>
            <input
              type='text'
              name='shijian'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>地点: </label>
            <input
              type='text'
              name='didian'
              onChange={checkChange}
            />
          </div>
          <div className='field'>
            <label>任课教师: </label>
            <input
              type='text'
              name='teacher'
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
              navigate('/courses')
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

export default CourseDetail
