import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Layout from './Layout'
import '../styles/Home.css'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { getNoticeList } from '../../api/notice'
const Home = () => {
	const state = useSelector((state) => state)
	const getNoticeListFn = async () => {
		await getNoticeList()
	}
	useEffect(() => {
		getNoticeListFn()
	}, [])
	return (
		<Layout>
			<div className='home_div'>
				<div className='home_left_div'>
					<div className='home_title'>Welcome,IBM</div>
					<div className='home_banner'>
						
						<Button type='primary' className='home_banner_btn'>
							<Link to='/'>Launch Quantum IDE</Link>
						</Button>
					</div>
				</div>

				<div className='home_notice'>
					<div className='home_notice_head'>
						<span className='home_notice_title'>通知</span>
						<span style={{ float: 'right' }}>
							{' '}
							<Link to='/'>查看全部</Link>
						</span>
					</div>
					<ul className='home_notice_list_ul'>
						<li className='home_notice_list'>
							<div className='home_notice_list_title'>
								<span className='home_notice_list_circle'></span>
								<span className='home_notice_list_name'>年后你好</span>
							</div>
							<div className='home_notice_list_content'>年后你好年后你好年后你好</div>
							<div className='home_notice_list_footer'>
								<span>2012-04-12</span>
								<span style={{ margin: '0 10px', display: 'inline-block' }}>|</span>
								<span>查看更多</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</Layout>
	)
}
export default Home
