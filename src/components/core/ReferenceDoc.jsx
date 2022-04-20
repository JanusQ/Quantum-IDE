import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import '../styles/ReferenceDoc.css'
import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css'
import axios from 'axios'
const ReferenceDoc = () => {
	const [md, setMd] = useState('loading... ...')
	useEffect(() => {
		axios.get('./test.md').then((res) => {
			console.log(res)
			setMd(res.data)
		})
	}, [])
	return (
		<Layout>
			<div className='doc_div'>
				<div className='doc_left_menu'>
					<div className='doc_left_menu_title'>参考文档</div>
					<ul className='doc_left_menu_list'>
						<li className='active'>abc</li>
					</ul>
				</div>
				<div className='doc_content'>
					<ReactMarkdown plugins={[[gfm, { singleTilde: false }]]} allowDangerousHtml>
						{md}
					</ReactMarkdown>
				</div>
			</div>
		</Layout>
	)
}

export default ReferenceDoc
