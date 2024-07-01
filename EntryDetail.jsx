import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EntryDetail (props) {
  const { grade_info } = props
  const formRef = useRef(null)
  const navigate = useNavigate()

  const [isDirty, setDirty] = useState(false)
  const [isBusy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)

  //　空表单或获取课程信息后，给表单设置初始值
  useEffect(() => {
    if (!formRef.current) return

    if (!grade_info) return

    const elements = formRef.current.elements

    elements.grade.value = grade_info.grade ?? ''

    setDirty(false)
  }, [grade_info])

  const checkChange = (e) => {
    if (!formRef.current) return

    if (grade_info.cou_sn === null) {
      if (!isDirty) setDirty(true)
      return
    }

    for (const fieldName of ['grade']) {
      if (
        grade_info[fieldName] !== formRef.current.elements[fieldName].value
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
      grade: elements.grade.value
    }

    let url, http_method
    if (data.cou_sn === null) {
      navigate('/grades')
    } else {
      // 修改成绩信息
      url = `/api/grade/${grade_info.stu_sn}/${grade_info.cou_sn}`
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
      }
    } finally {
      setBusy(false) //  动作结束，设置为非忙
    }
  }

  return (
    <>
      <div className='paper-body'>
        <form ref={formRef}>
          <div className='field'>
            <label>成绩: </label>
            <input
              type='text'
              name='grade'
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
              navigate(`/entry/${grade_info.cou_sn}`)
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
