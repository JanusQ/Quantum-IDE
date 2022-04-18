import React, { useState } from 'react'
import Layout from './Layout'
import '../styles/Computer.css'
import { Input, Drawer, Table } from 'antd'

const Computer = () => {
	const { Search } = Input
	const onSearch = (value) => console.log(value)
	const [visible, setVisible] = useState(false)
	const showDrawer = () => {
		setVisible(true)
	}
	const onClose = () => {
		setVisible(false)
	}
	const columns = [
		{
			title: '量子位',
			dataIndex: 'name',
			render: (text) => <a>{text}</a>,
			align: 'center',
		},
		{
			title: 'single qubit error',
			className: 'column-money',
			dataIndex: 'money',
			align: 'center',
		},
		{
			title: 'two qubit error',
			dataIndex: 'address',
			align: 'center',
		},
	]

	const data = [
		{
			key: '1',
			name: 'John Brown',
			money: '￥300,000.00',
			address: 'New York No. 1 Lake Park',
		},
		{
			key: '2',
			name: 'Jim Green',
			money: '￥1,256,000.00',
			address: 'London No. 1 Lake Park',
		},
		{
			key: '3',
			name: 'Joe Black',
			money: '￥120,000.00',
			address: 'Sidney No. 1 Lake Park',
		},
	]
	return (
		<Layout>
			<Search
				placeholder='请输入量子计算机名称进行检索'
				onSearch={onSearch}
				size='large'
				className='computer_search'
			/>
			<div className='computer_list'>
				<div className='computer_item' onClick={showDrawer}>
					<div className='computer_name'>Quantum computer name</div>
					<div style={{ marginBottom: '8px' }}>
						<span>Status:</span>
						<span>online</span>
					</div>
					<div style={{ marginBottom: '8px' }}>Number of qubits:int</div>
					<div className='computer_number'>
						<div className='computer_number_item'>
							<div className='compuer_number_name'>Qubites</div>
							<div className='compuer_number_contet'>127</div>
						</div>
						<div className='computer_number_item'>
							<div className='compuer_number_name'>QV</div>
							<div className='compuer_number_contet'>127</div>
						</div>
						<div className='computer_number_item'>
							<div className='compuer_number_name'>CLOPS</div>
							<div className='compuer_number_contet'>127</div>
						</div>
					</div>
				</div>
                <div className='computer_item' onClick={showDrawer}>
					<div className='computer_name'>Quantum computer name</div>
					<div style={{ marginBottom: '8px' }}>
						<span>Status:</span>
						<span>online</span>
					</div>
					<div style={{ marginBottom: '8px' }}>Number of qubits:int</div>
					<div className='computer_number'>
						<div className='computer_number_item'>
							<div className='compuer_number_name'>Qubites</div>
							<div className='compuer_number_contet'>127</div>
						</div>
						<div className='computer_number_item'>
							<div className='compuer_number_name'>QV</div>
							<div className='compuer_number_contet'>127</div>
						</div>
						<div className='computer_number_item'>
							<div className='compuer_number_name'>CLOPS</div>
							<div className='compuer_number_contet'>127</div>
						</div>
					</div>
				</div>
			</div>
			<Drawer title='quantum computer name' placement='right' onClose={onClose} visible={visible} width={900}>
				<div className='computer_params_div'>
					<p style={{ fontSize: '16px' }}>参数</p>
					<div className='computer_params_detail'>
						<div className='computer_params_detail_div'>
							<div className='computer_params_detail_item'>
								<div className='computer_params_detail_num'>127</div>
								<div className='computer_params_detail_name'>Qubits</div>
							</div>
							<div className='computer_params_detail_item'>
								<div className='computer_params_detail_num'>64</div>
								<div className='computer_params_detail_name'>QV</div>
							</div>
							<div className='computer_params_detail_item'>
								<div className='computer_params_detail_num'>850</div>
								<div className='computer_params_detail_name'>CLOPS</div>
							</div>
						</div>
						<div>
							<div className='computer_params_right_item'>status:online</div>
							<div className='computer_params_right_item'>number of qubits: 40</div>
							<div className='computer_params_right_item'>Avg.T1: xxx us</div>
							<div className='computer_params_right_item'>Avg.T2: xxx us</div>
						</div>
					</div>
				</div>
				<div className='computer_number_div'>
					<p className='computer_number_title'>数据矫正</p>
					<Table columns={columns} dataSource={data} bordered pagination={false} />
				</div>
			</Drawer>
		</Layout>
	)
}

export default Computer
