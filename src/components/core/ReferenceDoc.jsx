import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import '../styles/ReferenceDoc.css'
import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css'
import axios from 'axios'
import { getDocList, getDoc } from '../../api/doc'
import Editor from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { string } from 'mathjs'
import { message } from 'antd'
import { useParams } from 'react-router-dom'
import { FileTextOutlined } from '@ant-design/icons'
import ComponentTitle from './ComponentTitle'
const ReferenceDoc = () => {
	const { docId } = useParams()
	const getDocListFn = async () => {
		const { data } = await getDocList()
		setDocList(data.doc_list.reverse())
		if (docId === 'all') {
			getDocFn(data.doc_list[0].doc_id)
			setActiveId(data.doc_list[0].doc_id)
		} else {
			getDocFn(docId)
			setActiveId(Number(docId))
		}
	}
	const [docList, setDocList] = useState([])
	const [text, setText] = useState('loading...')
	const [activeId, setActiveId] = useState(-1)
	const [isShowMenu, setIsShowMenu] = useState(true)
	const docLi = docList.map((item) => (
		<li
			style={{ display: isShowMenu ? 'block' : 'none' }}
			className={item.doc_id === activeId ? 'active' : ''}
			onClick={() => getDocFn(item.doc_id)}
			key={item.doc_id}
		>
			<span className='content_text'>
				<span className='content_icon'>
					<FileTextOutlined style={{ fontSize: '28px' }} />
				</span>
				<span className='content_text_detail' title={item.doc_title}>{item.doc_title}</span>
			</span>
		</li>
	))
	
	const getDocFn = async (id) => {
		try {
			setActiveId(id)
			const formData = new FormData()
			formData.append('doc_id', id)
			const { data } = await getDoc(formData)
			setText(data)
		} catch {
			message.error('请求文档失败')
		}
	}
	useEffect(() => {
		getDocListFn()
	}, [])

	const menuClick = () => {
		setIsShowMenu(!isShowMenu)
	}

	return (
		<Layout>
			<ComponentTitle name={'参考文档'}></ComponentTitle>
			<div className='doc_div'>
				<div className='doc_left_menu' style={{ width: isShowMenu ? '200px' : '66px' }}>
					<div className='doc_left_menu_title'>
						<span className='doc_left_menu_title_icon' onClick={menuClick}></span>
					</div>
					<ul
						className='doc_left_menu_list'
						style={{
							width: isShowMenu ? '200px' : '0',
						}}
					>
						{docLi}
					</ul>
				</div>
				<div className='doc_content'>
					{/* <ReactMarkdown plugins={[[gfm, { singleTilde: false }]]} allowDangerousHtml>
						{md}
					</ReactMarkdown> */}
					<Editor modelValue={text} previewOnly={true} previewTheme='github' />
				</div>
			</div>
		</Layout>
	)
}

export default ReferenceDoc
