import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { Table, Input, Select, Drawer, message, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import '../styles/Project.css'
import { drawGraphChart } from '../../helpers/graphEcharts'
import { useHistory } from 'react-router-dom'
import { getProList, delPro } from '../../api/project'
import { isAuth } from '../../helpers/auth'
import moment from 'moment'
import '../styles/CommonAntDesign.css'
import ComponentTitle from './ComponentTitle'
import { createPro } from '../../api/test_circuit'
const Project = () => {
		

	const auth = isAuth()
	const history = useHistory()
	const columns = [
		{
			title: '序号',
			dataIndex: 'index',
			width: 150,
			render: (text, record, index) => {
				return (pagination.current - 1) * pagination.pageSize + index + 1
			},
			ellipsis:true
		},
		{
			title: '项目名称',
			dataIndex: 'project_name',
			key: 'project_name',
			ellipsis:true
			// render: (text, record) => {
			// 	return <a onClick={() => loadPro(record)}>{text}</a>
			// },
		},
		{
			title: '任务个数',
			dataIndex: 'task_num',
			key: 'task_num',
			ellipsis:true
		},
		{
			title: '创建时间',
			dataIndex: 'created_time',
			key: 'created_time',
			render: (text) => {
				return moment(text).format('YYYY-MM-DD HH:MM:SS')
			},
			ellipsis:true
		},
		{
			title: '操作',
			dataIndex: 'step',
			key: 'step',
			width: 300,
			render: (text, record) => {
				return (
					<span>
						<Button
							type='link'
							onClick={() => {
								loadPro(record)
							}}
							style={{ marginRight: '39px', padding: '0' }}
						>
							编辑项目
						</Button>
						<Button
							type='link'
							onClick={() => {
								lookTask(record)
							}}
							style={{ marginRight: '39px', padding: '0' }}
							disabled={record.task_num === 0}
						>
							查看任务详情
						</Button>
						<a onClick={() => deleteTask(record.project_id)}>删除</a>
					</span>
				)
			},
		},
	]
	const loadPro = (record) => {
		history.push({ pathname: `/aceComputer/${record.project_name}/${record.project_id}` })
	}
	const [projectList, setProjectList] = useState([])
	const { Search } = Input
	const { Option } = Select
	const [searchValue, setSearchValue] = useState('')
	const searchValueChange = (e) => {
		setSearchValue(e.target.value)
	}
	const onSearch = () => {
		getProListFn()
	}
	const statusChange = (value) => {
		// console.log(value)
	}
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
	const [visible, setVisible] = useState(false)
	const lookTask = (record) => {
		if (record.task_num) {
			history.push(`/task/${record.project_id}/${record.project_name}`)
		} else {
			message.error('所选项目暂无任务提交')
		}
	}
	// 删除
	const deleteTask = (id) => {
		Modal.confirm({
			title: '确认删除？',
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				const formData = new FormData()
				formData.append('project_id', id)
				formData.append('user_id', auth.user_id)
				await delPro(formData)
				message.success('已删除')
				getProListFn()
			},
		})
	}
	const onClose = () => {
		setVisible(false)
	}
	// 获取项目列表
	const getProListFn = async () => {
		const formData = new FormData()
		formData.append('user_id', auth.user_id)
		if (searchValue) {
			formData.append(
				'filter',
				JSON.stringify({
					project_name: searchValue,
				})
			)
		}
		const { data } = await getProList(formData)
		setProjectList(data.project_list.reverse())
	}
	useEffect(() => {
		getProListFn()
	}, [])
	// 创建项目
	const [isSaveCaseModalVisible, setIsSaveCaseModalVisible] = useState(false);
  const [caseName, setCaseName] = useState("");

	const gotoComputer = () => {
    if (!auth) {
      message.error("请先登录");
      history.push("/signin/1");
      return;
    }
    setIsSaveCaseModalVisible(true);
  };
	const onSaveChange = (e) => {
    setCaseName(e.target.value);
  };
		const isSaveCancel = () => {
		setIsSaveCaseModalVisible(false)
		setCaseName('')
	}
		const isSaveOk = async () => {
		if (!caseName) {
			message.error('请输入项目名称')
			return
		}
		const formdata = new FormData()
		formdata.append('user_id', auth.user_id)
		formdata.append('project_name', caseName)
		const { data } = await createPro(formdata)
		history.push({ pathname: `/aceComputer/${caseName}/${data.project_id}` })
		setIsSaveCaseModalVisible(false)
	}
	return (
    <Layout>
      <ComponentTitle name={"项目列表"}></ComponentTitle>
      <div className="project_div">
        <div className="project_search_div">
          <Search
            placeholder="请输入项目名称"
            onSearch={onSearch}
            value={searchValue}
            onChange={searchValueChange}
            enterButton
            style={{ marginBottom: "40px" }}
          />
          {/* <Select
						placeholder='请选择运行状态'
						style={{ width: 200, marginLeft: '20px' }}
						onChange={statusChange}
					>
						<Option value='1'>等待中</Option>
					</Select>
					<Select
						placeholder='请选择项目阶段'
						style={{ width: 200, marginLeft: '20px' }}
						onChange={statusChange}
					>
						<Option value='1'>已启动</Option>
					</Select> */}
        </div>
        <div className="addProject">
          <Button onClick={gotoComputer} type="primary">
            添加
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={projectList}
          pagination={false}
          style={{ marginBottom: "20px" }}
          rowKey="project_id"
        />
      </div>
      <Drawer
        title="quantum computer name"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={900}
      >
        <div className="computer_params_div">
          <p style={{ fontSize: "16px" }}>参数</p>
          <div className="computer_params_detail">
            <div className="computer_params_detail_div">
              <div className="computer_params_detail_item">
                <div className="computer_params_detail_num">127</div>
                <div className="computer_params_detail_name">Qubits</div>
              </div>
              <div className="computer_params_detail_item">
                <div className="computer_params_detail_num">64</div>
                <div className="computer_params_detail_name">QV</div>
              </div>
              <div className="computer_params_detail_item">
                <div className="computer_params_detail_num">850</div>
                <div className="computer_params_detail_name">CLOPS</div>
              </div>
            </div>
            <div>
              <div className="computer_params_right_item">status:online</div>
              <div className="computer_params_right_item">
                number of qubits: 40
              </div>
              <div className="computer_params_right_item">Avg.T1: xxx us</div>
              <div className="computer_params_right_item">Avg.T2: xxx us</div>
            </div>
          </div>
        </div>
        {/* <div className='computer_number_div'>
					<p className='computer_number_title'>数据矫正</p>
					<Table columns={columns} dataSource={data} bordered pagination={false} />
				</div> */}
        <div
          id="computer_params_graph"
          style={{ height: "300px", width: "100%" }}
        ></div>
      </Drawer>
      <Modal onOk={isSaveOk} onCancel={isSaveCancel} visible={isSaveCaseModalVisible} title='保存项目'>
        <p>项目名称</p>
        <Input value={caseName} onChange={onSaveChange} ></Input>
      </Modal>
    </Layout>
  );
}

export default Project
