import CourseDetail from './CourseDetail'

function CourseNew (props) {
  const couinfo = {
    cou_sn: null
  }

  return (
    <div className='paper'>
      <div className='paper-head'>
        <h3>新建课程信息</h3>
      </div>
      <CourseDetail couinfo={couinfo} />
    </div>
  )
}

export default CourseNew
