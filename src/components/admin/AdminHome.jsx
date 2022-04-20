import React, { useState } from 'react'
import AdminLayout from './AdminLayout'
import '../adminStyles/AdminHome.css'
import { DatePicker, Button } from 'antd'
import moment from 'moment'
const AdminHome = () => {
	const { RangePicker } = DatePicker
	const staticDiv = () => {
		return (
			<div className='admin_home_static_div'>
				<div className='admin_home_static_item'>
					<p className='admin_home_static_number'>2000</p>
					<p className='admin_home_static_name'>累计任务总数</p>
				</div>
				<div className='admin_home_static_item'>
					<p className='admin_home_static_number'>2000</p>
					<p className='admin_home_static_name'>处理中任务数</p>
				</div>
				<div className='admin_home_static_item'>
					<p className='admin_home_static_number'>2000</p>
					<p className='admin_home_static_name'>计算机总数</p>
				</div>
				<div className='admin_home_static_item'>
					<p className='admin_home_static_number'>2000</p>
					<p className='admin_home_static_name'>用户总数</p>
				</div>
			</div>
		)
	}
	const [dateValue, setDateValue] = useState([])
	const dateChange = (date) => {
		setDateValue(date)
	}
	const setTime = (value) => {
		setDateValue([moment(), moment().add(value, 'd')])
	}
	const selectTime = () => {
		return (
			<div className='admin_home_select_time'>
				<RangePicker value={dateValue} onChange={dateChange} style={{ float: 'right' }}></RangePicker>
				<Button style={{ float: 'right', marginRight: '10px' }} onClick={() => setTime(30)}>
					近30天
				</Button>
				<Button style={{ float: 'right', marginRight: '10px' }} onClick={() => setTime(15)}>
					近15天
				</Button>
				<Button style={{ float: 'right', marginRight: '10px' }} onClick={() => setTime(7)}>
					近7天
				</Button>
			</div>
		)
	}
	const staticEcharts = () => {}
	return (
		<AdminLayout>
			{staticDiv()}
			{selectTime()}
		</AdminLayout>
	)
}

export default AdminHome
