import AdminLayout from './AdminLayout'
import React, { useState, useEffect } from 'react'
import '../adminStyles/AdminNotice.css'
import { Table, Button, Modal, Form, Input } from 'antd'
import { Link } from 'react-router-dom'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, DomEditor } from '@wangeditor/editor'
const AdminNotice = () => {
	const columns = [
		{
			title: '序号',
			dataIndex: 'index',
			render: (text, record, index) => {
				return (pagination.current - 1) * pagination.pageSize + index + 1
			},
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				return <Link to='/'>{text}</Link>
			},
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
	]
	const data = [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park',
			tags: ['nice', 'developer'],
		},
		{
			key: '2',
			name: 'Jim Green',
			age: 42,
			address: 'London No. 1 Lake Park',
			tags: ['loser'],
		},
		{
			key: '3',
			name: 'Joe Black',
			age: 32,
			address: 'Sidney No. 1 Lake Park',
			tags: ['cool', 'teacher'],
		},
	]
	const [current, setCurrent] = useState(1)
	const [total, setTotal] = useState(100)
	const [pageSize, setPageSize] = useState(10)
	const onChange = (page, pageSize) => {
		setPageSize(pageSize)
		setCurrent(page)
	}
	const pagination = {
		current: current,
		total: total,
		pageSize: pageSize,
		onChange: onChange,
		showTotal: (total) => `共 ${total} 条数据`,
		showQuickJumper: true,
	}
	const [isAddModalVisible, setIsAddModalVisible] = useState(false)
	const addCancel = () => {
		setIsAddModalVisible(false)
	}
	const addOk = () => {
		setIsAddModalVisible(false)
		console.log(html)
		const toolbar = DomEditor.getToolbar(editor)
		console.log(toolbar.getConfig().toolbarKeys)
	}
	const [addForm] = Form.useForm()
	const [editor, setEditor] = useState(null) // 存储 editor 实例
	const [html, setHtml] = useState('') // 编辑器内容
	const toolbarConfig = {
		excludeKeys: [
			'fullScreen',
			'fontFamily',
			// 'headerSelect',
			// 'italic',
			// 'group-more-style',
		],
	}
	const editorConfig = {
		placeholder: '请输入内容...',
	}
	const [noticeTile, setNoticeTile] = useState('')
	const noticeTitleChange = (e) => {
		setNoticeTile(e.target.value)
	}
	useEffect(() => {
		return () => {
			if (editor == null) return
			editor.destroy()
			setEditor(null)
		}
	}, [editor])
	const addModal = () => {
		return (
			<Modal visible={isAddModalVisible} onCancel={addCancel} onOk={addOk} title='添加公告' width={820}>
				<p>公告标题</p>
				<Input style={{ marginBottom: '1em' }} value={noticeTile} onChange={noticeTitleChange}></Input>
				<p>公告内容</p>
				<Toolbar
					editor={editor}
					defaultConfig={toolbarConfig}
					mode='simple'
					style={{ borderBottom: '1px solid #ccc' }}
				/>
				<Editor
					defaultConfig={editorConfig}
					value={html}
					onCreated={setEditor}
					onChange={(editor) => setHtml(editor.getHtml())}
					mode='default'
					style={{ height: '500px', 'overflow-y': 'hidden' }}
				/>
			</Modal>
		)
	}
	const addNotice = () => {
		setIsAddModalVisible(true)
	}

	return (
		<AdminLayout>
			<div className='admin_notice_operation'>
				<Button type='primary' onClick={addNotice}>
					添加
				</Button>
			</div>
			<div className='admin_notice_div'>
				<Table columns={columns} dataSource={data} pagination={pagination} />
			</div>
			{addModal()}
		</AdminLayout>
	)
}

export default AdminNotice
