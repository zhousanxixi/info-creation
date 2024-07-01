import { useParams } from 'react-router-dom'
import CourseDetail from './CourseDetail'
import useSWR from 'swr'
import { fetcher } from '../utils'

function CourseEdit (props) {
  const { couSn } = useParams()

  console.log(`couSn: ${couSn}`)

  // 读取课程数据
  const { data: couinfo, error } = useSWR(`/api/course/${couSn}`, fetcher)

  if (error) {
    return (
      <div className='paper'>
        <div>数据加载失败</div>
      </div>
    )
  }

  if (!couinfo) {
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
          {`课程信息：${couinfo.cou_name} (#${couinfo.cou_sn})`}
        </h3>
      </div>
      <CourseDetail couinfo={couinfo} />
    </div>
  )
}

export default CourseEdit
