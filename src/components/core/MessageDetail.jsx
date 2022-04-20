import React from 'react'
import Layout from './Layout'
import '../styles/MessageDetail.css'
import { Button, Modal } from 'antd'
const messageDetail = () => {
	const deleteMessage = () => {
		Modal.confirm({
			title: '确认删除？',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {},
		})
	}
	return (
		<Layout>
			<div className='message_detail'>
				<div className='message_detail_title'>消息详情</div>
				<div className='message_content'>
					<div className='message_content_header'>
						<Button size='large' onClick={deleteMessage}>
							删除
						</Button>
						<Button size='large'>返回</Button>
						<Button size='large'>下一封</Button>
						<Button size='large'>上一封</Button>
					</div>
					<div className='message_content_title'>
						<p>你的xxx项目已完成</p>
						<p>发件人：系统管理员</p>
						<p>收件人：wnn</p>
						<p>时间：2022-04-20 15:20</p>
					</div>
					<div className='message_content_text'>
						<p>你的xxx项目已完成</p>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default messageDetail
