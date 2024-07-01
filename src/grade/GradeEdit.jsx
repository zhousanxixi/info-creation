import { useParams } from 'react-router-dom'
import GradeDetail from './GradeDetail'
import useSWR from 'swr'
import { fetcher } from '../utils'

function GradeEdit (props) {
  const { stuSn, couSn } = useParams()

  console.log(`stuSn: ${stuSn} couSn: ${couSn}`)

  // 读取学生数据
  const { data: grade_info, error } = useSWR(`/api/grade/${stuSn}/${couSn}`, fetcher)

  if (error) {
    return (
      <div className='paper'>
        <div>数据加载失败</div>
      </div>
    )
  }

  if (!grade_info) {
    return (
      <div className='paper'>
        <div>数据加载中...</div>
      </div>
    )
  }

  return (
    <div className='paper'>
      <div className='paper-head'>
        <h3>
          {`学生信息：${grade_info.stu_name} (#${grade_info.cou_name})`}
        </h3>
      </div>
      <GradeDetail grade_info={grade_info} />
    </div>
  )
}

export default GradeEdit
